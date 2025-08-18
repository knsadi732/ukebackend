const Tool = require("../models/Tool");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createTool = async (req, res) => {
  try {
    const tool = await new Tool({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: tool,
      msg: "Tool created successfully",
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

exports.getTools = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    category = "",
    searchText = "",
    sortBy = "createdAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (searchText)
    query = { ...query, name: { $regex: searchText, $options: "i" } };

  if (status !== "") query = { ...query, status };
  if (category !== "") query = { ...query, category };

  try {
    let tools = await Tool.paginate(query, {
      page,
      limit,
      populate: ["assignedTo", "site"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: tools,
      msg: "Tools found successfully",
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

exports.getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate("assignedTo")
      .populate("site")
      .lean();

    if (!tool) {
      return errorResponse({
        res,
        status: 404,
        msg: "Tool not found",
      });
    }

    return successResponse({
      res,
      data: tool,
      msg: "Tool found successfully",
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

exports.updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!tool) {
      return errorResponse({
        res,
        status: 404,
        msg: "Tool not found",
      });
    }

    return successResponse({
      res,
      data: tool,
      msg: "Tool updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update tool",
    });
  }
};

exports.deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);

    if (!tool) {
      return errorResponse({
        res,
        status: 404,
        msg: "Tool not found",
      });
    }

    return successResponse({
      res,
      data: tool,
      msg: "Tool deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete tool",
    });
  }
};