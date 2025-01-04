const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { encryptPassword } = require("../helpers/modelHelper");

const schema = new mongoose.Schema(
  {
    site_name: { type: String, required: true, trim: true },
    site_shorthand: { type: String, required: true, trim: true, unique: true },
    loginType: {
      type: String,
      required: true,
      trim: true,
      default: "created by phone",
    },
    siteType: {
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

const model = mongoose.model("site", schema);

module.exports = model;
