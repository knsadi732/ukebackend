const router = require("express").Router();
const { 
  createAttendance, 
  getAttendances, 
  getAttendanceById, 
  updateAttendance, 
  deleteAttendance,
  approveAttendance,
  bulkCreateAttendance
} = require("../controllers/attendanceController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createAttendance);
router.post("/bulk", bulkCreateAttendance);
router.get("/", getAttendances);
router.get("/:id", getAttendanceById);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);
router.put("/:id/approve", approveAttendance);

module.exports = router;