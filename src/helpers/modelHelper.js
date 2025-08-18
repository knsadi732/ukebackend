const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

exports.createToken = (user) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is missing in environment variables");
  }

  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
    secretKey, // Ensure it's a valid string
    { expiresIn: "1h" } // Corrected closing bracket
  );
};


exports.createFileURL = (images, folder) => {
  return images.map((image) => {
    return `${process.env.HOST}/${folder}/${image}`;
  });
  // return image ? `${process.env.HOST}/${folder}/${image}` : "";
};
