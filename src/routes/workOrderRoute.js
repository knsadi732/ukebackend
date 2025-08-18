const router = require("express").Router();
const { 
  createWorkOrder, 
  getWorkOrders, 
  getWorkOrderById, 
  updateWorkOrder, 
  deleteWorkOrder 
} = require("../controllers/workOrderController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createWorkOrder);
router.get("/", getWorkOrders);
router.get("/:id", getWorkOrderById);
router.put("/:id", updateWorkOrder);
router.delete("/:id", deleteWorkOrder);

module.exports = router;