const { validationResult } = require("");

const { errorResponse } = require("../helpers/apiHelper");

exports.validateError = (req, res, next) => {
  console.log({ req }, "middle were", req.body);
  const { errors } = validationResult(req);

  if (errors && errors.length > 0)
    return errorResponse({
      res,
      error: errors,
      msg: errors[0].msg,
      status: 400,
    });

  return next();
};
