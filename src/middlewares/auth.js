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
    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ email });
    req.authUser = user;

    return next();
  } catch (error) {
    return res.status(401).json(UNAUTHORIZED);
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.authUser.userType !== "Admin")
    return res.status(401).json(UNAUTHORIZED);

  return next();
};
