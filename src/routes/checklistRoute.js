const router = require("express").Router();
const { 
  createChecklist, 
  getChecklists, 
  getChecklistById, 
  updateChecklist, 
  deleteChecklist,
  updateChecklistItem
} = require("../controllers/checklistController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createChecklist);
router.get("/", getChecklists);
router.get("/:id", getChecklistById);
router.put("/:id", updateChecklist);
router.delete("/:id", deleteChecklist);
router.put("/:id/items", updateChecklistItem);

module.exports = router;