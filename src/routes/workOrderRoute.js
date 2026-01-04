const router = require("express").Router();
const workOrderController = require("../controllers/workOrderController");

router.post("/create", workOrderController.createWorkOrder);
router.post("/get-workorders", workOrderController.getWorkOrders);
router.post("/get-workorders-by-site", workOrderController.getWorkOrdersBySiteId);
router.post("/get-workorder-by-id", workOrderController.getWorkOrderById);
router.post("/update-workorder-by-id/:id", workOrderController.updateWorkOrderById);
router.post("/delete-workorder-by-id", workOrderController.deleteWorkOrderById);
router.post("/seed-workorders", workOrderController.seedWorkOrders);

module.exports = router;