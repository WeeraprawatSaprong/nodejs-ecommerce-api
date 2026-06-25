const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
  });

  res.status(201).json(category);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json(categories);
});

module.exports = {
  createCategory,
  getCategories,
};
