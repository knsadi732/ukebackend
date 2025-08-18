const jwt = require("jsonwebtoken");

const User = require("../models/users");

const UNAUTHORIZED = {
  message: "You are unauthorized!",
  success: false,
  status: 401,
  data: null,
};

exports.auth = async (req, res, next) => {
  console.log( req?.headers)
  console.log("Incoming-Headers:", req.headers);

  let token = req.headers.authorization || "";

  token = token ? token.replace("Bearer ", "") : "";

  console.log({ token });
 

  try {
    const { phone } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log({phone})
    const user = await User.findOne({ phone });
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
