const { body } = require("express-validator");

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Invalid email").trim().normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain number"),
];

module.exports = registerValidation;
