const app = require("express")();

const {
  create,
  getWorkOrders,
  getWorkOrderById,
  UpdateWorkOrderById,
  deleteWorkOrderById,
} = require("../controllers/WorkOrderController");


app.post("/create", create);
app.post("/get-Work_orders", getWorkOrders);
app.post("/get-Work_order-by-id", getWorkOrderById);
app.post("/update-Work_order-by-id/:id", UpdateWorkOrderById);
app.post("/delete-Work_order-by-id", deleteWorkOrderById);

module.exports = app;
