// const mongoose = require("mongoose");

// mongoose.set("strictQuery", false);
// mongoose.set("strictPopulate", false);

// mongoose
//   .connect(process.env.DB_URI, { useNewUrlParser: true })
//   .then(() => console.log(`Database connected on ${process.env.DB_URI}`))
//   .catch((err) => console.error(err));


const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
