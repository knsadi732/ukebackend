const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { encryptPassword } = require("../helpers/modelHelper");

const schema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, trim: true },
    role_shorthand: { type: String, required: true, trim: true, unique: true },
    loginType: {
      type: String,
      required: true,
      trim: true,
      default: "created by phone",
    },
    roleType: {
      trim: true,
      type: String,
      required: true,
      default: "testing",
    },
 
  },
  {
    timestamps: true,
    versionKey: false,
    virtuals: {
      token: { type: String },
    },
    toJSON: {
      transform: (doc, res) => {
        delete res._id;
        delete res.password;
        delete res.updatedAt;
      },
      getters: true,
    },
  }
).plugin(mongoosePaginate);

const model = mongoose.model("role", schema);

module.exports = model;
