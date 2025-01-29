const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

exports.createToken = (phone) => {
  console.log("process.env.JWT_SECRET_KEY",process.env.JWT_SECRET_KEY);
  return jwt.sign({ phone }, process.env.JWT_SECRET_KEY, {
    expiresIn: "8h",
  });
};

exports.createFileURL = (images, folder) => {
  return images.map((image) => {
    return `${process.env.HOST}/${folder}/${image}`;
  });
  // return image ? `${process.env.HOST}/${folder}/${image}` : "";
};
