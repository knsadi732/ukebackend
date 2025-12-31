const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const dprSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    workOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkOrder",
      required: true,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    workDescription: {
      type: String,
      required: true,
    },
    workProgress: {
      type: Number, // Percentage
      required: true,
      min: 0,
      max: 100,
    },
    materialsUsed: [
      {
        materialName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
      },
    ],
    manpower: {
      skilled: {
        type: Number,
        default: 0,
      },
      unskilled: {
        type: Number,
        default: 0,
      },
      supervisors: {
        type: Number,
        default: 0,
      },
    },
    machineryHours: [
      {
        machineName: {
          type: String,
          required: true,
        },
        hours: {
          type: Number,
          required: true,
        },
      },
    ],
    weatherCondition: {
      type: String,
      enum: ["sunny", "cloudy", "rainy", "stormy", "other"],
    },
    issues: {
      type: String,
    },
    remarks: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // New field to reference job items and track daily progress
    jobDetails: [
      {
        jobItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "WorkOrderJobItem",
          required: true,
        },
        quantityDone: {
          type: Number,
          required: true,
        },
        // You can add other daily-specific fields here, like shift, time, etc.
        // shift: { type: String },
        // startTime: { type: Date },
        // endTime: { type: Date },
      },
    ],
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

dprSchema.plugin(mongoosePaginate);

const DPR = mongoose.model("DPR", dprSchema);

module.exports = DPR;