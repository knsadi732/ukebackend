const pool = require("../config/postgres");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.create = async (req, res) => {
  try {



    const role = await new Role({ ...req.body }).save();

    return successResponse({
      res,
      status: 201,
      data: role,
      msg: "Record created successfully",
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
exports.getRoles = async (req, res) => {
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
      SELECT id, role_name, role_shorthand
      FROM roles
      ${where}
      ORDER BY id DESC
      `,
      values
    );

    return successResponse({
      res,
      data: dataRes.rows,
    });
  } catch (error) {
    console.log({ error });
    return errorResponse({
      res,
      error,
      status: 500,
      msg: "Server Error",
    });
  }
};


exports.getRolesById = async (req, res) => {
  const {
    status = "",
    searchText = "",
    id = "",
    sortBy = "updatedAt,-1",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = { roleType: "testing" };

  // Add search and status filters if `id` is not provided
  if (!id) {
    if (searchText) {
      query = { ...query, name: { $regex: searchText, $options: "i" } };
    }

    if (status !== "") {
      query = { ...query, status };
    }
  }

  try {
    // Fetch a single document by ID or the first matching record
    const role = id
      ? await Role.findOne({ _id: id, roleType: "testing" }) // Fetch by ID
      : await Role.findOne(query).sort({ [field]: parseInt(value) }); // Fetch first matching record

    if (!role) {
      return errorResponse({
        res,
        status: 404,
        msg: "Role not found",
      });
    }

    return successResponse({
      res,
      data: role,
      msg: "Record found successfully",
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

exports.deleteRoleById = async (req, res) => {
  const { id } = req.body; // Extract `id` from the request body


  if (!id) {
    return errorResponse({
      res,
      status: 400,
      msg: "Role ID is required",
    });
  }

  try {
    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return errorResponse({
        res,
        status: 404,
        msg: "Role not found",
      });
    }

    return successResponse({
      res,
      data: deletedRole,
      msg: "Role deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete role",
    });
  }
};
