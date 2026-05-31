import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoiceFromOrder,
  createManualInvoice,
  updatePaymentStatus,
  downloadInvoicePdf,
  createPOSInvoice,
} from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'accountant', 'manager'), getInvoices);
router.get('/:id/pdf', authorize('admin', 'accountant', 'manager'), downloadInvoicePdf);
router.get('/:id', authorize('admin', 'accountant', 'manager'), getInvoiceById);
router.post('/manual', authorize('admin', 'accountant'), createManualInvoice);
router.post('/from-order/:orderId', authorize('admin', 'accountant'), createInvoiceFromOrder);
router.patch('/:id/payment', authorize('admin', 'accountant'), updatePaymentStatus);
router.post('/pos', createPOSInvoice);

export default router;
