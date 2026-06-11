import express from 'express';
import {
  getPayments,
  getPaymentSummary,
  createPayment,
  updatePayment,
  deletePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/razorpay/webhook", razorpayWebhook);

router.use(protect);
router.use(authorize('admin', 'accountant'));

router.get('/summary', getPaymentSummary);
router.get('/', getPayments);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);
router.post("/razorpay/order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);



export default router;
