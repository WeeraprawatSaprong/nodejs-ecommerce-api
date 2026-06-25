const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const { product, quantity } = req.body;

  if (!product) {
    res.status(400);

    throw new Error("Product is required");
  }

  if (!quantity || quantity <= 0) {
    res.status(400);

    throw new Error("Quantity must be greater than 0");
  }

  const foundProduct = await Product.findById(product);

  if (!foundProduct) {
    res.status(404);

    throw new Error("Product Not Found");
  }

  const totalPrice = foundProduct.price * quantity;

  const order = await Order.create({
    user: req.user._id,
    product,
    quantity,
    totalPrice,
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  })
    .populate("product", "name price")
    .populate("user", "name email");

  res.status(200).json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!order) {
    res.status(404);

    throw new Error("Order Not Found");
  }

  res.json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("product", "name price");

  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("product", "name price");

  if (!order) {
    res.status(404);

    throw new Error("Order Not Found");
  }

  res.json(order);
});

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
};
