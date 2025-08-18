const router = require("express").Router();
const { 
  createExpense, 
  getExpenses, 
  getExpenseById, 
  updateExpense, 
  deleteExpense,
  approveExpense,
  markAsPaid
} = require("../controllers/expenseController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.put("/:id/approve", approveExpense);
router.put("/:id/paid", markAsPaid);

module.exports = router;