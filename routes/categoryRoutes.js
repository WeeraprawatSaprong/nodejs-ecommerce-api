const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const admin = require("../middleware/admin");

const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", protect, admin, createCategory);

module.exports = router;
