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

    // Process uploaded files
    const fileFields = [
      'aadhar_front_image',
      'aadhar_back_image', 
      'pan_image',
      'upload_image',
      'medical',
      'eye_test_medical',
      'driving_license_image'
    ];
    
    const processedFiles = {};
    
    // Handle single file fields
    fileFields.forEach(field => {
      if (req.files && req.files[field] && req.files[field][0]) {
        // Fix the path to be relative to the uploads directory
        processedFiles[field] = req.files[field][0].path.replace('public\\\\', '');
      }
    });
    
    // Handle certificate array
    if (req.files && req.files['certificate']) {
      processedFiles['certificate'] = req.files['certificate'].map(file => file.path.replace('public\\\\', ''));
    }

    // Merge req.body with processed file paths
    const userData = {
      ...req.body,
      ...processedFiles
    };

    // Create new user
    const user = await new User(userData).save();

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
    console.error("Registration error:", error); // Log the full error for debugging
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Internal server error",
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