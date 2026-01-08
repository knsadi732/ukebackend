require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");

const connectDB = require("./src/config/connection");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || `http://localhost:${PORT}`;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});

app.use(
  fileUpload({
    createParentPath: true,
  })
);

const uploadPath = path.join(
  __dirname,
  process.env.UPLOAD_PATH || "public/uploads"
);
app.use("/uploads", express.static(uploadPath));

// Routes
const rootRouter = require("./src/routes");
app.use("/api", rootRouter);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "API run successfully" });
});

// 🚀 START SERVER ONLY AFTER DB CONNECT
const startServer = async () => {
  await connectDB(); // ⬅️ THIS IS THE KEY FIX

  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${HOST}`);
  });
};

startServer();
