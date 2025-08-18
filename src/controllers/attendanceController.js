const Attendance = require("../models/Attendance");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createAttendance = async (req, res) => {
  try {
    const attendance = await new Attendance({ ...req.body, createdBy: req.authUser._id }).save();
    return successResponse({
      res,
      status: 201,
      data: attendance,
      msg: "Attendance record created successfully",
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

exports.getAttendances = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    site = "",
    workOrder = "",
    date = "",
    user = "",
    sortBy = "date,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (status !== "") query = { ...query, status };
  if (site !== "") query = { ...query, site };
  if (workOrder !== "") query = { ...query, workOrder };
  if (user !== "") query = { ...query, user };
  if (date !== "") query = { ...query, date };

  try {
    let attendances = await Attendance.paginate(query, {
      page,
      limit,
      populate: ["user", "site", "workOrder", "approvedBy"],
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: attendances,
      msg: "Attendance records found successfully",
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

exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("user")
      .populate("site")
      .populate("workOrder")
      .populate("approvedBy")
      .lean();

    if (!attendance) {
      return errorResponse({
        res,
        status: 404,
        msg: "Attendance record not found",
      });
    }

    return successResponse({
      res,
      data: attendance,
      msg: "Attendance record found successfully",
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

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );

    if (!attendance) {
      return errorResponse({
        res,
        status: 404,
        msg: "Attendance record not found",
      });
    }

    return successResponse({
      res,
      data: attendance,
      msg: "Attendance record updated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update attendance record",
    });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return errorResponse({
        res,
        status: 404,
        msg: "Attendance record not found",
      });
    }

    return successResponse({
      res,
      data: attendance,
      msg: "Attendance record deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete attendance record",
    });
  }
};

exports.approveAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          approvedBy: req.authUser._id,
          status: "present"
        } 
      },
      { new: true, lean: true }
    ).populate("user")
    .populate("site")
    .populate("workOrder")
    .populate("approvedBy");

    if (!attendance) {
      return errorResponse({
        res,
        status: 404,
        msg: "Attendance record not found",
      });
    }

    return successResponse({
      res,
      data: attendance,
      msg: "Attendance record approved successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to approve attendance record",
    });
  }
};

exports.bulkCreateAttendance = async (req, res) => {
  try {
    const { attendances } = req.body;
    
    // Add createdBy to each attendance record
    const attendanceRecords = attendances.map(att => ({
      ...att,
      createdBy: req.authUser._id
    }));
    
    const createdAttendances = await Attendance.insertMany(attendanceRecords);
    
    return successResponse({
      res,
      status: 201,
      data: createdAttendances,
      msg: "Attendance records created successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to create attendance records",
    });
  }
};