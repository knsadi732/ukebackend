const WorkOrder = require("../models/WorkOrder");
const WorkOrderJobItem = require("../models/WorkOrderJobItem"); // Import the new model
const { successResponse, errorResponse } = require("../helpers/apiHelper");
const XLSX = require('xlsx'); // Import xlsx library

exports.createWorkOrder = async (req, res) => {
  try {
    const workOrder = await new WorkOrder({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: workOrder,
      msg: "Work order created successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.getWorkOrders = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    searchText = "",
    sortBy = "createdAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (searchText)
    query = { ...query, title: { $regex: searchText, $options: "i" } };

  if (status !== "") query = { ...query, status };

  try {
    let workOrders = await WorkOrder.paginate(query, {
      page,
      limit,
      populate: ["site", "assignedTo"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: workOrders,
      msg: "Work orders found successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate("site")
      .populate("assignedTo")
      .lean();

    if (!workOrder) {
      return errorResponse({
        res,
        status: 404,
        msg: "Work order not found",
      });
    }

    return successResponse({
      res,
      data: workOrder,
      msg: "Work order found successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.updateWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!workOrder) {
      return errorResponse({
        res,
        status: 404,
        msg: "Work order not found",
      });
    }

    return successResponse({
      res,
      data: workOrder,
      msg: "Work order updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update work order",
    });
  }
};

exports.deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndDelete(req.params.id);

    if (!workOrder) {
      return errorResponse({
        res,
        status: 404,
        msg: "Work order not found",
      });
    }

    return successResponse({
      res,
      data: workOrder,
      msg: "Work order deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete work order",
    });
  }
};

// New function to upload job list from Excel
exports.uploadJobList = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.files || !req.files.file) {
      return errorResponse({
        res,
        status: 400,
        msg: "No file uploaded",
      });
    }

    const file = req.files.file;
    const workOrderId = req.params.workOrderId;

    // Check if work order exists
    const workOrder = await WorkOrder.findById(workOrderId);
    if (!workOrder) {
      return errorResponse({
        res,
        status: 404,
        msg: "Work order not found",
      });
    }

    // Check if file is an Excel file (basic check)
    if (!file.mimetype.includes('spreadsheetml') && !file.mimetype.includes('excel')) {
      return errorResponse({
        res,
        status: 400,
        msg: "Invalid file type. Please upload an Excel file.",
      });
    }

    // Parse the Excel file
    const workbook = XLSX.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // header: 1 to get array of arrays
    
    // Process the data
    // Assuming the first row is the header
    const headers = jsonData[0];
    const jobItems = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      // Map row data to job item fields based on your Excel structure
      // This is a simplified example, you'll need to adjust based on your actual Excel columns
      const jobItem = {
        workOrder: workOrderId,
        sno: row[0], // Assuming S.No is in the first column
        itemDescription: row[1], // Assuming Item Description is in the second column
        quantity: row[2], // Assuming Quantity is in the third column
        unit: row[3], // Assuming Unit is in the fourth column
        rate: row[4], // Assuming Rate is in the fifth column
        amount: row[5], // Assuming Amount is in the sixth column
        // Add other fields as needed
      };
      
      // Validate and save job item
      // You might want to add more validation here
      jobItems.push(jobItem);
    }
    
    // Delete existing job items for this work order (if any)
    await WorkOrderJobItem.deleteMany({ workOrder: workOrderId });
    
    // Save new job items
    await WorkOrderJobItem.insertMany(jobItems);
    
    return successResponse({
      res,
      status: 200,
      msg: `Successfully uploaded ${jobItems.length} job items for work order ${workOrder.title}`,
    });
   
  } catch (error) {
    console.error("Error uploading job list:", error);
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Failed to upload job list",
    });
  }
};

// New function to get job list for a work order
exports.getJobListByWorkOrderId = async (req, res) => {
  try {
    const workOrderId = req.params.workOrderId;
    
    // Check if work order exists
    const workOrder = await WorkOrder.findById(workOrderId);
    if (!workOrder) {
      return errorResponse({
        res,
        status: 404,
        msg: "Work order not found",
      });
    }
    
    // Get job items for this work order
    const jobItems = await WorkOrderJobItem.find({ workOrder: workOrderId }).lean();
    
    return successResponse({
      res,
      data: jobItems,
      msg: "Job list retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching job list:", error);
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Failed to fetch job list",
    });
  }
};