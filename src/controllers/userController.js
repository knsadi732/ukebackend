const pool = require("../config/postgres");
const { successResponse, errorResponse } = require("../helpers/apiHelper");
const { single, multiple } = require("../helpers/fileUpload");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const { searchText = "" } = { ...req.query, ...req.body };

    let where = "WHERE 1=1";
    let values = [];

    if (searchText) {
      values.push(`%${searchText}%`);
      where += ` AND name ILIKE $${values.length}`;
    }

    const dataRes = await pool.query(
      `
  SELECT 
    u.id, u.name, u.email, u.phone, u.gender, u.nominee_name, u.address,
    u.site_id, u.workorder_id, u.role_id, u.created_at,

    s.site_name,
    w.work_order_number AS workorder_name,
    r.role_name,

    k.aadhar_no,
    k.pan_no

  FROM users u

  LEFT JOIN sites s ON s.id = u.site_id
  LEFT JOIN work_orders w ON w.id = u.workorder_id

  LEFT JOIN roles r ON r.id = u.role_id::int

  LEFT JOIN kyc k ON k.user_id = u.id

  ${where}
  ORDER BY u.id DESC
  `,
      values
    );






    const userData = dataRes.rows.map((row) => {
      return {
        id: row.id ? row.id : "",
        name: row.name ? row.name : "",
        email: row.email ? row.email : "",
        phone: row.phone ? row.phone : "",
        gender: row.gender ? row.gender : "",
        nominee_name: row.nominee_name ? row.nominee_name : "",
        address: row.address ? row.address : "",
        site: row.site_name ? row.site_name : "",
        workorder: row.workorder_name ? row.workorder_name : "",
        role: row.role_name ? row.role_name : "",
        workorder_id: row.workorder_id ? row.workorder_id : "",
        site_id: row.site_id ? row.site_id : "",
        role_id: row.role_id ? row.role_id : "",
        kyc: {
          aadhar_no: row.aadhar_no || "",
          pan_no: row.pan_no || "",
          kyc_status: row.kyc_status || "",
        },
      }
    })


    return successResponse({
      res,
      data: userData,
      // msg: "Users fetched successfully ✅",
    });
  } catch (error) {
    console.log({ error })
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Server Error",
    });
  }
};

exports.create = async (req, res) => {
  try {
    // 1. Handle file uploads (this modifies req.body)
    const uploadKeys = [
      "aadhar_front_image", "aadhar_back_image", "pan_image", "certificate",
      "upload_image", "medical", "eye_test_medical", "driving_license",
    ];
    uploadKeys.forEach((key) => {
      if (key === "certificate") {
        multiple(req, key, "users");
      } else {
        single(req, key, "users");
      }
    });

    // 2. Hash password if it exists
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // 3. Build dynamic INSERT query
    const columns = Object.keys(req.body);
    const values = Object.values(req.body);
    const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(", ");

    if (columns.length === 0) {
      return errorResponse({ res, status: 400, msg: "No data provided." });
    }

    const queryText = `
      INSERT INTO users (${columns.join(", ")})
      VALUES (${valuePlaceholders})
      RETURNING *;
    `;

    const { rows } = await pool.query(queryText, values);

    return successResponse({
      res,
      status: 201,
      data: rows[0],
      msg: "User created successfully",
    });
  } catch (error) {
    console.error("Error in create user:", error);
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Failed to create user",
    });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log({ id })
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    console.log({ rows });
    const user = rows[0];

    if (!user) {
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    return successResponse({
      res,
      data: user,
      msg: "User found successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Server Error",
    });
  }
};

exports.UpdateUserById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updateFields = [];
    const values = [];
    let valueCounter = 1;

    // Create "key = $1" pairs for the SET clause
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        updateFields.push(`${key} = $${valueCounter++}`);
        values.push(updates[key]);
      }
    }

    if (updateFields.length === 0) {
      return successResponse({ res, msg: "No fields to update." });
    }

    values.push(id); // Add the id for the WHERE clause

    const queryText = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $${valueCounter}
      RETURNING *;
    `;

    const { rows } = await pool.query(queryText, values);
    const updatedUser = rows[0];

    if (!updatedUser) {
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    return successResponse({
      res,
      data: updatedUser,
      msg: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Failed to update user",
    });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params; // Using req.params is more RESTful for DELETE

  try {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    const deletedUser = rows[0];

    if (!deletedUser) {
      return errorResponse({
        res,
        status: 404,
        msg: "User not found",
      });
    }

    return successResponse({
      res,
      data: deletedUser,
      msg: "User deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Failed to delete user",
    });
  }
};
