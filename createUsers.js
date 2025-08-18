const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import the User model
const User = require("./src/models/users");

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(async () => {
    console.log(`Database connected on ${process.env.DB_URI}`);

    // Create two users
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        address: "123 Admin Street, Admin City",
        phone: "9876543210",
        highest_qualification: "MBA",
        specializations: "Management",
        nominee_name: "Admin Nominee",
        bank_name: "State Bank of India",
        identification_mark: "Scar on left cheek",
        aadhar_no: "111111111111",
        nominee_aadhar_no: "222222222222",
        pan_no: "ABCDE1234F", // Valid PAN format (5 uppercase letters, 4 digits, 1 uppercase letter)
        driving_license_no: "DL1234567890123", // Valid driving license format
        ifsc: "SBIN0002499", // Valid IFSC code format (4 uppercase letters, '0', 6 alphanumeric characters)
        bank_account_no: "123456789012",
        blood_group: "O+",
        uan: "123456789012", // Valid UAN format (12 digits)
        esic: "123456789012", // Valid ESIC format (12 digits)
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
        password: "admin123", // This will be encrypted by the model
      },
      {
        name: "Regular User",
        email: "user@example.com",
        address: "456 User Avenue, User City",
        phone: "9876543211",
        highest_qualification: "B.Tech",
        specializations: "Computer Science",
        nominee_name: "User Nominee",
        bank_name: "HDFC Bank",
        identification_mark: "Tattoo on right arm",
        aadhar_no: "333333333333",
        nominee_aadhar_no: "444444444444",
        pan_no: "VWXYZ5678G", // Valid PAN format (5 uppercase letters, 4 digits, 1 uppercase letter)
        driving_license_no: "DL9876543210987", // Valid driving license format
        ifsc: "HDFC0000123", // Valid IFSC code format (4 uppercase letters, '0', 6 alphanumeric characters)
        bank_account_no: "987654321098",
        blood_group: "A+",
        uan: "987654321098", // Valid UAN format (12 digits)
        esic: "987654321098", // Valid ESIC format (12 digits)
        aadhar_front_image: "aadhar_front.jpg",
        aadhar_back_image: "aadhar_back.jpg",
        pan_image: "pan.jpg",
        upload_image: "profile.jpg",
        medical: "medical.pdf",
        eye_test_medical: "eye_test.pdf",
        driving_license_image: "dl.jpg",
        certificate: ["cert1.pdf", "cert2.pdf"],
        role: "User",
        loginType: "created by phone",
        userType: "User",
        password: "user123", // This will be encrypted by the model
      },
    ];

    try {
      // Insert users into the database
      for (const userData of users) {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          console.log(`User with email ${userData.email} already exists`);
          continue;
        }

        // Create new user
        const user = new User(userData);
        await user.save();
        console.log(`User ${userData.email} created successfully`);
      }

      console.log("All users created successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error creating users:", error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });