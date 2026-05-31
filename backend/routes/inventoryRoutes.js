import express from "express";
import { getInventoryHistory } from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", getInventoryHistory);

export default router;