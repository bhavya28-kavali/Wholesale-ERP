import Product from '../models/Product.js';
import StockHistory from '../models/StockHistory.js';
import { emitEvent } from '../socket/socket.js';
import InventoryTransaction from "../models/InventoryTransaction.js";
const recordStockChange = async (product, previousQty, newQty, reason, userId) => {
  if (previousQty === newQty) return;
  await StockHistory.create({
    product: product._id,
    previousQty,
    newQty,
    change: newQty - previousQty,
    reason,
    changedBy: userId,
  });
  await InventoryTransaction.create({
    product: product._id,
    previousQty,
    newQty,
    action: 'PRODUCT_UPDATED',
    performedBy: userId,
  });
  if (newQty <= product.lowStockThreshold) {
    return {
      type: 'lowStock',
      product: product.name,
      sku: product.sku,
      quantity: newQty,
      threshold: product.lowStockThreshold,
    };
  }
  return null;
};

export const getProducts = async (req, res) => {
  const { search, lowStock, barcode, category, stockStatus } = req.query;
  const filter = { isActive: true };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ];
  }
  if (barcode) filter.barcode = barcode;
  if (category && category !== 'all') filter.category = category;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.supplier) filter.supplier = { $regex: req.query.supplier, $options: 'i' };
  let products = await Product.find(filter).sort({ name: 1 });
  if (lowStock === 'true') {
    products = products.filter((p) => p.quantity <= p.lowStockThreshold);
  }
  if (stockStatus === 'low') {
    products = products.filter((p) => p.quantity <= p.lowStockThreshold && p.quantity > 0);
  } else if (stockStatus === 'out') {
    products = products.filter((p) => p.quantity === 0);
  } else if (stockStatus === 'healthy') {
    products = products.filter((p) => p.quantity > p.lowStockThreshold);
  }
  res.json(products);
};

export const getProductCategories = async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json(categories.sort());
};

export const getStockHistory = async (req, res) => {
  const history = await StockHistory.find({ product: req.params.productId })
    .populate('changedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(history);
};

export const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  if (!ids?.length) return res.status(400).json({ message: 'Product IDs required' });
  await Product.updateMany({ _id: { $in: ids } }, { isActive: false });
  res.json({ message: `${ids.length} product(s) deactivated` });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    if (!barcode) {
      return res.status(400).json({
        success: false,
        message: 'Barcode is required',
      });
    }

    // Try multiple possible field names (fixes common ERP bug)
    const product = await Product.findOne({
      $or: [
        { barcode: barcode },
        { barcodeNumber: barcode },
        { sku: barcode },
        { ean: barcode },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found for this barcode',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Barcode lookup error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product by barcode',
    });
  }
};

export const createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  await recordStockChange(product, 0, product.quantity, 'initial', req.user._id);
  const alert = product.quantity <= product.lowStockThreshold
    ? { type: 'lowStock', product: product.name, sku: product.sku, quantity: product.quantity }
    : null;
  if (alert) emitEvent(req, 'lowStockAlert', alert);
  emitEvent(req, 'stockUpdated', { productId: product._id, name: product.name });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const existing = await Product.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Product not found' });
  const previousQty = existing.quantity;
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  const alert = await recordStockChange(
    product,
    previousQty,
    product.quantity,
    req.body.reason || 'manual',
    req.user._id
  );
  if (alert) emitEvent(req, 'lowStockAlert', alert);
  emitEvent(req, 'stockUpdated', { productId: product._id, name: product.name, quantity: product.quantity });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deactivated' });
};

export const getLowStockAlerts = async (req, res) => {
  const products = await Product.find({ isActive: true });
  const lowStock = products.filter((p) => p.quantity <= p.lowStockThreshold);
  res.json(lowStock.sort((a, b) => a.quantity - b.quantity));
};
