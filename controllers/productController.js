const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/Review");
/* const getProducts = async (req, res) => {
  console.log("GET PRODUCTS CONTROLLER")

  res.json([
    {
      name: "Test Product"
    }
  ])
} */
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const search = req.query.search || "";

  const sort = req.query.sort || "-createdAt";

  const query = {
    name: {
      $regex: search,
      $options: "i",
    },
  };

  const products = await Product.find(query)
    .populate("user", "name email")
    .populate("category", "name")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    products,
  });
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product Not Found");
  }

  const reviews = await Review.find({
    product: product._id,
  }).populate("user", "name");

  res.json({
    product,
    reviews,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (!name) {
    res.status(400);

    throw new Error("Name is required");
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category: req.body.category,
    image: req.file ? req.file.filename : null,
    user: req.user._id,
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!product) {
    res.status(404);

    throw new Error("Product Not Found");
  }

  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product Not Found");
  }

  if (product.user.toString() !== req.user._id.toString()) {
    res.status(403);

    throw new Error("Not Product Owner");
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    message: "Product Deleted",
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
