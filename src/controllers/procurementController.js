const Procurement = require("../models/Procurement");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createProcurement = async (req, res) => {
  try {
    // Calculate total amount from items
    let totalAmount = 0;
    if (req.body.items && Array.isArray(req.body.items)) {
      totalAmount = req.body.items.reduce((sum, item) => sum + item.total, 0);
    }
    
    const procurement = await new Procurement({ 
      ...req.body, 
      totalAmount,
      createdBy: req.authUser._id 
    }).save();
    
    return successResponse({
      res,
      status: 201,
      data: procurement,
      msg: "Procurement created successfully",
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

exports.getProcurements = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    workOrder = "",
    site = "",
    searchText = "",
    sortBy = "createdAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (searchText)
    query = { ...query, title: { $regex: searchText, $options: "i" } };

  if (status !== "") query = { ...query, status };
  if (workOrder !== "") query = { ...query, workOrder };
  if (site !== "") query = { ...query, site };

  try {
    let procurements = await Procurement.paginate(query, {
      page,
      limit,
      populate: ["workOrder", "site", "approvedBy"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: procurements,
      msg: "Procurements found successfully",
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

exports.getProcurementById = async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id)
      .populate("workOrder")
      .populate("site")
      .populate("approvedBy")
      .lean();

    if (!procurement) {
      return errorResponse({
        res,
        status: 404,
        msg: "Procurement not found",
      });
    }

    return successResponse({
      res,
      data: procurement,
      msg: "Procurement found successfully",
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

exports.updateProcurement = async (req, res) => {
  try {
    // Recalculate total amount if items are updated
    let updateData = { ...req.body };
    if (req.body.items && Array.isArray(req.body.items)) {
      updateData.totalAmount = req.body.items.reduce((sum, item) => sum + item.total, 0);
    }
    
    const procurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, lean: true }
    );

    if (!procurement) {
      return errorResponse({
        res,
        status: 404,
        msg: "Procurement not found",
      });
    }

    return successResponse({
      res,
      data: procurement,
      msg: "Procurement updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update procurement",
    });
  }
};

exports.deleteProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndDelete(req.params.id);

    if (!procurement) {
      return errorResponse({
        res,
        status: 404,
        msg: "Procurement not found",
      });
    }

    return successResponse({
      res,
      data: procurement,
      msg: "Procurement deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete procurement",
    });
  }
};

exports.approveProcurement = async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: "approved",
          approvedBy: req.authUser._id,
          approvedAt: new Date()
        } 
      },
      { new: true, lean: true }
    ).populate("workOrder")
    .populate("site")
    .populate("approvedBy");

    if (!procurement) {
      return errorResponse({
        res,
        status: 404,
        msg: "Procurement not found",
      });
    }

    return successResponse({
      res,
      data: procurement,
      msg: "Procurement approved successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to approve procurement",
    });
  }
};

exports.updateProcurementStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };
    
    // Add timestamp based on status
    if (status === "ordered") {
      updateData.orderedAt = new Date();
    } else if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }
    
    const procurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, lean: true }
    ).populate("workOrder")
    .populate("site")
    .populate("approvedBy");

    if (!procurement) {
      return errorResponse({
        res,
        status: 404,
        msg: "Procurement not found",
      });
    }

    return successResponse({
      res,
      data: procurement,
      msg: "Procurement status updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update procurement status",
    });
  }
};