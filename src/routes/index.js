const router = require("express")();

const userRoute = require("./userRoute");
const roleRoute = require("./roleRoute");
const siteRoute = require("./siteRoute");
const authRoute = require("./authRoute");
const workOrderRoute = require("./workOrderRoute");
const { auth } = require("../middlewares/auth");



router.use("/auth", authRoute);
router.use("/user",  userRoute);
router.use("/role",  roleRoute);
router.use("/site",  siteRoute);
router.use("/workorder", workOrderRoute);

module.exports = router;
