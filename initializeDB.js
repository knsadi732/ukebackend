const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const Role = require("./src/models/role");
const User = require("./src/models/users");
const Site = require("./src/models/site");
const Permission = require("./src/models/Permission");

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(async () => {
    console.log(`Database connected on ${process.env.DB_URI}`);

    try {
      // Create default roles
      const roles = [
        { role_name: "Site I/c (Project Manager)", role_shorthand: "SITE_IC" },
        { role_name: "Department Technical I/c", role_shorthand: "DEPT_IC" },
        { role_name: "Shift I/c / Supervisor", role_shorthand: "SHIFT_IC" },
        { role_name: "Store I/c", role_shorthand: "STORE_IC" },
        { role_name: "Store Admin", role_shorthand: "STORE_ADMIN" },
        { role_name: "Store Keeper", role_shorthand: "STORE_KEEPER" },
        { role_name: "Admin", role_shorthand: "ADMIN" },
        { role_name: "Account", role_shorthand: "ACCOUNT" },
        { role_name: "HR", role_shorthand: "HR" }
      ];

      const createdRoles = [];
      for (const roleData of roles) {
        const existingRole = await Role.findOne({ role_shorthand: roleData.role_shorthand });
        if (existingRole) {
          console.log(`Role ${roleData.role_name} already exists`);
          createdRoles.push(existingRole);
        } else {
          const role = new Role(roleData);
          await role.save();
          console.log(`Role ${roleData.role_name} created successfully`);
          createdRoles.push(role);
        }
      }

      // Create default sites
      const sites = [
        { name: "Site A", site_shorthand: "SITE_A", location: "Location A", status: "active" },
        { name: "Site B", site_shorthand: "SITE_B", location: "Location B", status: "active" },
        { name: "Site C", site_shorthand: "SITE_C", location: "Location C", status: "active" }
      ];

      for (const siteData of sites) {
        const existingSite = await Site.findOne({ site_shorthand: siteData.site_shorthand });
        if (existingSite) {
          console.log(`Site ${siteData.name} already exists`);
        } else {
          const site = new Site(siteData);
          await site.save();
          console.log(`Site ${siteData.name} created successfully`);
        }
      }

      // Create default permissions for each role
      const modules = [
        "user", "site", "workOrder", "role", "tool", 
        "checklist", "dpr", "procurement", "attendance", 
        "payment", "expense"
      ];

      // Define role-specific permissions
      const rolePermissions = {
        "SITE_IC": {
          user: { read: true },
          site: { read: true },
          workOrder: { create: true, read: true, update: true },
          tool: { read: true },
          checklist: { create: true, read: true, update: true },
          dpr: { create: true, read: true, update: true },
          procurement: { create: true, read: true, update: true },
          attendance: { read: true },
          payment: { read: true },
          expense: { read: true }
        },
        "DEPT_IC": {
          user: { read: true },
          site: { read: true },
          workOrder: { read: true },
          tool: { read: true },
          checklist: { create: true, read: true, update: true },
          dpr: { create: true, read: true, update: true },
          procurement: { create: true, read: true, update: true },
          attendance: { read: true }
        },
        "SHIFT_IC": {
          user: { read: true },
          checklist: { create: true, read: true, update: true },
          attendance: { create: true, read: true, update: true },
          dpr: { create: true, read: true, update: true }
        },
        "STORE_IC": {
          user: { read: true },
          tool: { create: true, read: true, update: true },
          procurement: { read: true }
        },
        "STORE_ADMIN": {
          tool: { create: true, read: true, update: true, delete: true },
          procurement: { create: true, read: true, update: true, delete: true }
        },
        "STORE_KEEPER": {
          tool: { read: true },
          procurement: { read: true }
        },
        "ADMIN": {
          user: { create: true, read: true, update: true, delete: true },
          site: { create: true, read: true, update: true, delete: true },
          workOrder: { create: true, read: true, update: true, delete: true },
          role: { create: true, read: true, update: true, delete: true },
          tool: { create: true, read: true, update: true, delete: true },
          checklist: { create: true, read: true, update: true, delete: true },
          dpr: { create: true, read: true, update: true, delete: true },
          procurement: { create: true, read: true, update: true, delete: true },
          attendance: { create: true, read: true, update: true, delete: true },
          payment: { create: true, read: true, update: true, delete: true },
          expense: { create: true, read: true, update: true, delete: true }
        },
        "ACCOUNT": {
          payment: { create: true, read: true, update: true, delete: true },
          expense: { create: true, read: true, update: true, delete: true }
        },
        "HR": {
          user: { create: true, read: true, update: true, delete: true },
          attendance: { create: true, read: true, update: true, delete: true },
          payment: { read: true }
        }
      };

      // Create permissions for each role
      for (const role of createdRoles) {
        const permissions = rolePermissions[role.role_shorthand] || {};
        
        // For admin role, give all permissions to all modules
        if (role.role_shorthand === "ADMIN") {
          for (const module of modules) {
            const permissionData = {
              role: role._id,
              module: module,
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true
              },
              createdBy: null // Will be set when a user is created
            };
            
            // Check if permission already exists
            const existingPermission = await Permission.findOne({
              role: role._id,
              module: module
            });
            
            if (!existingPermission) {
              const permission = new Permission(permissionData);
              await permission.save();
              console.log(`Permission for ${role.role_name} - ${module} created successfully`);
            }
          }
        } else {
          // For other roles, set specific permissions
          for (const [module, modulePermissions] of Object.entries(permissions)) {
            const permissionData = {
              role: role._id,
              module: module,
              permissions: modulePermissions,
              createdBy: null // Will be set when a user is created
            };
            
            // Check if permission already exists
            const existingPermission = await Permission.findOne({
              role: role._id,
              module: module
            });
            
            if (!existingPermission) {
              const permission = new Permission(permissionData);
              await permission.save();
              console.log(`Permission for ${role.role_name} - ${module} created successfully`);
            }
          }
        }
      }

      console.log("Database initialization completed successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error initializing database:", error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });