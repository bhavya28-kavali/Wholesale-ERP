import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'manager', 'user', 'accountant'), getOrders);
router.get('/:id', authorize('admin', 'manager', 'user', 'accountant'), getOrderById);
router.post('/', authorize('admin', 'manager', 'user'), createOrder);
router.put('/:id', authorize('admin', 'manager'), updateOrder);
router.patch('/:id/status', authorize('admin', 'manager'), updateOrderStatus);
router.delete('/:id', authorize('admin', 'manager'), deleteOrder);

export default router;
