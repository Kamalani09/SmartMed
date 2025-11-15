// backend/controllers/orderController.js

const Order = require("../models/Order");

// ===============================
// CREATE ORDER (Customer)
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Order must contain items." });

    const order = new Order({
      customerId: req.user.id,
      items,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Order Create Error:", err);
    res.status(500).json({ message: "Server error while creating order." });
  }
};

// ===============================
// GET CUSTOMER ORDERS
// ===============================
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Customer Orders Error:", err);
    res.status(500).json({ message: "Server error fetching customer orders." });
  }
};

// ===============================
// GET ALL PENDING ORDERS (Owner)
// ===============================
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" })
      .populate("customerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Pending Orders Error:", err);
    res.status(500).json({ message: "Server error fetching pending orders." });
  }
};

// ===============================
// ACCEPT ORDER (Owner)
// ===============================
exports.acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "accepted" },
      { new: true }
    );

    res.status(200).json({
      message: "Order accepted",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Accept Order Error:", err);
    res.status(500).json({ message: "Server error while accepting order." });
  }
};

// ===============================
// REJECT ORDER (Owner)
// ===============================
exports.rejectOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "rejected" },
      { new: true }
    );

    res.status(200).json({
      message: "Order rejected",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Reject Order Error:", err);
    res.status(500).json({ message: "Server error while rejecting order." });
  }
};
