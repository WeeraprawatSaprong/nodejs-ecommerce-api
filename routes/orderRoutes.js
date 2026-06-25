const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const admin = require("../middleware/admin");

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
} = require("../controllers/orderController");

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 */

router.post("/", protect, createOrder);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get my orders
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved
 */

router.get("/my-orders", protect, getMyOrders);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status updated
 */

router.put("/:id/status", protect, admin, updateOrderStatus);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;
