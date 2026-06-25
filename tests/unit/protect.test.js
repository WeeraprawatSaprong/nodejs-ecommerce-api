const jwt = require("jsonwebtoken");
const User = require("../../models/User");

jest.mock("jsonwebtoken");
jest.mock("../../models/User");

const protect = require("../../middleware/protect");

describe("Protect Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    next = jest.fn();

    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should allow access with valid token", async () => {
    req.headers.authorization = "Bearer valid-token";

    jwt.verify.mockReturnValue({
      id: "user123",
    });

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        email: "test@test.com",
      }),
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();

    expect(User.findById).toHaveBeenCalledWith("user123");

    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if token is missing", async () => {
    try {
      await protect(req, res, next);
    } catch (error) {}

    expect(res.status).toHaveBeenCalledWith(401);

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    req.headers.authorization = "Bearer invalid-token";

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid Token");
    });

    try {
      await protect(req, res, next);
    } catch (error) {}

    expect(res.status).toHaveBeenCalledWith(401);

    expect(next).not.toHaveBeenCalled();
  });
});
