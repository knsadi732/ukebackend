const WorkOrder = require("../models/WorkOrder");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

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