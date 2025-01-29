const bcrypt = require("bcryptjs");

const User = require("../models/users");
const { createToken } = require("../helpers/modelHelper");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  // console.log({phone, password})

  try {
    const user = await User.findOne({ phone });
    console.log({ user });

    if (!user) {
      return errorResponse({
        res,
        status: 400,
        msg: "Invalid Phone",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log({isMatch})
    if (!isMatch) {
      return errorResponse({
        res,
        status: 400,
        msg: "Invalid Password",
      });
    }
console.log({ id: user._id });
    user.token = createToken({ id: user._id });

    console.log("Generated Token:", user.token);
    return successResponse({
      res,
      data: user,
      msg: "login successful",
    });
    
  } catch (error) {
    return {
      res,
      error,
      status: 400,
      msg: "invalid id",
    };
  }
};
