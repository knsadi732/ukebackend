const router = require("express").Router();
const { 
  createDPR, 
  getDPRs, 
  getDPRById, 
  updateDPR, 
  deleteDPR,
  approveDPR
} = require("../controllers/dprController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createDPR);
router.get("/", getDPRs);
router.get("/:id", getDPRById);
router.put("/:id", updateDPR);
router.delete("/:id", deleteDPR);
router.put("/:id/approve", approveDPR);

module.exports = router;