import express from "express";

import {
  getDashboardStats,
  getActivityFeed,
  getProfitAnalytics,
  getLowStockPrediction,
  getLowStockReport,
  getCategoryDistribution,
  getSalesChart,
  getProductPerformance,
  getRevenueByMonth,
} from "../controllers/analyticsController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   AUTH MIDDLEWARE
========================================================= */

// All analytics routes require login
router.use(protect);

/* =========================================================
   DASHBOARD (ALL AUTH USERS)
========================================================= */

router.get("/dashboard", getDashboardStats);
router.get("/activity", getActivityFeed);

/* =========================================================
   ADMIN / MANAGER ONLY
========================================================= */

router.use(authorize("admin", "manager"));

router.get("/sales", getSalesChart);
router.get("/products", getProductPerformance);
router.get("/profit", getProfitAnalytics);
router.get("/revenue-monthly", getRevenueByMonth);
router.get("/category-distribution", getCategoryDistribution);
router.get("/low-stock-prediction", getLowStockPrediction);
router.get("/low-stock-report", getLowStockReport);

export default router;