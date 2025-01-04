const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => console.log(`Database connected on ${process.env.DB_URI}`))
  .catch((err) => console.error(err));
