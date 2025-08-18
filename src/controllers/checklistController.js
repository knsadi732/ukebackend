const Checklist = require("../models/Checklist");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createChecklist = async (req, res) => {
  try {
    const checklist = await new Checklist({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: checklist,
      msg: "Checklist created successfully",
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

exports.getChecklists = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    workOrder = "",
    searchText = "",
    sortBy = "createdAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (searchText)
    query = { ...query, title: { $regex: searchText, $options: "i" } };

  if (status !== "") query = { ...query, status };
  if (workOrder !== "") query = { ...query, workOrder };

  try {
    let checklists = await Checklist.paginate(query, {
      page,
      limit,
      populate: ["workOrder", "site", "assignedTo"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: checklists,
      msg: "Checklists found successfully",
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

exports.getChecklistById = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id)
      .populate("workOrder")
      .populate("site")
      .populate("assignedTo")
      .lean();

    if (!checklist) {
      return errorResponse({
        res,
        status: 404,
        msg: "Checklist not found",
      });
    }

    return successResponse({
      res,
      data: checklist,
      msg: "Checklist found successfully",
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

exports.updateChecklist = async (req, res) => {
  try {
    const checklist = await Checklist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!checklist) {
      return errorResponse({
        res,
        status: 404,
        msg: "Checklist not found",
      });
    }

    return successResponse({
      res,
      data: checklist,
      msg: "Checklist updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update checklist",
    });
  }
};

exports.deleteChecklist = async (req, res) => {
  try {
    const checklist = await Checklist.findByIdAndDelete(req.params.id);

    if (!checklist) {
      return errorResponse({
        res,
        status: 404,
        msg: "Checklist not found",
      });
    }

    return successResponse({
      res,
      data: checklist,
      msg: "Checklist deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete checklist",
    });
  }
};

exports.updateChecklistItem = async (req, res) => {
  try {
    const { itemId, isCompleted, remarks } = req.body;
    const checklist = await Checklist.findById(req.params.id);

    if (!checklist) {
      return errorResponse({
        res,
        status: 404,
        msg: "Checklist not found",
      });
    }

    const itemIndex = checklist.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return errorResponse({
        res,
        status: 404,
        msg: "Checklist item not found",
      });
    }

    checklist.items[itemIndex].isCompleted = isCompleted;
    checklist.items[itemIndex].remarks = remarks;
    if (isCompleted) {
      checklist.items[itemIndex].completedBy = req.authUser._id;
      checklist.items[itemIndex].completedAt = new Date();
    }

    await checklist.save();

    return successResponse({
      res,
      data: checklist,
      msg: "Checklist item updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update checklist item",
    });
  }
};