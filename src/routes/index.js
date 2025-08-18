const router = require("express")();

const userRoute = require("./userRoute");
const roleRoute = require("./roleRoute");
const siteRoute = require("./siteRoute");
const workOrderRoute = require("./workOrderRoute");
const toolRoute = require("./toolRoute");
const checklistRoute = require("./checklistRoute");
const dprRoute = require("./dprRoute");
const procurementRoute = require("./procurementRoute");
const attendanceRoute = require("./attendanceRoute");
const paymentRoute = require("./paymentRoute");
const expenseRoute = require("./expenseRoute");
const permissionRoute = require("./permissionRoute");
const authRoute = require("./authRoute");
const { auth } = require("../middlewares/auth");

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/role", roleRoute);
router.use("/site", siteRoute);
router.use("/work-order", workOrderRoute);
router.use("/tool", toolRoute);
router.use("/checklist", checklistRoute);
router.use("/dpr", dprRoute);
router.use("/procurement", procurementRoute);
router.use("/attendance", attendanceRoute);
router.use("/payment", paymentRoute);
router.use("/expense", expenseRoute);
router.use("/permission", permissionRoute);

module.exports = router;
