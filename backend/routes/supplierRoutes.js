import express from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE
router.post('/', protect, createSupplier);

// GET ALL
router.get('/', protect, getSuppliers);

// GET ONE
router.get('/:id', protect, getSupplierById);

// UPDATE
router.put('/:id', protect, updateSupplier);

// DELETE
router.delete('/:id', protect, deleteSupplier);

export default router;