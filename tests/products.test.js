const request = require("supertest");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const app = require("../app");
const Product = require("../models/Product");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Category = require("../models/Category");

beforeAll(async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("Newpassword1", 10);

  await User.deleteOne({
    email: "test@test.com",
  });

  await User.create({
    name: "Test User",
    email: "test@test.com",
    password: hashedPassword,
    role: "admin",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Products API", () => {
  it("should get all products", async () => {
    const res = await request(app).get("/products");

    expect(res.statusCode).toBe(200);
  });

  it("should get product by id", async () => {
    const product = await Product.findOne();

    expect(product).not.toBeNull();

    const res = await request(app).get(`/products/${product._id}`);

    expect(res.statusCode).toBe(200);

    expect(res.body._id).toBe(product._id.toString());
  });

  it("should return 404 if product not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app).get(`/products/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app).post("/products").send({
      name: "iPhone",
      price: 30000,
    });

    expect(res.statusCode).toBe(401);
  });

  it("should create product successfully", async () => {
    // Login ก่อนเพื่อเอา JWT
    const loginRes = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    expect(loginRes.statusCode).toBe(200);

    const token = loginRes.body.token;

    // หา Category ที่มีอยู่ใน DB
    const category = await Category.findOne();

    expect(category).not.toBeNull();

    // สร้าง Product
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "iPhone 14",
        description: "Apple smartphone",
        price: 35000,
        stock: 10,
        category: category._id,
      });

    expect(res.statusCode).toBe(201);

    expect(res.body.name).toBe("iPhone 14");
    expect(res.body.description).toBe("Apple smartphone");
    expect(res.body.price).toBe(35000);
    expect(res.body.stock).toBe(10);
    expect(res.body.category).toBe(category._id.toString());
  });

  it("should return 400 if name is missing", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    const token = loginRes.body.token;

    const category = await Category.findOne();

    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Apple smartphone",
        price: 35000,
        stock: 10,
        category: category._id,
      });

    expect(res.statusCode).toBe(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe("Name is required");
  });

  it("should return 400 if price is invalid", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    const token = loginRes.body.token;

    const category = await Category.findOne();

    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "iPhone 15",
        description: "Apple smartphone",
        price: "abc",
        stock: 10,
        category: category._id,
      });

    expect(res.statusCode).toBe(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe("Price must be number");
  });

  it("should return 400 if stock is negative", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    const token = loginRes.body.token;

    const category = await Category.findOne();

    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "iPhone 15",
        description: "Apple smartphone",
        price: 35000,
        stock: -1,
        category: category._id,
      });

    expect(res.statusCode).toBe(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe("Stock must be >= 0");
  });

  it("should update product successfuly", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    const token = loginRes.body.token;

    const product = await Product.findOne();
    expect(product).not.toBeNull();

    const res = await request(app)
      .put(`/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated iPhone",
        description: "Updated Description",
        price: 99999,
        stock: 50,
      });
    expect(res.statusCode).toBe(200);

    expect(res.body.name).toBe("Updated iPhone");
    expect(res.body.description).toBe("Updated Description");
    expect(res.body.price).toBe(99999);
    expect(res.body.stock).toBe(50);

    const updatedProduct = await Product.findById(product._id);

    expect(updatedProduct.name).toBe("Updated iPhone");
    expect(updatedProduct.price).toBe(99999);
  });

  it("should return 404 if product to update not found", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    const token = loginRes.body.token;

    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .put(`/products/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated iPhone",
        description: "Updated Description",
        price: 99999,
        stock: 50,
      });

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Product Not Found");
  });

  it("should delete product successfully", async () => {
    // Login
    const loginRes = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    const token = loginRes.body.token;

    // หา User และ Category สำหรับสร้าง Product
    const user = await User.findOne({
      email: "test@test.com",
    });

    const category = await Category.findOne();

    // สร้าง Product สำหรับ Test
    const product = await Product.create({
      name: "Delete Test Product",
      description: "Product for delete testing",
      price: 1000,
      stock: 5,
      category: category._id,
      user: user._id,
    });

    // ลบ Product
    const res = await request(app)
      .delete(`/products/${product._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe("Product Deleted");

    // ตรวจว่าลบจาก DB จริง
    const deletedProduct = await Product.findById(product._id);

    expect(deletedProduct).toBeNull();
  });
});
