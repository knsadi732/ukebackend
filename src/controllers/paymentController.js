const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createPayment = async (req, res) => {
  try {
    const payment = await new Payment({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: payment,
      msg: "Payment record created successfully",
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

exports.getPayments = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    site = "",
    workOrder = "",
    user = "",
    paymentType = "",
    sortBy = "paymentDate,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (status !== "") query = { ...query, status };
  if (site !== "") query = { ...query, site };
  if (workOrder !== "") query = { ...query, workOrder };
  if (user !== "") query = { ...query, user };
  if (paymentType !== "") query = { ...query, paymentType };

  try {
    let payments = await Payment.paginate(query, {
      page,
      limit,
      populate: ["user", "site", "workOrder", "approvedBy"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: payments,
      msg: "Payment records found successfully",
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

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user")
      .populate("site")
      .populate("workOrder")
      .populate("approvedBy")
      .lean();

    if (!payment) {
      return errorResponse({
        res,
        status: 404,
        msg: "Payment record not found",
      });
    }

    return successResponse({
      res,
      data: payment,
      msg: "Payment record found successfully",
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

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!payment) {
      return errorResponse({
        res,
        status: 404,
        msg: "Payment record not found",
      });
    }

    return successResponse({
      res,
      data: payment,
      msg: "Payment record updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update payment record",
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return errorResponse({
        res,
        status: 404,
        msg: "Payment record not found",
      });
    }

    return successResponse({
      res,
      data: payment,
      msg: "Payment record deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete payment record",
    });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: "approved",
          approvedBy: req.authUser._id,
          approvedAt: new Date()
        } 
      },
      { new: true, lean: true }
    ).populate("user")
    .populate("site")
    .populate("workOrder")
    .populate("approvedBy");

    if (!payment) {
      return errorResponse({
        res,
        status: 404,
        msg: "Payment record not found",
      });
    }

    return successResponse({
      res,
      data: payment,
      msg: "Payment record approved successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to approve payment record",
    });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status: "paid",
          paidAt: new Date()
        } 
      },
      { new: true, lean: true }
    ).populate("user")
    .populate("site")
    .populate("workOrder")
    .populate("approvedBy");

    if (!payment) {
      return errorResponse({
        res,
        status: 404,
        msg: "Payment record not found",
      });
    }

    return successResponse({
      res,
      data: payment,
      msg: "Payment record marked as paid successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to mark payment record as paid",
    });
  }
};