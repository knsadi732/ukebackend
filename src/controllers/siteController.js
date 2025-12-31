const Site = require("../models/site");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.create = async (req, res) => {
  try {
    const site = await new Site({ ...req.body }).save();
    return successResponse({
      res,
      status: 201,
      data: site,
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
exports.getSites = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = "",
    searchText = "",
    sortBy = "updatedAt,-1",
    siteType = "",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (siteType !== "") query = { ...query, siteType };

  if (searchText)
    query = { ...query, name: { $regex: searchText, $options: "i" } };

  if (status !== "") query = { ...query, status };

  try {
    let sites = await Site.paginate(query, {
      page,
      limit,
      lean: true,
      sort: { [field]: parseInt(value) },
    });

    return successResponse({
      res,
      data: sites,
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

exports.getSiteById = async (req, res) => {
  const {
    status = "",
    searchText = "",
    id = "", // Extract `id` from query parameters
    sortBy = "updatedAt,-1",
    siteType = "",
  } = req.query;

  const [field, value] = sortBy.split(",");

  let query = {};

  if (siteType !== "") query = { ...query, siteType };

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
    const site = id
      ? await Site.findOne({ _id: id, ...(siteType && { siteType }), lean: true }) // Fetch by ID, optionally filtering by siteType
      : await Site.findOne(query)
          .sort({ [field]: parseInt(value) })
          .lean();

    if (!site) {
      return errorResponse({
        res,
        status: 404,
        msg: "Site not found",
      });
    }

    return successResponse({
      res,
      data: site,
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
exports.UpdateSiteById = async (req, res) => {
  const { id } = req.params; // Extract `id` from URL parameters
  const updates = req.body; // Extract updates from request body

  try {
    console.log({ id });
    if (!id) {
      return errorResponse({
        res,
        status: 400,
        msg: "ID is required",
      });
    }

    // Find and update the user
    const updatedSite = await Site.findByIdAndUpdate(
      id, // Use the `id` to find the user
      { $set: updates }, // Apply updates
      { new: true, lean: true } // Return the updated document
    );

    if (!updatedSite) {
      // Log additional information for debugging
      console.error(`Site with ID ${id} not found.`);
      return errorResponse({
        res,
        status: 404,
        msg: "Site not found",
      });
    }

    return successResponse({
      res,
      data: updatedSite,
      msg: "Site updated successfully",
    });
  } catch (error) {
    // Handle and log any error
    console.error("Error updating site:", error);
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to update site",
    });
  }
};

exports.deleteSiteById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return errorResponse({
      res,
      status: 400,
      msg: "Site ID is required",
    });
  }

  try {
    const deletedSite = await Site.findByIdAndDelete(id);

    if (!deletedSite) {
      return errorResponse({
        res,
        status: 404,
        msg: "Site not found",
      });
    }

    return successResponse({
      res,
    //   data: deletedSite,
      msg: "Site deleted successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      error,
      status: 400,
      msg: "Failed to delete site",
    });
  }
};
