import multer from "multer";
import path from "path";

const LIMIT: number = 5 * 1024 * 1024; // 5MB
const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".webp",
  ".png",
  ".gif",
  ".pdf",
  ".docx",
  ".doc",
  ".txt",
  ".mp4",
  ".mp3",
  ".wav",
]; // Allowed file extensions

// Configure storage (in memory for processing with Sharp)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname)
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: LIMIT,
  },
});

export default upload;
