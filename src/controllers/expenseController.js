const Expense = require("../models/Expense");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createExpense = async (req, res) => {
  try {
    const expense = await new Expense({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: expense,
      msg: "Expense record created successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.getExpenses = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    site = "",
    workOrder = "",
    category = "",
    sortBy = "expenseDate,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (status !== "") query = { ...query, status };
  if (site !== "") query = { ...query, site };
  if (workOrder !== "") query = { ...query, workOrder };
  if (category !== "") query = { ...query, category };

  try {
    let expenses = await Expense.paginate(query, {
      page,
      limit,
      populate: ["site", "workOrder", "approvedBy"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: expenses,
      msg: "Expense records found successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("site")
      .populate("workOrder")
      .populate("approvedBy")
      .lean();

    if (!expense) {
      return errorResponse({
        res,
        status: 404,
        msg: "Expense record not found",
      });
    }

    return successResponse({
      res,
      data: expense,
      msg: "Expense record found successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Invalid data",
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!expense) {
      return errorResponse({
        res,
        status: 404,
        msg: "Expense record not found",
      });
    }

    return successResponse({
      res,
      data: expense,
      msg: "Expense record updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update expense record",
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return errorResponse({
        res,
        status: 404,
        msg: "Expense record not found",
      });
    }

    return successResponse({
      res,
      data: expense,
      msg: "Expense record deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete expense record",
    });
  }
};

exports.approveExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: "approved",
          approvedBy: req.authUser._id,
          approvedAt: new Date()
        } 
      },
      { new: true, lean: true }
    ).populate("site")
    .populate("workOrder")
    .populate("approvedBy");

    if (!expense) {
      return errorResponse({
        res,
        status: 404,
        msg: "Expense record not found",
      });
    }

    return successResponse({
      res,
      data: expense,
      msg: "Expense record approved successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to approve expense record",
    });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: "paid",
          paidAt: new Date()
        } 
      },
      { new: true, lean: true }
    ).populate("site")
    .populate("workOrder")
    .populate("approvedBy");

    if (!expense) {
      return errorResponse({
        res,
        status: 404,
        msg: "Expense record not found",
      });
    }

    return successResponse({
      res,
      data: expense,
      msg: "Expense record marked as paid successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to mark expense record as paid",
    });
  }
};