const { body } = require("express-validator");

const productValidation = [
  body("name").notEmpty().withMessage("Name is required"),

  body("price").isNumeric().withMessage("Price must be number"),

  body("stock").isInt({ min: 0 }).withMessage("Stock must be >= 0"),
];

module.exports = productValidation;
