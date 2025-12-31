const app = require("express")();
const { login } = require("../controllers/authController");

app.post("/login", login);

module.exports = app;