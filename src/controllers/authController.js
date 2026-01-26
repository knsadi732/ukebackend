// const pool = require("../config/postgres");
// const { successResponse, errorResponse } = require("../helpers/apiHelper");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.login = async (req, res) => {
//   try {
//     let { phone, password } = req.body;

//     // ✅ Basic Validation
//     if (!phone || !password) {
//       return errorResponse({
//         res,
//         status: 400,
//         msg: "Phone and password are required",
//       });
//     }

//     // ✅ phone always store as string (safe)
//     phone = String(phone).trim();

//     if (String(password).trim().length < 4) {
//       return errorResponse({
//         res,
//         status: 400,
//         msg: "Password must be at least 4 characters",
//       });
//     }

//     // ✅ Find user by phone
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return errorResponse({
//         res,
//         status: 404,
//         msg: "User not found",
//       });
//     }

//     if (!user.password) {
//       return errorResponse({
//         res,
//         status: 400,
//         msg: "User password not set. Please reset password.",
//       });
//     }

//     // ✅ Password match
//     let isMatch = false;

//     // ✅ Master Password only for dev/testing
//     if (process.env.NODE_ENV !== "production" && password === "123456") {
//       isMatch = true;
//     } else {
//       isMatch = await bcrypt.compare(password, user.password);
//     }

//     if (!isMatch) {
//       return errorResponse({
//         res,
//         status: 401,
//         msg: "Invalid credentials",
//       });
//     }

//     // ✅ JWT Secret must exist
//     if (!process.env.JWT_SECRET_KEY) {
//       return errorResponse({
//         res,
//         status: 500,
//         msg: "JWT secret key missing in env",
//       });
//     }

//     // ✅ Generate Token (4 hours)
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "4h" }
//     );

//     // ✅ Update lastActive
//     user.lastActive = new Date();
//     await user.save();

//     return successResponse({
//       res,
//       data: {
//         token,
//         id: user._id,
//         name: user.name || "",
//         phone: user.phone,
//         role: user.role || "User",
//         email: user.email || "",
//       },
//       msg: "Login successful",
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return errorResponse({
//       res,
//       status: 500,
//       msg: "Internal Server Error",
//       error,
//     });
//   }
// };


const pool = require("../config/postgres");
const { successResponse, errorResponse } = require("../helpers/apiHelper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    let { phone, password } = req.body;



    // ✅ Validation
    if (!phone || !password) {
      return errorResponse({
        res,
        status: 400,
        msg: "Phone and password are required",
      });
    }

    phone = String(phone).trim();
    password = String(password).trim();

    if (password.length < 3) {
      return errorResponse({
        res,
        status: 400,
        msg: "Password must be at least 4 characters",
      });
    }

    // ✅ Find user in PostgreSQL
    const result = await pool.query(
      `SELECT phone, password
       FROM users
       WHERE phone = $1
       LIMIT 1`,
      [phone]
    );

    const user = result.rows[0];



    if (!user) {
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    if (!user.password) {
      return errorResponse({
        res,
        status: 400,
        msg: "User password not set. Please reset password.",
      });
    }

    // ✅ Password check
    let isMatch = false;

    // Master password for dev only
    if (process.env.NODE_ENV !== "production" && password.length > 3) {

      isMatch = true;
    } else {

      isMatch = await bcrypt.compare(password, user.password);
    }

    console.log({ isMatch });
    if (!isMatch) {
      return errorResponse({
        res,
        status: 401,
        msg: "Invalid credentials",
      });
    }

    console.log("!process.env.JWT_SECRET_KEY", process.env.JWT_SECRET_KEY, !process.env.JWT_SECRET_KEY);

    // ✅ JWT secret check
    if (!process.env.JWT_SECRET_KEY) {

      return errorResponse({
        res,
        status: 500,
        msg: "JWT secret key missing in env",
      });
    }

    console.log("secret key pass")

    // ✅ Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "4h" }
    );
    console.log("token", token);

    // ✅ Update last_active in DB (optional)
    // await pool.query(
    //   `UPDATE users SET last_active = NOW() WHERE id = $1`,
    //   [user.id]
    // );

    return successResponse({
      res,
      msg: "Login successful",
      data: {
        token,
        id: user.id,
        name: user.name || "",
        phone: user.phone,
        role: user.role || "User",
        email: user.email || "",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse({
      res,
      status: 500,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

