const admin = require("../../middleware/admin");

describe("Admin Middleware", () => {
  it("should allow admin access", () => {
    const req = {
      user: {
        role: "admin",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
    };

    const next = jest.fn();

    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 403 for normal user", () => {
    const req = {
      user: {
        role: "user",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
    };

    const next = jest.fn();

    expect(() => {
      admin(req, res, next);
    }).toThrow("Admin Only");

    expect(res.status).toHaveBeenCalledWith(403);

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if user does not exist", () => {
    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
    };

    const next = jest.fn();

    expect(() => {
      admin(req, res, next);
    }).toThrow("Admin Only");

    expect(res.status).toHaveBeenCalledWith(403);

    expect(next).not.toHaveBeenCalled();
  });
});