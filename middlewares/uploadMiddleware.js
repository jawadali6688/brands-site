import multer from "multer";
import path from "path";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the directory name of the current module (equivalent of __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use path.resolve to create an absolute path to the uploads directory
    const uploadPath = path.resolve(__dirname, "../uploads");

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Pass the directory to Multer
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Ensure filename is unique
  },
});

const upload = multer({ storage: storage });

// Export the upload functions
export const uploadFile = upload.single("image");

export const uploadFiles = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "brandImage", maxCount: 1 },
  { name: "brandAuth", maxCount: 1 },
]);

// Cloudinary upload function
export const uploadToCloudinary = async (filePath, folderName = "uploads") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// Local file deletion function
export const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting local file:", err);
    } else {
      console.log("Local file deleted:", filePath);
    }
  });
};
