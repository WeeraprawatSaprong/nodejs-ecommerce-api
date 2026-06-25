const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await User.findOne({
    email: req.body.email,
  });

  if (existingUser) {
    res.status(400);

    throw new Error("Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  user.refreshToken = refreshToken;

  await user.save();

  res.status(200).json({
    token,
    refreshToken,
  });
});

const getProfile = (req, res) => {
  res.json(req.user);
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);

    throw new Error("User Not Found");
  }

  res.json(user);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
    {
      new: true,
    },
  ).select("-password");

  if (!user) {
    res.status(404);

    throw new Error("User Not Found");
  }

  res.json(user);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.status(404);

    throw new Error("User Not Found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  res.json({
    message: "Reset token generated",

    resetToken,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,

    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    res.status(400);

    throw new Error("Invalid token");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashedPassword;

  user.resetPasswordToken = undefined;

  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    message: "Password reset successful",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);

    throw new Error("No refresh token");
  }

  const user = await User.findOne({
    refreshToken,
  });

  if (!user) {
    res.status(401);

    throw new Error("Invalid refresh token");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.json({
    accessToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);

    throw new Error("User Not Found");
  }

  user.refreshToken = null;

  await user.save();

  res.json({
    message: "Logged out",
  });
});

module.exports = {
  register,
  login,
  getProfile,
  getUsers,
  getUserById,
  updateUserRole,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logout,
};
