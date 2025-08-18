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
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle Preflight Requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});
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

app.get("/api/ifsc/:code", async (req, res) => {
  try {
    const response = await axios.get(
      `https://ifsc.razorpay.com/${req.params.code}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: "Invalid IFSC Code or API Error" });
  }
});

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
