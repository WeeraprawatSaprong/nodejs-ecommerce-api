require("dotenv").config();

const express = require("express");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());
app.use(logger);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const productRoutes = require("./routes/products");
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/categories", categoryRoutes);

const reviewRoutes = require("./routes/reviewRoutes");
app.use("/reviews", reviewRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404);

  throw new Error("Route Not Found");
});

app.use(errorHandler);

module.exports = app;
