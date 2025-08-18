const WorkOrder = require("../models/workOrder");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `excelFile-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage }).single("excelFile");


exports.create = async (req, res) => {
  try {
    const workOrder = await new WorkOrder({ ...req.body }).save();
    return successResponse({
      res,
      status: 201,
      data: workOrder,
      msg: "Record created successfully",
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
    status = "",
    searchText = "",
    sortBy = "updatedAt,-1",
    workOrderType = "",
  } = req.query;

  const { site_id } = req.body; // Extract site_id from request body

  // Parse sorting parameters
  const sortOptions = sortBy.split(",");
  let sortField = "updatedAt"; // Default field
  let sortValue = -1; // Default order (descending)

  if (sortOptions.length === 2) {
    sortField = sortOptions[0];
    sortValue = parseInt(sortOptions[1]) || -1;
  }

  // Build query
  let query = {};
  if (workOrderType) query.workOrderType = workOrderType;
  if (status !== "") query.status = status;
  if (site_id) query.site_id = site_id; // ✅ No more "site_id is not defined" error
  if (searchText) {
    query.$or = [
      { wo_no: { $regex: searchText, $options: "i" } },
      { wo_name: { $regex: searchText, $options: "i" } },
      { site_name: { $regex: searchText, $options: "i" } },
    ];
  }

  try {
    let workOrders = await WorkOrder.find(query)
      .sort({ [sortField]: sortValue })
      .lean();

    return successResponse({
      res,
      data: workOrders,
      msg: "Record found successfully",
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
  const { status = "", searchText = "", sortBy = "updatedAt,-1" } = req.query;

  const { id } = req?.body;
  const [field, value] = sortBy.split(",");

  let query = { workOrderType: "testing" };

  // Add search and status filters if `id` is not provided
  if (!id) {
    if (searchText) {
      query = { ...query, name: { $regex: searchText, $options: "i" } };
    }

    if (status !== "") {
      query = { ...query, status };
    }
  }

  try {
    // Fetch a single document by ID or the first matching record
    const workOrder = id
      ? await WorkOrder.findOne({
          _id: id,
          // workOrderType: "testing",
          // lean: true,
        }) // Fetch by ID
      : await WorkOrder.findOne(query)
          .sort({ [field]: parseInt(value) })
          // .lean();
    if (!workOrder) {
      return errorResponse({
        res,
        status: 404,
        msg: "WorkOrder not found",
      });
    }

    return successResponse({
      res,
      data: workOrder,
      msg: "Record found successfully",
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


exports.UploadDPR = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return errorResponse({
        res,
        status: 500,
        msg: "File upload failed",
        error: err.message,
      });
    }

    if (!req.file) {
      return errorResponse({
        res,
        status: 400,
        msg: "No file uploaded!",
      });
    }

    const filePath = req.file.path;

    try {
      // Read the uploaded Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Read first sheet
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!jsonData.length) {
        return errorResponse({
          res,
          status: 400,
          msg: "Excel file is empty or improperly formatted",
        });
      }

      // Expected Headers (case insensitive)
      const expectedHeaders = [
        "SL NO",
        "JOB DESCRIPTION",
        "SERVICE CODE",
        "QTY",
        "UOM",
        "TENDER UNIT RATE(Rs)",
        "TENDER TOTAL AMOUNT(Rs)",
      ];

      // Normalize headers from the file (convert to lowercase for comparison)
      const fileHeaders = Object.keys(jsonData[0]).map((header) =>
        header.toLowerCase()
      );

      // Check for missing headers
      const missingHeaders = expectedHeaders.filter(
        (header) => !fileHeaders.includes(header.toLowerCase())
      );

      if (missingHeaders.length > 0) {
        return errorResponse({
          res,
          status: 400,
          msg: `Missing headers: ${missingHeaders.join(", ")}`,
        });
      }

      // Cleanup uploaded file after processing
      fs.unlinkSync(filePath);

      return successResponse({
        res,
        data: jsonData,
        msg: "File uploaded and processed successfully!",
      });
    } catch (error) {
      // Cleanup file in case of error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return errorResponse({
        res,
        error,
        status: 500,
        msg: "Error processing file",
      });
    }
  });
};

exports.UpdateWorkOrderById = async (req, res) => {
  const { id } = req.params; // Extract `id` from URL parameters
  const updates = req.body; // Extract updates from request body

  try {
    if (!id) {
      return errorResponse({
        res,
        status: 400,
        msg: "ID is required",
      });
    }

    // Find and update the user
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
      id, // Use the `id` to find the user
      { $set: updates }, // Apply updates
      { new: true, lean: true } // Return the updated document
    );

    if (!updatedWorkOrder) {
      // Log additional information for debugging
      console.error(`WorkOrder with ID ${id} not found.`);
      return errorResponse({
        res,
        status: 404,
        msg: "WorkOrder not found",
      });
    }

    return successResponse({
      res,
      data: updatedWorkOrder,
      msg: "WorkOrder updated successfully",
    });
  } catch (error) {
    // Handle and log any error
    console.error("Error updating workOrder:", error);
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update workOrder",
    });
  }
};

exports.deleteWorkOrderById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return errorResponse({
      res,
      status: 400,
      msg: "WorkOrder ID is required",
    });
  }

  try {
    const deletedWorkOrder = await WorkOrder.findByIdAndDelete(id);

    if (!deletedWorkOrder) {
      return errorResponse({
        res,
        status: 404,
        msg: "WorkOrder not found",
      });
    }

    return successResponse({
      res,
      //   data: deletedWorkOrder,
      msg: "WorkOrder deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete workOrder",
    });
  }
};
