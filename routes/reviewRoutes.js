const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

/**
 * @swagger
 * /reviews/{productId}:
 *   post:
 *     summary: Create review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Review created
 */

router.post("/:productId", protect, createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags:
 *       - Reviews
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
 *         description: Review deleted
 */

router.delete("/:id", protect, deleteReview);

module.exports = router;
