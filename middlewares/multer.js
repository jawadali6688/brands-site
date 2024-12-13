import multer from "multer";
import path from "path";

// Define file filter to accept only image and video files
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|webp|png|mp4|mov/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed.'));
  }
};

// Set storage to memory and add file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit to 100MB
  fileFilter,
});

export default upload;
