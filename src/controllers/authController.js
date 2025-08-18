const User = require("../models/users");
const bcrypt = require("bcryptjs");
const { successResponse, errorResponse } = require("../helpers/apiHelper");
const { createToken } = require("../helpers/modelHelper");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse({
        res,
        status: 401,
        msg: "Invalid email or password",
      });
    }

    // Check if password is correct
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return errorResponse({
        res,
        status: 401,
        msg: "Invalid email or password",
      });
    }

    // Create token
    const token = createToken(user.email);

    // Remove password from user object
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse({
      res,
      data: { user: userObj, token },
      msg: "Login successful",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Internal server error",
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse({
        res,
        status: 400,
        msg: "User with this email already exists",
      });
    }

    // Create new user
    const user = await new User({ ...req.body }).save();

    // Create token
    const token = createToken(user.email);

    // Remove password from user object
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse({
      res,
      status: 201,
      data: { user: userObj, token },
      msg: "User registered successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.authUser._id).select("-password");
    if (!user) {
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    return successResponse({
      res,
      data: user,
      msg: "Profile retrieved successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Internal server error",
    });
  }
};