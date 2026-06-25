const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const admin = require("../middleware/admin");

const { getStats } = require("../controllers/adminController");

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */

router.get("/stats", protect, admin, getStats);

module.exports = router;
