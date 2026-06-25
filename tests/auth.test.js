const request = require("supertest");

// Mock ก่อน require app
jest.mock("../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../app");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully", async () => {
    const mockUser = {
      _id: "123",
      email: "test@test.com",
      password: "hashedpassword",
      save: jest.fn(),
    };

    User.findOne.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue("fake-token");

    const res = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "Newpassword1",
    });

    expect(res.statusCode).toBe(200);

    expect(res.body.token).toBe("fake-token");

    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@test.com",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "Newpassword1",
      "hashedpassword",
    );

    expect(mockUser.save).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledTimes(2);

    expect(User.findOne).toHaveBeenCalled();
  });

  it("should return 401 if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/auth/login").send({
      email: "notfound@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(401);

    expect(res.body.message).toBe("Invalid Credentials");
  });

  it("should return 401 if password is incorrect", async () => {
    const mockUser = {
      _id: "123",
      email: "test@test.com",
      password: "hashedpassword",
    };

    User.findOne.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);

    expect(res.body.message).toBe("Invalid Credentials");
  });

  it("should register successfully", async () => {
    bcrypt.hash.mockResolvedValue("hashed-password");

    User.findOne.mockResolvedValue(null);

    User.create.mockResolvedValue({
      _id: "123",
      name: "John",
      email: "john@test.com",
    });

    const res = await request(app).post("/auth/register").send({
      name: "John",
      email: "john@test.com",
      password: "Newpassword1",
    });

    console.log(res.body);

    expect(res.statusCode).toBe(201);

    expect(res.body.name).toBe("John");

    expect(User.create).toHaveBeenCalled();
  });

  it("should return 400 if email already exists", async () => {
    User.findOne.mockResolvedValue({
      _id: "123",
      email: "john@test.com",
    });

    const res = await request(app).post("/auth/register").send({
      name: "John",
      email: "john@test.com",
      password: "Newpassword1",
    });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Email already exists");
  });

  it("should call User.findOne once", async () => {
    User.findOne.mockResolvedValue(null);

    await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  it("should call User.findOne once", async () => {
    User.findOne.mockResolvedValue(null);

    await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(User.findOne).toHaveBeenCalledTimes(1);
  });
});
