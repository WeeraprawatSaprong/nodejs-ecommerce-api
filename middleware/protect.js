const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log(req.headers.authorization);
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      console.log("AUTH HEADER:", req.headers.authorization);

      return next();
    } catch (error) {
      console.log("JWT ERROR:", error);

      res.status(401);

      throw new Error("Not Authorized");
    } /* catch (error) {
      res.status(401);

      throw new Error("Not Authorized");
    } */
  }

  res.status(401);

  throw new Error("No Token");
};

module.exports = protect;
