const router = require("express").Router();
const { 
  createWorkOrder, 
  getWorkOrders, 
  getWorkOrderById, 
  updateWorkOrder, 
  deleteWorkOrder,
  uploadJobList,
  getJobListByWorkOrderId
} = require("../controllers/workOrderController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createWorkOrder);
router.get("/", getWorkOrders);
router.get("/:id", getWorkOrderById);
router.put("/:id", updateWorkOrder);
router.delete("/:id", deleteWorkOrder);

// New routes for job list management
router.post("/:workOrderId/upload-job-list", uploadJobList);
router.get("/:workOrderId/job-list", getJobListByWorkOrderId);

module.exports = router;