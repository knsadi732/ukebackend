const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./src/models/users");
const Role = require("./src/models/role");
const Site = require("./src/models/site");
const WorkOrder = require("./src/models/WorkOrder");
const Tool = require("./src/models/Tool");
const Checklist = require("./src/models/Checklist");
const DPR = require("./src/models/DPR");
const Procurement = require("./src/models/Procurement");
const Attendance = require("./src/models/Attendance");
const Payment = require("./src/models/Payment");
const Expense = require("./src/models/Expense");

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(async () => {
    console.log(`Database connected on ${process.env.DB_URI}`);

    try {
      // Test creating a user
      console.log("Testing User creation...");
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        address: "123 Test Street",
        phone: "1234567890",
        highest_qualification: "B.Tech",
        specializations: "Computer Science",
        nominee_name: "Test Nominee",
        bank_name: "Test Bank",
        identification_mark: "Scar",
        aadhar_no: "123456789012",
        nominee_aadhar_no: "987654321098",
        pan_no: "TESTP1234T",
        driving_license_no: "DL1234567890123",
        ifsc: "TEST0000123",
        bank_account_no: "123456789012",
        blood_group: "O+",
        uan: "123456789012",
        esic: "987654321098",
        aadhar_front_image: "aadhar_front.jpg",
        aadhar_back_image: "aadhar_back.jpg",
        pan_image: "pan.jpg",
        upload_image: "profile.jpg",
        medical: "medical.pdf",
        eye_test_medical: "eye_test.pdf",
        driving_license_image: "dl.jpg",
        certificate: ["cert1.pdf", "cert2.pdf"],
        role: "Admin",
        loginType: "created by phone",
        userType: "Admin",
        password: "test123"
      });
      
      await user.save();
      console.log("User created successfully");

      // Test creating a role
      console.log("Testing Role creation...");
      const role = new Role({
        role_name: "Test Role",
        role_shorthand: "TEST_ROLE"
      });
      
      await role.save();
      console.log("Role created successfully");

      // Test creating a site
      console.log("Testing Site creation...");
      const site = new Site({
        name: "Test Site",
        site_shorthand: "TEST_SITE",
        location: "Test Location"
      });
      
      await site.save();
      console.log("Site created successfully");

      // Test creating a work order
      console.log("Testing Work Order creation...");
      const workOrder = new WorkOrder({
        workOrderNumber: "WO-001",
        title: "Test Work Order",
        description: "This is a test work order",
        site: site._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30*24*60*60*1000), // 30 days from now
        budget: 100000,
        createdBy: user._id
      });
      
      await workOrder.save();
      console.log("Work Order created successfully");

      // Test creating a tool
      console.log("Testing Tool creation...");
      const tool = new Tool({
        name: "Test Tool",
        code: "TOOL-001",
        category: "Test Category",
        purchaseDate: new Date(),
        purchaseCost: 5000,
        currentLocation: "Test Site",
        site: site._id,
        createdBy: user._id
      });
      
      await tool.save();
      console.log("Tool created successfully");

      // Test creating a checklist
      console.log("Testing Checklist creation...");
      const checklist = new Checklist({
        title: "Test Checklist",
        workOrder: workOrder._id,
        site: site._id,
        items: [
          {
            item: "Check item 1"
          },
          {
            item: "Check item 2"
          }
        ],
        createdBy: user._id
      });
      
      await checklist.save();
      console.log("Checklist created successfully");

      // Test creating a DPR
      console.log("Testing DPR creation...");
      const dpr = new DPR({
        date: new Date(),
        workOrder: workOrder._id,
        site: site._id,
        workDescription: "Test work description",
        workProgress: 50,
        materialsUsed: [
          {
            materialName: "Test Material",
            quantity: 10,
            unit: "units"
          }
        ],
        createdBy: user._id
      });
      
      await dpr.save();
      console.log("DPR created successfully");

      // Test creating a procurement
      console.log("Testing Procurement creation...");
      const procurement = new Procurement({
        procurementNumber: "PO-001",
        title: "Test Procurement",
        description: "This is a test procurement",
        workOrder: workOrder._id,
        site: site._id,
        items: [
          {
            itemName: "Test Item",
            quantity: 5,
            unit: "units",
            rate: 1000,
            total: 5000
          }
        ],
        totalAmount: 5000,
        requiredByDate: new Date(Date.now() + 15*24*60*60*1000), // 15 days from now
        createdBy: user._id
      });
      
      await procurement.save();
      console.log("Procurement created successfully");

      // Test creating an attendance record
      console.log("Testing Attendance creation...");
      const attendance = new Attendance({
        date: new Date(),
        user: user._id,
        site: site._id,
        workOrder: workOrder._id,
        status: "present",
        inTime: new Date(),
        createdBy: user._id
      });
      
      await attendance.save();
      console.log("Attendance created successfully");

      // Test creating a payment
      console.log("Testing Payment creation...");
      const payment = new Payment({
        paymentNumber: "PAY-001",
        title: "Test Payment",
        description: "This is a test payment",
        workOrder: workOrder._id,
        site: site._id,
        user: user._id,
        amount: 50000,
        paymentType: "salary",
        paymentDate: new Date(),
        createdBy: user._id
      });
      
      await payment.save();
      console.log("Payment created successfully");

      // Test creating an expense
      console.log("Testing Expense creation...");
      const expense = new Expense({
        expenseNumber: "EXP-001",
        title: "Test Expense",
        description: "This is a test expense",
        workOrder: workOrder._id,
        site: site._id,
        category: "Test Category",
        amount: 5000,
        expenseDate: new Date(),
        createdBy: user._id
      });
      
      await expense.save();
      console.log("Expense created successfully");

      console.log("All tests completed successfully!");
      process.exit(0);
    } catch (error) {
      console.error("Error during testing:", error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });