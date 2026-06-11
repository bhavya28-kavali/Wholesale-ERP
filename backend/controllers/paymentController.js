import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Invoice from '../models/Invoice.js';

import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';
import { nextSequence } from '../utils/invoiceNumber.js';

/**
 * -----------------------------------
 * Sync Invoice Payment Status
 * -----------------------------------
 */
const syncInvoiceStatus = async (orderId) => {
  if (!orderId) return;

  const invoice = await Invoice.findOne({ order: orderId });
  if (!invoice) return;

  const paidPayments = await Payment.find({
    order: orderId,
    status: 'paid',
  });

  const totalPaid = paidPayments.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  if (totalPaid >= invoice.grandTotal) {
    invoice.paymentStatus = 'paid';
  } else if (totalPaid > 0) {
    invoice.paymentStatus = 'partial';
  } else {
    invoice.paymentStatus = 'unpaid';
  }

  await invoice.save();
};

/**
 * -----------------------------------
 * Get Payments
 * -----------------------------------
 */
export const getPayments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.method) filter.method = req.query.method;

    if (req.query.search) {
      filter.$or = [
        { paymentNumber: { $regex: req.query.search, $options: 'i' } },
        { customerName: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const payments = await Payment.find(filter)
      .populate('order', 'orderNumber total status')
      .populate('recordedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * -----------------------------------
 * Payment Summary (Analytics)
 * -----------------------------------
 */
export const getPaymentSummary = async (req, res) => {
  try {
    const [paid, pending, byMethod] = await Promise.all([
      Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { status: 'paid' } },
        {
          $group: {
            _id: '$method',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      paidTotal: paid[0]?.total || 0,
      paidCount: paid[0]?.count || 0,
      pendingTotal: pending[0]?.total || 0,
      pendingCount: pending[0]?.count || 0,
      byMethod: byMethod.map((m) => ({
        method: m._id,
        total: m.total,
        count: m.count,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * -----------------------------------
 * Create Manual Payment
 * -----------------------------------
 */
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method, status, notes, paymentDate } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot pay cancelled order' });
    }

    const paymentNumber = await nextSequence(Payment, 'paymentNumber', 'PAY-');

    const payment = await Payment.create({
      paymentNumber,
      order: order._id,
      customerName: order.customerName,
      amount: amount ?? order.total,
      method,
      status: status || 'pending',
      paymentDate: status === 'paid' ? paymentDate || new Date() : paymentDate,
      notes: notes || '',
      recordedBy: req.user._id,
    });

    await syncInvoiceStatus(order._id);

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * -----------------------------------
 * Update Payment
 * -----------------------------------
 */
export const updatePayment = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.status === 'paid' && !updates.paymentDate) {
      updates.paymentDate = new Date();
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await syncInvoiceStatus(payment.order);

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * -----------------------------------
 * Delete Payment
 * -----------------------------------
 */
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await syncInvoiceStatus(payment.order);

    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * -----------------------------------
 * Create Razorpay Order
 * -----------------------------------
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * -----------------------------------
 * Verify Razorpay Payment
 * -----------------------------------
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
      amount,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const invoice = await Invoice.findById(invoiceId).populate('order');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    let payment = await Payment.findOne({ transactionId: razorpay_payment_id });
    if (!payment) {
      const paymentNumber = await nextSequence(Payment, 'paymentNumber', 'PAY-');
      payment = await Payment.create({
        paymentNumber,
        order: invoice.order?._id || invoice.order,
        customerName: invoice.customerName,
        amount,
        method: 'razorpay',
        status: 'paid',
        paymentDate: new Date(),
        notes: `Razorpay Order ID: ${razorpay_order_id}`,
        invoice: invoice._id,
        transactionId: razorpay_payment_id,
      });

      await syncInvoiceStatus(invoice.order?._id || invoice.order);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * -----------------------------------
 * Razorpay Webhook
 * -----------------------------------
 */
export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("Razorpay Webhook secret is not configured in environment variables.");
      return res.status(400).json({ message: 'Webhook secret not configured' });
    }

    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ message: 'Missing webhook signature' });
    }

    const rawPayload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    if (expected !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body.event;

    if (event === 'payment.captured') {
      const paymentData = req.body.payload.payment.entity;
      const invoiceId = paymentData.notes?.invoiceId;

      if (invoiceId) {
        const invoice = await Invoice.findById(invoiceId).populate('order');
        if (invoice) {
          const existing = await Payment.findOne({ transactionId: paymentData.id });
          if (!existing) {
            const paymentNumber = await nextSequence(Payment, 'paymentNumber', 'PAY-');
            await Payment.create({
              paymentNumber,
              order: invoice.order?._id || invoice.order,
              customerName: invoice.customerName,
              amount: paymentData.amount / 100,
              method: 'razorpay',
              status: 'paid',
              paymentDate: new Date(),
              notes: 'Razorpay webhook payment capture',
              invoice: invoice._id,
              transactionId: paymentData.id,
            });

            await syncInvoiceStatus(invoice.order?._id || invoice.order);
          }
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ message: err.message });
  }
};