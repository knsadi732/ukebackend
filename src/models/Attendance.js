const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    workOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkOrder",
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave", "holiday"],
      default: "present",
    },
    inTime: {
      type: Date,
    },
    outTime: {
      type: Date,
    },
    hoursWorked: {
      type: Number,
    },
    overtime: {
      type: Number,
      default: 0,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    remarks: {
      type: String,
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

attendanceSchema.plugin(mongoosePaginate);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;