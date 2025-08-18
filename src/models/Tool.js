const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "in-use", "maintenance", "retired"],
      default: "available",
    },
    purchaseDate: {
      type: Date,
    },
    purchaseCost: {
      type: Number,
    },
    currentLocation: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
    maintenanceSchedule: {
      type: Date,
    },
    lastMaintenanceDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
      },
    },
  }
);

toolSchema.plugin(mongoosePaginate);

const Tool = mongoose.model("Tool", toolSchema);

module.exports = Tool;