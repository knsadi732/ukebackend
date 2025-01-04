const fs = require("fs");

exports.single = (req, key = "", folder = "") => {
  let fileName = "";
  try {
    if (req.files && req.files[key]) {
      const file = req.files[key];

      fileName = `${randomString(32)}.${file.name.split(".").pop()}`;
      file.mv(`.${process.env.UPLOAD_PATH}${folder}/${fileName}`);

      req.body[key] = fileName;

      return;
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
};

exports.multiple = (req, key = "", folder = "") => {
  let fileNames = [];

  try {
    if (req.files && req.files[key].length > 0) {
      const files = req.files[key];

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const fileName = `${randomString(32)}.${file.name.split(".").pop()}`;
        file.mv(`.${process.env.UPLOAD_PATH}${folder}/${fileName}`);
        fileNames.push(fileName);
      }

      req.body[key] = fileNames;
      return;
    } else {
      this.single(req, key, folder);
      return;
    }
  } catch (err) {
    throw err;
  }
};

function randomString(
  length,
  chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) {
  let result = "";

  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result.toLowerCase();
}

exports.removeFiles = (data = [], folder = "") => {
  data.forEach((item) => {
    fs.unlink(`.${process.env.UPLOAD_PATH}${folder}/${item}`, (err) => {
      if (err) throw err;
    });
  });
};
