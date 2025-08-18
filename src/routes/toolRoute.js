const router = require("express").Router();
const { 
  createTool, 
  getTools, 
  getToolById, 
  updateTool, 
  deleteTool 
} = require("../controllers/toolController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createTool);
router.get("/", getTools);
router.get("/:id", getToolById);
router.put("/:id", updateTool);
router.delete("/:id", deleteTool);

module.exports = router;