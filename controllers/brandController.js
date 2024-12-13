import fs from "fs";
import Brand from "../models/brandModel.js";
import {
  uploadToCloudinary,
  deleteLocalFile,
} from "../middlewares/uploadMiddleware.js";
export const submitBrand = async (req, res) => {
  try {
    const { brandName, brandCategory, categories } = req.body;
    const files = req.files;

    // Check if required fields are present
    if (
      !brandName ||
      !brandCategory ||
      !files["brandImage"] ||
      !files["brandAuth"]
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for duplicate brand name
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      return res.status(409).json({ message: "Brand name already exists." });
    }

    // Paths to the uploaded files
    const brandImagePath = files["brandImage"][0].path;
    const brandAuthPath = files["brandAuth"][0].path;

    // Upload to Cloudinary
    const brandImageUrl = await uploadToCloudinary(
      brandImagePath,
      "brand_images"
    );
    const brandAuthUrl = await uploadToCloudinary(brandAuthPath, "brand_auth");

    // Delete local files after uploading to Cloudinary
    deleteLocalFile(brandImagePath);
    deleteLocalFile(brandAuthPath);

    // Save brand data to MongoDB
    const newBrand = new Brand({
      brandName,
      brandCategory,
      brandImage: brandImageUrl,
      brandAuth: brandAuthUrl,
      categories: JSON.parse(categories),
    });

    await newBrand.save(); // Save brand information to the database

    // Send success response
    res.json({
      message: "Brand information submitted successfully!",
      data: newBrand,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
