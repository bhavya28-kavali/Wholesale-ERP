import express from 'express';
import {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockAlerts,
  getProductCategories,
  getStockHistory,
  bulkDeleteProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/low-stock', authorize('admin', 'manager', 'user'), getLowStockAlerts);
router.get('/categories', authorize('admin', 'manager', 'user'), getProductCategories);
router.post('/bulk-delete', authorize('admin'), bulkDeleteProducts);
router.get('/history/:productId', authorize('admin', 'manager'), getStockHistory);
router.get(
  '/barcode/:barcode',
  authorize('admin', 'manager', 'user'),
  getProductByBarcode
);
router.get('/', authorize('admin', 'manager', 'user', 'accountant'), getProducts);
router.get('/:id', authorize('admin', 'manager', 'user'), getProductById);
router.post('/', authorize('admin', 'manager'), createProduct);
router.put('/:id', authorize('admin', 'manager'), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

export default router;
