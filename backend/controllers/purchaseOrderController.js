import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';

// CREATE PURCHASE ORDER
export const createPurchaseOrder = async (req, res) => {
  try {
    const po = await PurchaseOrder.create(req.body);
    res.status(201).json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getPurchaseOrders = async (req, res) => {
  try {
    const po = await PurchaseOrder.find()
      .populate('supplier')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE
export const getPurchaseOrderById = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate('supplier')
      .populate('items.product');

    if (!po) return res.status(404).json({ message: 'PO not found' });

    res.json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS (THIS IS ERP CORE LOGIC)
export const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);

    if (!po) return res.status(404).json({ message: 'PO not found' });

    po.status = req.body.status;

    // 🚨 WHEN MARKED AS RECEIVED → UPDATE STOCK
    if (req.body.status === 'Received') {
      for (const item of po.items) {
        const product = await Product.findById(item.product);

        if (product) {
          const oldQty = product.stock;

          product.stock += item.quantity;
          await product.save();

          // INVENTORY TRANSACTION LOG
          await InventoryTransaction.create({
            product: item.product,
            type: 'PURCHASE',
            quantity: item.quantity,
            previousQty: oldQty,
            newQty: product.stock,
            reference: po._id
          });
        }
      }
    }

    await po.save();

    res.json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};