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
    page = 1,
    limit = 10,
    status = "",
    searchText = "",
    sortBy = "updatedAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = { workOrderType: "testing" };

  if (searchText)
    query = { ...query, name: { $regex: searchText, $options: "i" } };

  if (status !== "") query = { ...query, status };

  try {
    let workOrders = await WorkOrder.paginate(query, {
      page,
      limit,
      lean: true,
      sort: { [field]: parseInt(value) },
    });

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
  const {
    status = "",
    searchText = "",
    id = "", // Extract `id` from query parameters
    sortBy = "updatedAt,-1",
  } = req.query;

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
          workOrderType: "testing",
          lean: true,
        }) // Fetch by ID
      : await WorkOrder.findOne(query)
          .sort({ [field]: parseInt(value) })
          .lean();

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
    console.log({ id });
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
