const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const asyncHandler = require("../utils/asyncHandler");

const getStats = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();

  const products = await Product.countDocuments();

  const orders = await Order.countDocuments();

  const allOrders = await Order.find();

  const revenue = allOrders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.json({
    users,
    products,
    orders,
    revenue,
  });
});

module.exports = {
  getStats,
};
