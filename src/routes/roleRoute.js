const app = require("express")();

const {
  create,
  getRoles,
  getRolesById,
  getAllRoles,
  deleteRoleById,
} = require("../controllers/roleController");

app.post("/create", create);
app.get("/get-roles", getRoles);
app.get("/get-all-roles", getAllRoles);
app.post("/get-roles-by-id", getRolesById);
app.post("/delete-roles-by-id", deleteRoleById);

module.exports = app;