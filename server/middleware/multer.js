const multer = require("multer");
const path = require("path");

exports.uploadSingle = (folderName) => {
  try {
    return (imageUpload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `public/${folderName}`);
        },
        filename: function (req, file, cb) {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }));
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
