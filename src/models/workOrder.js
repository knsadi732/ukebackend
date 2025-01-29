const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { encryptPassword } = require("../helpers/modelHelper");

const schema = new mongoose.Schema(
  {
    site_id: { type: String, required: true },
    site_name: { type: String, required: true, trim: true },
    wo_no: { type: String, required: true, trim: true },
    wo_name: { type: String, required: true, trim: true },
    nature_of_work: { type: String, required: true, trim: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    inspecting_authority: { type: String, required: true, trim: true },
    executing_authority: { type: String, required: true, trim: true },
    work_order_tenure: { type: String, required: true, trim: true },
    work_order_value: { type: Number, required: true },
    billing_cycle: { type: String, required: true, trim: true },

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

const model = mongoose.model("work_order", schema);

module.exports = model;
