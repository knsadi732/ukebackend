// const router = require("express")();

// const pool = require('../config/postgres')

// router.get("/test-db", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT NOW()");
//         return res.json({ success: true, time: result.rows[0] });
//     } catch (err) {
//         console.error("test-db error:", err.message, res, req);
//         return res.status(500).json({ success: false, error: err.message });
//     }
// });

// const userRoute = require("./userRoute");
// const roleRoute = require("./roleRoute");
// const siteRoute = require("./siteRoute");
// const authRoute = require("./authRoute");
// const workOrderRoute = require("./workOrderRoute");
// const { auth } = require("../middlewares/auth");

// router.use("/auth", authRoute);
// router.use("/user", userRoute);
// router.use("/role", roleRoute);
// router.use("/site", siteRoute);
// router.use("/workorder", workOrderRoute);

// module.exports = router;


const router = require("express")();
const pool = require("../config/postgres");

router.get("/", (req, res) => {
    res.json({ success: true, message: "API root working ✅" });
});

router.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        return res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

const userRoute = require("./userRoute");
const roleRoute = require("./roleRoute");
const siteRoute = require("./siteRoute");
const authRoute = require("./authRoute");
const workOrderRoute = require("./workOrderRoute");

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/role", roleRoute);
router.use("/site", siteRoute);
router.use("/workorder", workOrderRoute);

module.exports = router;
