const router = require("express").Router();
const { 
  createPayment, 
  getPayments, 
  getPaymentById, 
  updatePayment, 
  deletePayment,
  approvePayment,
  markAsPaid
} = require("../controllers/paymentController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.use(auth);

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);
router.put("/:id/approve", approvePayment);
router.put("/:id/paid", markAsPaid);

module.exports = router;