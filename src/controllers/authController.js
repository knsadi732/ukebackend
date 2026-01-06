const User = require("../models/users");
const { successResponse, errorResponse } = require("../helpers/apiHelper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return errorResponse({
        res,
        status: 400,
        msg: "Phone and password are required",
      });
    }

    if (password.length < 6) {
      return errorResponse({
        res,
        status: 400,
        msg: "Password must be at least 6 characters",
      });
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse({
        res,
        status: 401,
        msg: "Invalid credentials",
      });
    }

    // Generate Token (Expires in 4 hours - Absolute limit)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY || "secret", {
      expiresIn: "4h",
    });

    // Initialize lastActive time
    user.lastActive = new Date();
    await user.save();

    return successResponse({
      res,
      data: { token:token, name:user.name,  phone:user.phone, id:user._id , role:user.role, email:user.email },
      msg: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Internal Server Error",
    });
  }
};