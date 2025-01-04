const { body } = require("express-validator");

exports.packageSchema = [
  body("name", "Package name is required!").notEmpty(),
  body("description", "Description is required!").notEmpty(),
  body("features", "Feature is required!").notEmpty(),
  body("price", "Price is required!")
    .notEmpty()
    .custom((value) => {
      if (parseFloat(value) == NaN || value != parseFloat(value))
        throw new Error("Only numeric value allowed in price");

      return true;
    }),
];

exports.bookingSchema = [
  body("packageId", "Package is required!").notEmpty(),
  body("startDate", "Start Date is required!").notEmpty(),
  body("amount", "Amount is required!")
    .notEmpty()
    .custom((value) => {
      if (parseFloat(value) == NaN || value != parseFloat(value))
        throw new Error("Only numeric value allowed in price");

      return true;
    }),
];

exports.signUpSchema = [
  body("fullName", "Full name is required!").notEmpty(),
  body("email", "Email is required!").notEmpty(),
  body("password", "Password is required!").notEmpty(),
];
