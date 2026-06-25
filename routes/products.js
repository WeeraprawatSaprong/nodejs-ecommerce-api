const express = require("express");
const protect = require("../middleware/protect");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");
const productValidation = require("../validators/productValidation");
const validate = require("../middleware/validation");

const router = express.Router();

/* router.use((req, res, next) => {
  console.log("ROUTER HIT")
  next()
}) */

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get All Products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Products List
 */

router.get("/", getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */

router.get("/:id", getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create Product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product Created
 */

router.post(
  "/",
  protect,
  upload.single("image"),
  productValidation,
  validate,
  createProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags:
 *       - Products
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
 *         description: Product updated
 */

router.put("/:id", protect, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags:
 *       - Products
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
 *         description: Product deleted
 */

router.delete("/:id", protect, admin, deleteProduct);

router.use(protect);

module.exports = router;
