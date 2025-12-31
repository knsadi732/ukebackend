const router = require("express").Router();
const { login, register, getProfile } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

// Multer middleware for handling multiple file uploads
// The field names should match the keys used in FormData on the frontend
const uploadMiddleware = upload.fields([
  { name: 'aadhar_front_image', maxCount: 1 },
  { name: 'aadhar_back_image', maxCount: 1 },
  { name: 'pan_image', maxCount: 1 },
  { name: 'upload_image', maxCount: 1 },
  { name: 'medical', maxCount: 1 },
  { name: 'eye_test_medical', maxCount: 1 },
  { name: 'driving_license_image', maxCount: 1 },
  { name: 'certificate', maxCount: 5 } // Assuming up to 5 certificates
]);

router.post("/login", login);
router.post("/register", uploadMiddleware, register);
router.get("/profile", auth, getProfile);

module.exports = router;