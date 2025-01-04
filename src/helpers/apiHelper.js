exports.successResponse = ({ res, msg, status = 200, data = {} }) => {
  return res.status(status).json({
    success: true,
    message: msg,
    status,
    data,
  });
};

exports.errorResponse = ({
  res,
  msg = "SOMETHING_WENT_WRONG",
  status = 500,
  error = null,
}) => {
  return res.status(status).json({
    success: false,
    message: msg,
    status,
    data: error?.message || msg,
  });
};