const User = require("../../models/User");
const bcrypt = require("bcryptjs");

jest.mock("../../models/User");
jest.mock("bcryptjs");

const { register } = require("../../controllers/authController");

describe("Auth Controller - Register", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    next = jest.fn();

    req = {
      body: {
        name: "Test User",
        email: "test@test.com",
        password: "Newpassword1",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should register successfully", async () => {
    User.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");

    User.create.mockResolvedValue({
      _id: "123",
      name: "Test User",
      email: "test@test.com",
    });

    await register(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      email: "test@test.com",
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("Newpassword1", 10);

    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@test.com",
      password: "hashed-password",
    });

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      _id: "123",
      name: "Test User",
      email: "test@test.com",
    });
  });

  it("should return error if email already exists", async () => {
    User.findOne.mockResolvedValue({
      _id: "999",
      email: "test@test.com",
    });

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(User.create).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalled();
  });

  it("should hash password before creating user", async () => {
    User.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");

    User.create.mockResolvedValue({
      _id: "123",
      name: "Test User",
      email: "test@test.com",
    });

    await register(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith("Newpassword1", 10);

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashed-password",
      }),
    );
  });
});
