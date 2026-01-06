const User = require("../models/users");
const { successResponse, errorResponse } = require("../helpers/apiHelper");
const { single, multiple } = require("../helpers/fileUpload");
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  try {
    console.log("Create User API hit. Request Body:", req.body);
    const uploadKeys = [
      "aadhar_front_image",
      "aadhar_back_image",
      "pan_image",
      "certificate",
      "upload_image",
      "medical",
      "eye_test_medical",
      "driving_license",
    ];

    uploadKeys.forEach((key) => {
      if (key === "certificate") {
        multiple(req, key, "users");
      } else {
        single(req, key, "users");
      }
    });

    const user = await new User({ ...req.body }).save();
    console.log({ user });
    return successResponse({
      res,
      status: 201,
      data: user,
      msg: "Record created successfully",
    });
  } catch (error) {
    console.log("Error in create user:", error);
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};
exports.getUsers = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    searchText = "",
    sortBy = "updatedAt,-1",
  } = { ...req.query, ...req.body };

  const [field, value] = sortBy.split(",");

  let query = {};

  if (searchText)
    query = { ...query, name: { $regex: searchText, $options: "i" } };

  if (status !== "") query = { ...query, status };

  try {
    let users = await User.paginate(query, {
      page,
      limit,
      lean: true,
      sort: { [field]: parseInt(value) },
    });


    const data = {
                "id": users._id,
                "name": users.name,
                "email": users.email,
                "role": users.role,
                "phone": users.phone,
                "address": users.address,                
                "highest_qualification": users.highest_qualification,
                "specializations": users.specializations,
                "experience": users.experience,
                "nominee_name": users.nominee_name,
                "bank_name": users.bank_name,
                "identification_mark": users.identification_mark,
                "aadhar_no": users.aadhar_no,
                "nominee_aadhar_no": users.nominee_aadhar_no,
                "pan_no": users.pan_no,
                "driving_license_no": users.driving_license_no,
                "ifsc": users.ifsc,
                "bank_account_no": users.bank_account_no,
                "blood_group": users.blood_group,
                "dob": users.dob,
                "uan": users.uan,
                "status": users.status,
                "esic": users.esic,
                "aadhar_front_image": users.aadhar_front_image,
                "aadhar_back_image": users.aadhar_back_image,
                "pan_image": users.pan_image,
                "upload_image": users.upload_image,
                "certificate": users.certificate,
                "medical": users.medical,
                "eye_test_medical": users.eye_test_medical,                
                "driving_license_image": users.driving_license_image,
    }

    return successResponse({
      res,
      data: data,
      msg: "Record found successfully",
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

exports.getUserById = async (req, res) => {
  const {
    status = "",
    searchText = "",
    id = "", // Extract `id` from query parameters
    sortBy = "updatedAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = { userType: "testing" };

  // Add search and status filters if `id` is not provided
  if (!id) {
    if (searchText) {
      query = { ...query, name: { $regex: searchText, $options: "i" } };
    }

    if (status !== "") {
      query = { ...query, status };
    }
  }

  try {
    // Fetch a single document by ID or the first matching record
    const user = id
      ? await User.findOne({ _id: id, userType: "testing", lean: true }) // Fetch by ID
      : await User.findOne(query)
        .sort({ [field]: parseInt(value) })
        .lean();

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
      msg: "Record found successfully",
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
exports.UpdateUserById = async (req, res) => {
  const { id } = req.params; // Extract `id` from URL parameters
  const updates = req.body; // Extract updates from request body

  try {
    console.log({ id })
    if (!id) {
      return errorResponse({
        res,
        status: 400,
        msg: "ID is required",
      });
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      id, // Use the `id` to find the user
      { $set: updates }, // Apply updates
      { new: true, lean: true } // Return the updated document
    );

    if (!updatedUser) {
      // Log additional information for debugging
      console.error(`User with ID ${id} not found.`);
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    return successResponse({
      res,
      data: updatedUser,
      msg: "User updated successfully",
    });
  } catch (error) {
    // Handle and log any error
    console.error("Error updating user:", error);
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update user",
    });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return errorResponse({
      res,
      status: 400,
      msg: "User ID is required",
    });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    return successResponse({
      res,
      data: deletedUser,
      msg: "User deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete user",
    });
  }
};
