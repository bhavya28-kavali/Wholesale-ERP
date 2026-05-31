import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';

/* =========================================================
   UTIL HELPERS
========================================================= */

const isCancelled = { status: { $ne: 'cancelled' } };

const formatDate = (date, format = '%Y-%m-%d') => ({
  $dateToString: { format, date },
});

/* =========================================================
   BASIC DASHBOARD STATS
========================================================= */

export const getDashboardStats = async (req, res) => {
  const [
    totalProducts,
    totalOrders,
    revenueAgg,
    paymentPending,
    paymentPaid,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(isCancelled),

    Order.aggregate([
      { $match: isCancelled },
      { $group: { _id: null, revenue: { $sum: '$total' } } },
    ]),

    Payment.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),

    Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),

    Product.find({ isActive: true }),

    Order.find(isCancelled)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerName total status createdAt'),
  ]);

  const lowStockCount = lowStockProducts.filter(
    (p) => p.quantity <= (p.minStockLevel || 10)
  ).length;

  res.json({
    totalProducts,
    totalOrders,
    totalRevenue: revenueAgg[0]?.revenue || 0,
    pendingPayments: paymentPending[0]?.total || 0,
    pendingPaymentCount: paymentPending[0]?.count || 0,
    paidPayments: paymentPaid[0]?.total || 0,
    lowStockCount,
    recentOrders,
  });
};

/* =========================================================
   SALES CHART (LAST N DAYS)
========================================================= */

export const getSalesChart = async (req, res) => {
  const days = Number(req.query.days || 30);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, ...isCancelled } },
    {
      $group: {
        _id: formatDate('$createdAt', '%Y-%m-%d'),
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(
    data.map((d) => ({
      date: d._id,
      revenue: Math.round(d.revenue * 100) / 100,
      orders: d.orders,
    }))
  );
};

/* =========================================================
   PRODUCT PERFORMANCE
========================================================= */

export const getProductPerformance = async (req, res) => {
  const data = await Order.aggregate([
    { $match: isCancelled },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        sku: { $first: '$items.sku' },
        unitsSold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.lineTotal' },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  res.json(data);
};

/* =========================================================
   ACTIVITY FEED (ORDERS + INVOICES)
========================================================= */

export const getActivityFeed = async (req, res) => {
  const [orders, invoices] = await Promise.all([
    Order.find(isCancelled)
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber customerName total status createdAt'),

    Invoice.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('invoiceNumber customerName grandTotal paymentStatus createdAt'),
  ]);

  const feed = [
    ...orders.map((o) => ({
      id: o._id,
      type: 'order',
      title: o.orderNumber,
      subtitle: o.customerName,
      amount: o.total,
      status: o.status,
      createdAt: o.createdAt,
    })),

    ...invoices.map((i) => ({
      id: i._id,
      type: 'invoice',
      title: i.invoiceNumber,
      subtitle: i.customerName,
      amount: i.grandTotal,
      status: i.paymentStatus,
      createdAt: i.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 12);

  res.json(feed);
};

/* =========================================================
   PROFIT ANALYTICS (DAILY)
========================================================= */

export const getProfitAnalytics = async (req, res) => {
  const days = Number(req.query.days || 30);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await Order.find({
    createdAt: { $gte: startDate },
    ...isCancelled,
  }).populate('items.product', 'costPrice');

  const daily = {};

  orders.forEach((order) => {
    const date = order.createdAt.toISOString().slice(0, 10);

    if (!daily[date]) {
      daily[date] = { date, revenue: 0, cost: 0, profit: 0 };
    }

    daily[date].revenue += order.total;

    order.items.forEach((item) => {
      const costPrice = item.product?.costPrice ?? item.unitPrice * 0.7;
      daily[date].cost += costPrice * item.quantity;
    });

    daily[date].profit = daily[date].revenue - daily[date].cost;
  });

  res.json(Object.values(daily).sort((a, b) => a.date.localeCompare(b.date)));
};

/* =========================================================
   LOW STOCK PREDICTION
========================================================= */

export const getLowStockPrediction = async (req, res) => {
  const products = await Product.find({ isActive: true });

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const sales = await Order.aggregate([
    { $match: { createdAt: { $gte: last30Days }, ...isCancelled } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        unitsSold: { $sum: '$items.quantity' },
      },
    },
  ]);

  const velocity = Object.fromEntries(
    sales.map((s) => [String(s._id), s.unitsSold / 30])
  );

  const result = products
    .map((p) => {
      const rate = velocity[String(p._id)] || 0;

      const daysLeft =
        rate > 0
          ? Math.floor(p.quantity / rate)
          : p.quantity <= (p.lowStockThreshold || 10)
          ? 0
          : 999;

      return {
        _id: p._id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        dailyRate: Number(rate.toFixed(2)),
        daysUntilEmpty: daysLeft,
        risk:
          daysLeft <= 7 ? 'high' : daysLeft <= 14 ? 'medium' : 'low',
      };
    })
    .filter((p) => p.risk !== 'low' || p.quantity <= 10)
    .sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty)
    .slice(0, 10);

  res.json(result);
};

/* =========================================================
   REVENUE BY MONTH
========================================================= */

export const getRevenueByMonth = async (req, res) => {
  const months = Number(req.query.months || 6);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, ...isCancelled } },
    {
      $group: {
        _id: formatDate('$createdAt', '%Y-%m'),
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(
    data.map((d) => ({
      month: d._id,
      revenue: d.revenue,
    }))
  );
};

/* =========================================================
   CATEGORY DISTRIBUTION
========================================================= */

export const getCategoryDistribution = async (req, res) => {
  const data = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        stock: { $sum: '$quantity' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json(
    data.map((d) => ({
      category: d._id || 'General',
      count: d.count,
      stock: d.stock,
    }))
  );
};

/* =========================================================
   LOW STOCK REPORT
========================================================= */

export const getLowStockReport = async (req, res) => {
  const products = await Product.find({
    isActive: true,
    quantity: { $lt: 10 },
  })
    .select('name sku category quantity supplier unitPrice')
    .sort({ quantity: 1 });

  res.json(products);
};