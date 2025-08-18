const bcrypt = require("bcryptjs");

const User = require("../models/users");
const { createToken } = require("../helpers/modelHelper");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.login = async (req, res) => {
  const { phone, password } = req.body;



  try {
    const user = await User.findOne({ phone });
    const newuser = await User.findOne({ phone }).select(
      "_id name phone email role "
    );

    if (!user) {
      return errorResponse({
        res,
        status: 400,
        msg: "Invalid Phone",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse({
        res,
        status: 400,
        msg: "Invalid Password",
      });
    }
    const token = createToken( user );
    newuser.token = token;

    console.log({ newuser, token });

    return successResponse({
      res,
      // data: { ...newuser.toObject(), accessToken: token },
      // data: { user, accessToken: token },
      data: { ...newuser._doc, accessToken: token },
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
