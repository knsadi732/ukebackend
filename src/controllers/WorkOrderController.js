const WorkOrder = require("../models/workOrder");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

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
    console.log("iddddd", { id });
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
    console.log({ workOrder });
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
