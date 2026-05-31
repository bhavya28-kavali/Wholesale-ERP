import express from 'express';
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderStatus
} from '../controllers/purchaseOrderController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE PO
router.post('/', protect, createPurchaseOrder);

// GET ALL PO
router.get('/', protect, getPurchaseOrders);

// GET SINGLE PO
router.get('/:id', protect, getPurchaseOrderById);

// UPDATE STATUS (Pending → Received)
router.put('/:id/status', protect, updatePurchaseOrderStatus);

export default router;