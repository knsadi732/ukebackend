const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new mongoose.Schema(
  {
    workOrderNumber: {
      type: String,
      trim: true,
      unique: true,
      default: () => `WO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "site",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: Date },
    assignedTo: { type: String, trim: true },
    status: {
      type: String,
      default: "pending",
      trim: true,
    },
    priority: {
      type: String,
      default: "medium",
      trim: true,
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
);

schema.plugin(mongoosePaginate);

const model = mongoose.model("workOrder", schema);

module.exports = model;