import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET LOW STOCK PRODUCTS
router.get('/low-stock', protect, async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minStockLevel'] }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;