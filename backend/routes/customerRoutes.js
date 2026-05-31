import express from 'express';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'manager', 'user', 'accountant'), getCustomers);
router.post('/', authorize('admin', 'manager', 'user'), createCustomer);
router.put('/:id', authorize('admin', 'manager'), updateCustomer);

export default router;
