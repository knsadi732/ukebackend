const router = require("express").Router();
const { 
  createPermission, 
  getPermissions, 
  getPermissionById, 
  updatePermission, 
  deletePermission,
  checkPermission,
  getRolePermissions
} = require("../controllers/permissionController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createPermission);
router.get("/", getPermissions);
router.get("/:id", getPermissionById);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);
router.get("/check", checkPermission);
router.get("/role/:roleId", getRolePermissions);

module.exports = router;