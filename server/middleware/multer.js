const multer = require("multer");
const path = require("path");

// Configure storage (in memory for processing with Sharp)
const storage = multer.memoryStorage();

const uploadSingle = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

module.exports = uploadSingle;
