const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    module: {
      type: String,
      required: true,
      enum: [
        "user",
        "site",
        "workOrder",
        "role",
        "tool",
        "checklist",
        "dpr",
        "procurement",
        "attendance",
        "payment",
        "expense"
      ],
    },
    permissions: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

// Ensure unique combination of role and module
permissionSchema.index({ role: 1, module: 1 }, { unique: true });

permissionSchema.plugin(mongoosePaginate);

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;