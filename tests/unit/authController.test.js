const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const { login } = require("../../controllers/authController");

describe("Auth Controller - Login", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully", async () => {
    const mockUser = {
      _id: "123",
      email: "[test@test.com](mailto:test@test.com)",
      password: "hashed-password",
      save: jest.fn().mockResolvedValue(true),
    };
  });

  it("should return 401 if user not found", async () => {
    User.findOne.mockResolvedValue(null);
  });

  it("should return 401 if password is incorrect", async () => {
    const mockUser = {
      _id: "123",
      email: "[test@test.com](mailto:test@test.com)",
      password: "hashed-password",
      save: jest.fn(),
    };
  });
});
