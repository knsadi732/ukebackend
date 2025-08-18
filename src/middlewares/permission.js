const Permission = require("../models/Permission");

exports.checkModulePermission = (module, action) => {
  return async (req, res, next) => {
    try {
      // If user is admin, allow all permissions
      if (req.authUser.userType === "Admin") {
        return next();
      }

      // Find permission for user's role and module
      const permission = await Permission.findOne({
        role: req.authUser.role,
        module: module
      });

      // If no permission found, deny access
      if (!permission) {
        return res.status(403).json({
          message: "You don't have permission to perform this action",
          success: false,
          status: 403,
          data: null,
        });
      }

      // Check if user has the required permission
      if (!permission.permissions[action]) {
        return res.status(403).json({
          message: `You don't have ${action} permission for ${module}`,
          success: false,
          status: 403,
          data: null,
        });
      }

      // User has permission, proceed to next middleware
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        success: false,
        status: 500,
        data: null,
      });
    }
  };
};