import multer from "multer";
import path from "path";

const LIMIT: number = 100 * 1024 * 1024; // 100MB
const notAllowedExtensions = [
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".js",
  ".php",
  ".py",
  ".rb",
  ".jar",
  ".msi",
  ".com",
  ".vbs",
  ".wsf",
]; // Allowed file extensions

// Configure storage (in memory for processing with Sharp)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (notAllowedExtensions.includes(ext)) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname),
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: LIMIT,
  },
});

export default upload;
