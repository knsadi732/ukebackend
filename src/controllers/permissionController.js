const Permission = require("../models/Permission");
const Role = require("../models/role");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createPermission = async (req, res) => {
  try {
    const permission = await new Permission({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: permission,
      msg: "Permission created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse({
        res,
        status: 400,
        msg: "Permission already exists for this role and module",
      });
    }
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.getPermissions = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    role = "",
    module = "",
    sortBy = "createdAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (role !== "") query = { ...query, role };
  if (module !== "") query = { ...query, module };

  try {
    let permissions = await Permission.paginate(query, {
      page,
      limit,
      populate: ["role"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: permissions,
      msg: "Permissions found successfully",
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

exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id)
      .populate("role")
      .lean();

    if (!permission) {
      return errorResponse({
        res,
        status: 404,
        msg: "Permission not found",
      });
    }

    return successResponse({
      res,
      data: permission,
      msg: "Permission found successfully",
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

exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!permission) {
      return errorResponse({
        res,
        status: 404,
        msg: "Permission not found",
      });
    }

    return successResponse({
      res,
      data: permission,
      msg: "Permission updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update permission",
    });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);

    if (!permission) {
      return errorResponse({
        res,
        status: 404,
        msg: "Permission not found",
      });
    }

    return successResponse({
      res,
      data: permission,
      msg: "Permission deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete permission",
    });
  }
};

exports.checkPermission = async (req, res) => {
  try {
    const { roleId, module, action } = req.query;
    
    if (!roleId || !module || !action) {
      return errorResponse({
        res,
        status: 400,
        msg: "roleId, module, and action are required",
      });
    }

    const permission = await Permission.findOne({ role: roleId, module });
    
    if (!permission) {
      return successResponse({
        res,
        data: { hasPermission: false },
        msg: "Permission not found",
      });
    }

    const hasPermission = permission.permissions[action] || false;

    return successResponse({
      res,
      data: { hasPermission },
      msg: "Permission check completed",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to check permission",
    });
  }
};

exports.getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    
    const permissions = await Permission.find({ role: roleId })
      .populate("role")
      .lean();

    return successResponse({
      res,
      data: permissions,
      msg: "Role permissions found successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to get role permissions",
    });
  }
};