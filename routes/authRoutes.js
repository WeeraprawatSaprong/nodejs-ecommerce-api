const express = require("express");
const protect = require("../middleware/protect");
const admin = require("../middleware/admin");
const registerValidation = require("../validators/authValidation");
const validate = require("../middleware/validation");

const router = express.Router();

const {
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
} = require("../controllers/authController");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register User
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User Created
 */

router.post("/register", registerValidation, validate, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login User
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Success
 */

router.post("/login", login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */

router.get("/profile", protect, getProfile);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */

router.get("/users", protect, admin, getUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags:
 *       - Users
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
 *         description: User found
 */

router.get("/users/:id", protect, admin, getUserById);

/**
 * @swagger
 * /auth/users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role updated
 */

router.put("/users/:id/role", protect, admin, updateUserRole);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Reset token generated
 */

router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   put:
 *     summary: Reset password
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */

router.put("/reset-password/:token", resetPassword);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token refreshed
 */

router.post("/refresh-token", refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 */

router.post("/logout", protect, logout);

module.exports = router;
