import PDFDocument from 'pdfkit';
import Invoice from '../models/Invoice.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { nextSequence } from '../utils/invoiceNumber.js';
import { emitEvent } from '../socket/socket.js';

const buildGstItems = (orderItems, isInterState) =>
  orderItems.map((item) => {
    const taxable = item.quantity * item.unitPrice;
    const gstAmt = (taxable * item.gstPercent) / 100;
    const half = gstAmt / 2;
    return {
      product: item.product,
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      gstPercent: item.gstPercent,
      taxableAmount: taxable,
      cgst: isInterState ? 0 : half,
      sgst: isInterState ? 0 : half,
      igst: isInterState ? gstAmt : 0,
      lineTotal: taxable + gstAmt,
    };
  });

export const getInvoices = async (req, res) => {
  const filter = {};
  if (req.query.customer) {
    filter.customerName = { $regex: req.query.customer, $options: 'i' };
  }
  const invoices = await Invoice.find(filter)
    .populate('order', 'orderNumber')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(invoices);
};

export const getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('order');
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json(invoice);
};

export const createInvoiceFromOrder = async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'cancelled') {
    return res.status(400).json({ message: 'Cannot invoice a cancelled order' });
  }

  const existing = await Invoice.findOne({ order: order._id });
  if (existing) return res.status(400).json({ message: 'Invoice already exists for this order' });

  const isInterState = req.body.isInterState ?? false;
  const items = buildGstItems(order.items, isInterState);
  const subtotal = items.reduce((s, i) => s + i.taxableAmount, 0);
  const cgstTotal = items.reduce((s, i) => s + i.cgst, 0);
  const sgstTotal = items.reduce((s, i) => s + i.sgst, 0);
  const igstTotal = items.reduce((s, i) => s + i.igst, 0);
  const gstTotal = cgstTotal + sgstTotal + igstTotal;
  const grandTotal = subtotal + gstTotal;

  const invoiceNumber = await nextSequence(Invoice, 'invoiceNumber', 'INV-');

  const invoice = await Invoice.create({
    invoiceNumber,
    order: order._id,
    customerName: order.customerName,
    customerGstin: req.body.customerGstin || '',
    customerAddress: req.body.customerAddress || '',
    items,
    subtotal,
    cgstTotal,
    sgstTotal,
    igstTotal,
    gstTotal,
    grandTotal,
    isInterState,
    placeOfSupply: req.body.placeOfSupply || 'Maharashtra',
    dueDate: req.body.dueDate,
    createdBy: req.user._id,
  });

  emitEvent(req, 'invoiceCreated', {
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    grandTotal: invoice.grandTotal,
    message: `Invoice ${invoice.invoiceNumber} generated`,
  });

  res.status(201).json(invoice);
};

export const createManualInvoice = async (req, res) => {
  const { customerName, items, isInterState, customerGstin, customerAddress, placeOfSupply } =
    req.body;
  if (!customerName || !items?.length) {
    return res.status(400).json({ message: 'Customer and items required' });
  }

  const gstItems = items.map((item) => {
    const taxable = item.quantity * item.unitPrice;
    const gstAmt = (taxable * (item.gstPercent || 18)) / 100;
    const half = gstAmt / 2;
    const inter = isInterState ?? false;
    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      gstPercent: item.gstPercent || 18,
      taxableAmount: taxable,
      cgst: inter ? 0 : half,
      sgst: inter ? 0 : half,
      igst: inter ? gstAmt : 0,
      lineTotal: taxable + gstAmt,
    };
  });

  const subtotal = gstItems.reduce((s, i) => s + i.taxableAmount, 0);
  const cgstTotal = gstItems.reduce((s, i) => s + i.cgst, 0);
  const sgstTotal = gstItems.reduce((s, i) => s + i.sgst, 0);
  const igstTotal = gstItems.reduce((s, i) => s + i.igst, 0);
  const gstTotal = cgstTotal + sgstTotal + igstTotal;

  const invoiceNumber = await nextSequence(Invoice, 'invoiceNumber', 'INV-');
  const invoice = await Invoice.create({
    invoiceNumber,
    customerName,
    customerGstin,
    customerAddress,
    items: gstItems,
    subtotal,
    cgstTotal,
    sgstTotal,
    igstTotal,
    gstTotal,
    grandTotal: subtotal + gstTotal,
    isInterState: isInterState ?? false,
    placeOfSupply: placeOfSupply || 'Maharashtra',
    createdBy: req.user._id,
  });

  res.status(201).json(invoice);
};

export const updatePaymentStatus = async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    { paymentStatus: req.body.paymentStatus },
    { new: true }
  );
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json(invoice);
};

export const downloadInvoicePdf = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const company = process.env.COMPANY_NAME;
  const gstin = process.env.COMPANY_GSTIN;
  const address = process.env.COMPANY_ADDRESS;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${invoice.invoiceNumber}.pdf"`
  );

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text('TAX INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(company, { align: 'left' });
  doc.text(`GSTIN: ${gstin}`);
  doc.text(address);
  doc.moveDown();
  doc.text(`Invoice No: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}`);
  doc.text(`Place of Supply: ${invoice.placeOfSupply}`);
  doc.moveDown();
  doc.text(`Bill To: ${invoice.customerName}`);
  if (invoice.customerGstin) doc.text(`GSTIN: ${invoice.customerGstin}`);
  if (invoice.customerAddress) doc.text(invoice.customerAddress);
  doc.moveDown();

  const tableTop = doc.y;
  doc.font('Helvetica-Bold');
  doc.text('Description', 50, tableTop, { width: 180 });
  doc.text('Qty', 240, tableTop);
  doc.text('Rate', 280, tableTop);
  doc.text('GST%', 330, tableTop);
  doc.text('Amount', 400, tableTop);
  doc.moveDown(0.5);
  doc.font('Helvetica');

  invoice.items.forEach((item) => {
    const y = doc.y;
    doc.text(item.description || '-', 50, y, { width: 180 });
    doc.text(String(item.quantity), 240, y);
    doc.text(item.unitPrice.toFixed(2), 280, y);
    doc.text(`${item.gstPercent}%`, 330, y);
    doc.text(item.lineTotal.toFixed(2), 400, y);
    doc.moveDown(0.3);
  });

  doc.moveDown();
  doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`, { align: 'right' });
  if (!invoice.isInterState) {
    doc.text(`CGST: ₹${invoice.cgstTotal.toFixed(2)}`, { align: 'right' });
    doc.text(`SGST: ₹${invoice.sgstTotal.toFixed(2)}`, { align: 'right' });
  } else {
    doc.text(`IGST: ₹${invoice.igstTotal.toFixed(2)}`, { align: 'right' });
  }
  doc.font('Helvetica-Bold').text(`Grand Total: ₹${invoice.grandTotal.toFixed(2)}`, {
    align: 'right',
  });

  doc.end();
};

export const createPOSInvoice = async (req, res) => {
  const { items } = req.body;

  let subtotal = 0;

  for (const item of items) {
    subtotal += item.quantity * item.unitPrice;
  }

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const invoice = await Invoice.create({
    items,
    subtotal,
    gstTotal: gst,
    grandTotal: total,
  });

  for (const item of items) {
    const product = await Product.findById(item._id);

    if (product) {
      product.quantity -= item.quantity; // FIXED FIELD NAME
      await product.save();
    }
  }

  res.status(201).json(invoice);
};