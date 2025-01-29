const multer = require("multer");
const path = require("path");

// Configure storage (in memory for processing with Sharp)
const storage = multer.memoryStorage();

const upload = multer({
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
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
