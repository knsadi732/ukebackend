const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    site_shorthand: { type: String, required: true, trim: true, unique: true },
    location: { type: String, required: true, trim: true },
    status: { 
      type: String, 
      enum: ["active", "inactive", "pending"], 
      default: "active" 
    },
    siteType: {
      trim: true,
      type: String,
      required: true,
      default: "operational",
    },
 
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, res) => {
        delete res._id;
        delete res.updatedAt;
      },
      getters: true,
    },
  }
).plugin(mongoosePaginate);

const model = mongoose.model("site", schema);

module.exports = model;
