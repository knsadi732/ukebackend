const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const checklistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
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
    items: [
      {
        item: {
          type: String,
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        completedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        completedAt: {
          type: Date,
        },
        remarks: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

checklistSchema.plugin(mongoosePaginate);

const Checklist = mongoose.model("Checklist", checklistSchema);

module.exports = Checklist;