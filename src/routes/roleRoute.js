const app = require("express")();

const {
  create,
  getRoles,
  getRolesById,
  deleteRoleById,
} = require("../controllers/roleController");

app.post("/create", create);
app.post("/get-roles", getRoles);
app.post("/get-roles-by-id", getRolesById);
app.post("/delete-roles-by-id", deleteRoleById);

module.exports = app;
