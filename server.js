require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || `http://localhost:${PORT}`;

const app = express();

// Ensure the upload directory exists


// Middleware setup
app.use(cors());
app.use(express.json());

// File upload middleware
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Serve static files from the upload directory
// app.use(express.static(path.join(__dirname, process.env.UPLOAD_PATH)));


const uploadPath = path.join(
  __dirname,
  process.env.UPLOAD_PATH || "public/uploads"
);
app.use("/uploads", express.static(uploadPath));


// Database connection
require("./src/config/connection");

// Route setup
const rootRouter = require("./src/routes");
app.use("/api", rootRouter);

// Default route
app.get("/", (req, res) => {
  return res.json({
    message: "API run successfully",
    data: {
      id: 1,
      name: "Aditya Kumar Singh",
      contact: "8051061619",
      address: "Ahmedabad, GJ",
      aadhar_no: "412522065864",
      pan_no: "EEYPS0519J",
      email: "adityakumarsingh09@gmail.com",
      port: PORT,
      host: HOST,
      env: process.env.NODE_ENV || "development",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.warn(`Server is running on ${HOST}`);
});
