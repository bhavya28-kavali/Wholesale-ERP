import express from "express";
import { getInventoryHistory } from "../controllers/inventoryController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", protect, getInventoryHistory);

export default router;