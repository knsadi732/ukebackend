const router = require("express").Router();
const { login, register, getProfile } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

router.post("/login", login);
router.post("/register", register);
router.get("/profile", auth, getProfile);

module.exports = router;