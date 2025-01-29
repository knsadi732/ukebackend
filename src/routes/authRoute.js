const app = require("express")();

const { login } = require("../controllers/authController");

app.post("/login", login);
// app.post("/delete-work_order-by-id", deleteWorkOrderById);

module.exports = app;
