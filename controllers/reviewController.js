const Review = require("../models/Review");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);

    throw new Error("Product Not Found");
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: product._id,
  });

  if (existingReview) {
    res.status(400);

    throw new Error("You already reviewed this product");
  }

  const review = await Review.create({
    user: req.user._id,
    product: product._id,
    rating,
    comment,
  });

  const reviews = await Review.find({
    product: product._id,
  });

  product.numReviews = reviews.length;

  product.rating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

  await product.save();

  res.status(201).json(review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);

    throw new Error("Review Not Found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);

    throw new Error("Not Review Owner");
  }

  const product = await Product.findById(review.product);

  await Review.findByIdAndDelete(req.params.id);

  const reviews = await Review.find({
    product: review.product,
  });

  product.numReviews = reviews.length;

  if (reviews.length > 0) {
    product.rating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
  } else {
    product.rating = 0;
  }

  await product.save();

  res.json({
    message: "Review Deleted",
  });
});

module.exports = {
  createReview,
  deleteReview,
};
