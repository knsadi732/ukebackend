const jwt = require("jsonwebtoken");

const User = require("../models/users");

const UNAUTHORIZED = {
  message: "You are unauthorized!",
  success: false,
  status: 401,
  data: null,
};

exports.auth = async (req, res, next) => {
  let token = req.headers.authorization || "";
  token = token ? token.replace("Bearer ", "") : "";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json(UNAUTHORIZED);
    }

    // Check Inactivity (15 minutes sliding window)
    const now = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : now;
    const inactivityLimit = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (user.lastActive && (now - lastActive > inactivityLimit)) {
      return res.status(401).json({
        message: "Session expired due to inactivity!",
        success: false,
        status: 401,
        data: null,
      });
    }

    // Update lastActive time for sliding window
    user.lastActive = now;
    await user.save();

    req.authUser = user;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired!",
        success: false,
        status: 401,
        data: null,
      });
    }
    return res.status(401).json(UNAUTHORIZED);
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.authUser.userType !== "Admin")
    return res.status(401).json(UNAUTHORIZED);

  return next();
};
