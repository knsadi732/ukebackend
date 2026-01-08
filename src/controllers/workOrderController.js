const WorkOrder = require("../models/workOrder");
const Site = require("../models/site");
const { successResponse, errorResponse } = require("../helpers/apiHelper");

exports.createWorkOrder = async (req, res) => {
    try {
        console.log("Create WorkOrder Payload:", req.body); // Debugging log

        // Handle case where data is wrapped in 'formData' or sent as 'title'
        let payload = req.body.formData || req.body;

        const { siteId, name, title, ...rest } = payload;

        const workOrderName = name || title;

        if (!siteId) {
            return errorResponse({
                res,
                status: 400,
                msg: "Site ID is required",
            });
        }

        if (!workOrderName) {
            return errorResponse({
                res,
                status: 400,
                msg: "WorkOrder Name (or Title) is required",
            });
        }

        const workOrder = await new WorkOrder({ siteId, name: workOrderName, ...rest }).save();
        return successResponse({
            res,
            status: 201,
            data: workOrder,
            msg: "WorkOrder created successfully",
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

exports.seedWorkOrders = async (req, res) => {
    try {
        const sites = await Site.find({}, "_id");

        if (!sites.length) {
            return errorResponse({
                res,
                status: 404,
                msg: "No sites found",
            });
        }

        let totalCreated = 0;

        for (const site of sites) {
            const count = Math.floor(Math.random() * (7 - 4 + 1)) + 4; // Random 4 to 7

            for (let i = 0; i < count; i++) {
                await WorkOrder.create({
                    siteId: site._id,
                    name: `Work Order ${i + 1} - Auto`,
                    description: `Auto-generated work order for site ${site._id}`,
                    status: "pending",
                    priority: "medium",
                });
                totalCreated++;
            }
        }

        return successResponse({
            res,
            msg: `Successfully created ${totalCreated} work orders across ${sites.length} sites.`,
        });
    } catch (error) {
        return errorResponse({ res, error, status: 500, msg: "Seeding failed" });
    }
};

exports.getWorkOrdersBySiteId = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status = "",
        searchText = "",
        sortBy = "updatedAt,-1",
        siteId,
    } = { ...req.query, ...req.body };

    if (!siteId) {
        return errorResponse({
            res,
            status: 400,
            msg: `Site ID is required ${siteId}`,
        });
    }

    const [field, value] = sortBy.split(",");

    let query = { siteId };

    if (searchText)
        query = { ...query, name: { $regex: searchText, $options: "i" } };

    if (status !== "") query = { ...query, status };

    try {
        let workOrders = await WorkOrder.paginate(query, {
            page,
            limit,
            lean: true,
            sort: { [field]: parseInt(value) },
            populate: { path: "siteId", select: "name" },
        });

        if (workOrders.docs.length > 0) {
            workOrders.docs = workOrders.docs.map((doc) => {
                console.log({ doc }, doc.name);
                return ({
                    id: doc._id,
                    title: doc.name,
                    workOrderNumber: doc.workOrderNumber,
                    siteId: doc.siteId?._id,
                    siteName: doc.siteId?.name,
                    description: doc.description,
                    status: doc.status,
                    due_date: doc.dueDate,
                    priority: doc.priority,
                })
            });
        }

        return successResponse({
            res,
            data: workOrders,
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

exports.getWorkOrders = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status = "",
        searchText = "",
        sortBy = "updatedAt,-1",
    } = { ...req.query, ...req.body };

    const [field, value] = sortBy.split(",");

    let query = {};

    if (searchText)
        query = { ...query, name: { $regex: searchText, $options: "i" } };

    if (status !== "") query = { ...query, status };

    try {
        let workOrders = await WorkOrder.paginate(query, {
            page,
            limit,
            lean: true,
            sort: { [field]: parseInt(value) },
            populate: { path: "siteId", select: "name" },
        });

        if (workOrders.docs.length > 0) {
            workOrders.docs = workOrders.docs.map((doc) => ({
                id: doc._id,
                title: doc.name,
                workOrderNumber: doc.workOrderNumber,
                siteId: doc.siteId?._id,
                siteName: doc.siteId?.name,
                description: doc.description,
                status: doc.status,
                due_date: doc.dueDate,
                priority: doc.priority,
            }));
        }

        return successResponse({
            res,
            data: workOrders,
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

exports.getWorkOrderById = async (req, res) => {
    const { id } = { ...req.query, ...req.body };

    if (!id) {
        return errorResponse({
            res,
            status: 400,
            msg: "WorkOrder ID is required",
        });
    }

    try {
        const workOrder = await WorkOrder.findById(id).populate("siteId", "site_name").lean();

        if (!workOrder) {
            return errorResponse({
                res,
                status: 404,
                msg: "WorkOrder not found",
            });
        }

        const data = {
            id: workOrder._id,
            title: workOrder.name,
            workOrderNumber: workOrder.workOrderNumber,
            siteId: workOrder.siteId?._id,
            siteName: workOrder.siteId?.site_name,
            description: workOrder.description,
            status: workOrder.status,
            due_date: workOrder.dueDate,
            priority: workOrder.priority,
        };

        return successResponse({
            res,
            data: data,
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

exports.updateWorkOrderById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
        return errorResponse({
            res,
            status: 400,
            msg: "ID is required",
        });
    }

    try {
        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, lean: true }
        );

        if (!updatedWorkOrder) {
            return errorResponse({
                res,
                status: 404,
                msg: "WorkOrder not found",
            });
        }

        return successResponse({
            res,
            data: updatedWorkOrder,
            msg: "WorkOrder updated successfully",
        });
    } catch (error) {
        return errorResponse({
            res,
            error,
            status: 400,
            msg: "Failed to update workOrder",
        });
    }
};

exports.deleteWorkOrderById = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return errorResponse({
            res,
            status: 400,
            msg: "WorkOrder ID is required",
        });
    }

    try {
        const deletedWorkOrder = await WorkOrder.findByIdAndDelete(id);

        if (!deletedWorkOrder) {
            return errorResponse({
                res,
                status: 404,
                msg: "WorkOrder not found",
            });
        }

        return successResponse({
            res,
            msg: "WorkOrder deleted successfully",
        });
    } catch (error) {
        return errorResponse({
            res,
            error,
            status: 400,
            msg: "Failed to delete workOrder",
        });
    }
};