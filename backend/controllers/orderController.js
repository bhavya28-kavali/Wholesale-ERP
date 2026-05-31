import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import StockHistory from '../models/StockHistory.js';
import { nextSequence } from '../utils/invoiceNumber.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import { emitEvent } from '../socket/socket.js';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const ACTIVE_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

const calcTotals = (items) => {
  let subtotal = 0;
  let gstAmount = 0;
  items.forEach((item) => {
    const taxable = item.quantity * item.unitPrice;
    const gst = (taxable * item.gstPercent) / 100;
    subtotal += taxable;
    gstAmount += gst;
    item.lineTotal = taxable + gst;
  });
  return { subtotal, gstAmount, total: subtotal + gstAmount, items };
};
const adjustStock = async (
  productId,
  delta,
  reason,
  userId,
  session
) => {
  const product = await Product.findById(productId).session(session);

  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }

  const prevQty = product.quantity;
  const newQty = prevQty + delta;

  if (newQty < 0) {
    throw new Error(
      `Insufficient stock for ${product.name}. Available: ${prevQty}`
    );
  }

  product.quantity = newQty;

  await product.save({ session });

  // Existing stock history
  await StockHistory.create(
    [
      {
        product: product._id,
        previousQty: prevQty,
        newQty,
        change: delta,
        reason,
        changedBy: userId,
      },
    ],
    { session }
  );

  // Inventory audit trail
  await InventoryTransaction.create(
    [
      {
        product: product._id,
        previousQty: prevQty,
        newQty,
        action:
          reason === 'order'
            ? 'ORDER_CREATED'
            : reason === 'order_cancelled'
            ? 'ORDER_CANCELLED'
            : reason === 'order_reopened'
            ? 'ORDER_REOPENED'
            : reason === 'stock_received'
            ? 'STOCK_RECEIVED'
            : 'PRODUCT_UPDATED',

        performedBy: userId,
      },
    ],
    { session }
  );

  return product;
};

const restoreOrderStock = async (order, userId, session) => {
  for (const item of order.items) {
    await adjustStock(item.product, item.quantity, 'order_cancelled', userId, session);
  }
};

const deductOrderItems = async (itemsInput, userId, session) => {
  const orderItems = [];
  for (const item of itemsInput) {
    await adjustStock(item.productId, -item.quantity, 'order', userId, session);
    const product = await Product.findById(item.productId).session(session);
    orderItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      unitPrice: product.unitPrice,
      gstPercent: product.gstPercent,
      lineTotal: 0,
    });
  }
  return calcTotals(orderItems);
};

const resolveCustomer = async (body, session) => {
  if (body.customerId) {
    const customer = await Customer.findById(body.customerId).session(session);
    if (!customer) throw new Error('Customer not found');
    return {
      customer: customer._id,
      customerName: customer.name,
      customerEmail: customer.email || body.customerEmail || '',
      customerPhone: customer.phone || body.customerPhone || '',
    };
  }
  if (!body.customerName) throw new Error('Customer is required');
  return {
    customer: body.customerId || undefined,
    customerName: body.customerName,
    customerEmail: body.customerEmail || '',
    customerPhone: body.customerPhone || '',
  };
};

export const getOrders = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { orderNumber: { $regex: req.query.search, $options: 'i' } },
      { customerName: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const orders = await Order.find(filter)
    .populate('items.product', 'name sku')
    .populate('customer', 'name email phone')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product')
    .populate('customer')
    .populate('createdBy', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

export const createOrder = async (req, res) => {
  const { items, notes, status } = req.body;
  if (!items?.length) {
    return res.status(400).json({ message: 'At least one product line is required' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const customerData = await resolveCustomer(req.body, session);
    const totals = await deductOrderItems(items, req.user._id, session);
    const orderNumber = await nextSequence(Order, 'orderNumber', 'ORD-');
    const orderStatus = ORDER_STATUSES.includes(status) ? status : 'pending';
    if (orderStatus === 'cancelled') {
      throw new Error('Cannot create an order with cancelled status');
    }

    const [order] = await Order.create(
      [
        {
          orderNumber,
          ...customerData,
          items: totals.items,
          subtotal: totals.subtotal,
          gstAmount: totals.gstAmount,
          total: totals.total,
          notes: notes || '',
          createdBy: req.user._id,
          status: orderStatus,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

export const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'cancelled') {
    return res.status(400).json({ message: 'Cannot edit a cancelled order' });
  }
  if (['delivered', 'shipped'].includes(order.status)) {
    return res.status(400).json({ message: 'Cannot edit shipped or delivered orders' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await restoreOrderStock(order, req.user._id, session);
    const customerData = await resolveCustomer(
      { ...req.body, customerName: req.body.customerName || order.customerName },
      session
    );
    const totals = await deductOrderItems(req.body.items, req.user._id, session);

    order.customer = customerData.customer;
    order.customerName = customerData.customerName;
    order.customerEmail = customerData.customerEmail;
    order.customerPhone = customerData.customerPhone;
    order.items = totals.items;
    order.subtotal = totals.subtotal;
    order.gstAmount = totals.gstAmount;
    order.total = totals.total;
    order.notes = req.body.notes ?? order.notes;
    await order.save({ session });

    await session.commitTransaction();
    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Order not found' });
    }

    const prev = order.status;
    if (prev === status) {
      await session.commitTransaction();
      return res.json(order);
    }

    if (status === 'cancelled' && ACTIVE_STATUSES.includes(prev)) {
      await restoreOrderStock(order, req.user._id, session);
    } else if (prev === 'cancelled' && ACTIVE_STATUSES.includes(status)) {
      for (const item of order.items) {
        await adjustStock(item.product, -item.quantity, 'order_reopened', req.user._id, session);
      }
    }

    order.status = status;
    await order.save({ session });
    await session.commitTransaction();
    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

export const deleteOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Order not found' });
    }
    if (ACTIVE_STATUSES.includes(order.status)) {
      await restoreOrderStock(order, req.user._id, session);
    }
    await Order.deleteOne({ _id: order._id }).session(session);
    await session.commitTransaction();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};
