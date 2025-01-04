const app = require("express")();

const {
  create,
  getUsers,
  getUserById,
  UpdateUserById,
  deleteUserById,
} = require("../controllers/userController");


app.post("/create", create);
app.post("/get-users", getUsers);
app.post("/get-user-by-id", getUserById);
app.post("/update-user-by-id/:id", UpdateUserById);
app.post("/delete-user-by-id", deleteUserById);

module.exports = app;
