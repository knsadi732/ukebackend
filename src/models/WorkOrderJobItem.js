const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const workOrderJobItemSchema = new mongoose.Schema({
  workOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkOrder',
    required: true,
    index: true // Index for faster lookups by workOrder
  },
  sno: { // Serial Number from Excel
    type: Number,
    required: true
  },
  itemDescription: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: { // quantity * rate
    type: Number,
    required: true
  },
  // Add any other fields that are present in your Excel job list
  // For example: category, specifications, etc.
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
    }
  }
});

// Optional: Add indexes for frequently queried fields if needed
// workOrderJobItemSchema.index({ workOrder: 1, sno: 1 }); 

workOrderJobItemSchema.plugin(mongoosePaginate);

const WorkOrderJobItem = mongoose.model('WorkOrderJobItem', workOrderJobItemSchema);

module.exports = WorkOrderJobItem;