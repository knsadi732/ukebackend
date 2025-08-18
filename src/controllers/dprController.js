const DPR = require("../models/DPR");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createDPR = async (req, res) => {
  try {
    const dpr = await new DPR({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: dpr,
      msg: "DPR created successfully",
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

exports.getDPRs = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    workOrder = "",
    site = "",
    date = "",
    sortBy = "date,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (workOrder !== "") query = { ...query, workOrder };
  if (site !== "") query = { ...query, site };
  if (date !== "") query = { ...query, date };

  try {
    let dprs = await DPR.paginate(query, {
      page,
      limit,
      populate: ["workOrder", "site", "approvedBy"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: dprs,
      msg: "DPRs found successfully",
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

exports.getDPRById = async (req, res) => {
  try {
    const dpr = await DPR.findById(req.params.id)
      .populate("workOrder")
      .populate("site")
      .populate("approvedBy")
      .lean();

    if (!dpr) {
      return errorResponse({
        res,
        status: 404,
        msg: "DPR not found",
      });
    }

    return successResponse({
      res,
      data: dpr,
      msg: "DPR found successfully",
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

exports.updateDPR = async (req, res) => {
  try {
    const dpr = await DPR.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!dpr) {
      return errorResponse({
        res,
        status: 404,
        msg: "DPR not found",
      });
    }

    return successResponse({
      res,
      data: dpr,
      msg: "DPR updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update DPR",
    });
  }
};

exports.deleteDPR = async (req, res) => {
  try {
    const dpr = await DPR.findByIdAndDelete(req.params.id);

    if (!dpr) {
      return errorResponse({
        res,
        status: 404,
        msg: "DPR not found",
      });
    }

    return successResponse({
      res,
      data: dpr,
      msg: "DPR deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete DPR",
    });
  }
};

exports.approveDPR = async (req, res) => {
  try {
    const dpr = await DPR.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          approvedBy: req.authUser._id,
          approvedAt: new Date()
        } 
      },
      { new: true, lean: true }
    ).populate("workOrder")
    .populate("site")
    .populate("approvedBy");

    if (!dpr) {
      return errorResponse({
        res,
        status: 404,
        msg: "DPR not found",
      });
    }

    return successResponse({
      res,
      data: dpr,
      msg: "DPR approved successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to approve DPR",
    });
  }
};