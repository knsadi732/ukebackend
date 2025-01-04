const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { encryptPassword } = require("../helpers/modelHelper");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    address: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Regex for exactly 10 digits
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    highest_qualification: { type: String, required: true, trim: true },
    specializations: { type: String, trim: true },
    nominee_name: { type: String, required: true, trim: true },
    bank_name: { type: String, required: true, trim: true },
    identification_mark: { type: String, required: true, trim: true },

    aadhar_no: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Regex for exactly 12 digits
        },
        message: (props) =>
          `${props.value} is not a valid 12-digit Aadhar number!`,
      },
    },
    nominee_aadhar_no: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Regex for exactly 12 digits
        },
        message: (props) =>
          `${props.value} is not a valid 12-digit Aadhar number!`,
      },
    },

    pan_no: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(v); // Regex for PAN format
        },
        message: (props) => `${props.value} is not a valid PAN number!`,
      },
    },
    driving_license_no: {
      type: String,
      trim: true,
      required: false,
      validate: {
        validator: function (v) {
          // Skip validation if the value is empty
          if (!v) return true;
          // Apply regex only if value is present
          return /^[A-Z]{2}\d{13}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid driving license number!`,
      },
    },
    ifsc: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); // IFSC format
        },
        message: (props) => `${props.value} is not a valid IFSC code!`,
      },
    },
    bank_account_no: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{9,18}$/.test(v); // 9 to 18 digits
        },
        message: (props) =>
          `${props.value} is not a valid bank account number!`,
      },
    },
    blood_group: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(A|B|AB|O)[+-]$/.test(v); // Valid blood groups
        },
        message: (props) => `${props.value} is not a valid blood group!`,
      },
    },
    uan: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Exactly 12 digits
        },
        message: (props) => `${props.value} is not a valid UAN!`,
      },
    },
    esic: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Exactly 12 digits
        },
        message: (props) => `${props.value} is not a valid ESIC number!`,
      },
    },
    aadhar_front_image: { type: String, required: true, trim: true },
    aadhar_back_image: { type: String, required: true, trim: true },
    pan_image: { type: String, required: true, trim: true },
    upload_image: { type: String, required: true, trim: true },
    certificate: { type: [String], trim: true, required: false },
    medical: { type: String, required: true, trim: true },
    eye_test_medical: { type: String, trim: true },
    role: { type: String, required: true, trim: true },

    driving_license_image: {
      type: String,
      trim: true,
      required: false,
    },
    loginType: {
      type: String,
      required: true,
      trim: true,
      default: "created by phone",
    },
    userType: {
      type: String,
      required: true,
      trim: true,
      default: "testing",
    },
    password: {
      type: String,
      required: true,
      set: encryptPassword,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.password;
        delete ret.updatedAt;
      },
    },
  }
);

schema.plugin(mongoosePaginate);

const model = mongoose.model("user", schema);

module.exports = model;
