const router = require("express").Router();
const { 
  createProcurement, 
  getProcurements, 
  getProcurementById, 
  updateProcurement, 
  deleteProcurement,
  approveProcurement,
  updateProcurementStatus
} = require("../controllers/procurementController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createProcurement);
router.get("/", getProcurements);
router.get("/:id", getProcurementById);
router.put("/:id", updateProcurement);
router.delete("/:id", deleteProcurement);
router.put("/:id/approve", approveProcurement);
router.put("/:id/status", updateProcurementStatus);

module.exports = router;