const express = require('express');
const { createAOrder, GetOrdersByEmail, updateOrder, cancelOrder, getAllOrders, updateOrderStatus, bulkUpdateOrderStatus } = require('./order.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router = express.Router();

// Admin routes (đặt trước để tránh conflict)
router.get("/", verifyAdminToken, getAllOrders); // Get all orders (Admin only)
router.patch("/bulk-update", verifyAdminToken, bulkUpdateOrderStatus); // Bulk update order status (Admin only)
router.patch("/:id/status", verifyAdminToken, updateOrderStatus); // Update order status (Admin only)

// Public/User routes
router.post('/', createAOrder); // create order
router.get("/email/:email", GetOrdersByEmail); // get orders by user email
router.put("/:id", updateOrder); // update order (only pending orders)
router.post("/:id/cancel", cancelOrder); // cancel order (only pending + COD)

module.exports = router;