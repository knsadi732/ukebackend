const router = require("express")();

const userRoute = require("./userRoute");
const roleRoute = require("./roleRoute");
const siteRoute = require("./siteRoute");
const authRoute = require("./authRoute");
// const packageRoute = require("./packageRoute");
// const bookingRoute = require("./bookingRoute");
// const dashboardRoute = require("./dashboardRoute");
const { auth } = require("../middlewares/auth");
// const holidayPackageRoute = require("./holidayPackageRoute");

router.use("/auth", authRoute);
// router.use("/holiday", holidayPackageRoute);
// router.use("/booking", [auth], bookingRoute);
// router.use("/user", [auth], userRoute);
router.use("/user",  userRoute);
router.use("/role",  roleRoute);
router.use("/site",  siteRoute);
// router.use("/package", [auth, isAdmin], packageRoute);
// router.use("/dashboard", [auth, isAdmin], dashboardRoute);

module.exports = router;
