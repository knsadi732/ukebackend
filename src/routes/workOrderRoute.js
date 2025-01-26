const app = require("express")();

const {
  create,
  getWorkOrders,
  getWorkOrderById,
  UpdateWorkOrderById,
  deleteWorkOrderById,
} = require("../controllers/WorkOrderController");


app.post("/create", create);
app.post("/get-work_orders", getWorkOrders);
app.post("/get-work_order-by-id", getWorkOrderById);
app.post("/update-work_order-by-id/:id", UpdateWorkOrderById);
app.post("/delete-work_order-by-id", deleteWorkOrderById);

module.exports = app;