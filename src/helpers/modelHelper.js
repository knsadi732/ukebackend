const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

exports.createToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
};

exports.createFileURL = (images, folder) => {
  return images.map((image) => {
    return `${process.env.HOST}/${folder}/${image}`;
  });
  // return image ? `${process.env.HOST}/${folder}/${image}` : "";
};
