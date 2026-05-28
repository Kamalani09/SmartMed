// backend/routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  createOrder,
  getCustomerOrders,
  getPendingOrders,
  acceptOrder,
  rejectOrder,
} = require("../controllers/orderController");

// CUSTOMER → Place order
router.post("/create", authMiddleware, createOrder);

// CUSTOMER → View own orders
router.get("/my-orders", authMiddleware, getCustomerOrders);

// OWNER → View pending orders
router.get("/pending", authMiddleware, getPendingOrders);

// OWNER → Accept order
router.put("/:id/accept", authMiddleware, acceptOrder);

// OWNER → Reject order
router.put("/:id/reject", authMiddleware, rejectOrder);

module.exports = router;
