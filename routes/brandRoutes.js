import express from "express";
import Brand from "../models/brandModel.js";
import { uploadFiles } from "../middlewares/uploadMiddleware.js";
import upload from "../middlewares/multer.js";
import { submitBrand } from "../controllers/brandController.js";
import Product from "../models/product.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { Image, createCanvas } from "canvas";
import sharp from "sharp";
import XLSX from "xlsx";
import axios from "axios";

// Configuration for file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
const cacheFilePath = path.join(__dirname, "features_cache.json");

// Directory checks
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load or Initialize Features Cache
let featuresCache = {};
if (fs.existsSync(cacheFilePath)) {
  featuresCache = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
} else {
  fs.writeFileSync(cacheFilePath, JSON.stringify({})); // Initialize empty cache
}

// Express Router
const router = express.Router();

// Submit Brand
router.post("/submit", uploadFiles, async (req, res) => {
  try {
    await submitBrand(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search by Image (with Category Filtering)
router.post("/search_by_image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { category } = req.body;  // Category filter parameter

    const tempFilePath = path.join(uploadsDir, req.file.originalname);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Load MobileNet Model
    const model = await loadModel();
    const queryFeatures = await extractFeatures(tempFilePath, model);

    const excelFilePath = path.join(__dirname, "1733160801682-fffff.xlsx");
    const rows = readExcel(excelFilePath);

    // Filter products based on the category provided
    const filteredRows = rows.filter(row => row.Category && row.Category.toLowerCase() === category.toLowerCase());

    const promises = filteredRows.map(async (row) => {
      const imageUrl = row.image;

      let storedFeatures;

      // Check Cache for Features
      if (featuresCache[imageUrl]) {
        storedFeatures = featuresCache[imageUrl];
      } else {
        storedFeatures = await extractFeatures(imageUrl, model);
        featuresCache[imageUrl] = storedFeatures; // Save to cache
      }

      const similarity = cosineSimilarity(queryFeatures, storedFeatures);

      console.log("Similarity for", imageUrl, ":", similarity);  // Debugging similarity score

      if (similarity > 0.8) {  // Increased threshold to 0.8 for better filtering
        return {
          imageUrl,
          title: row.Title,
          color: row.Color,
          size: row.Size,
          price: row.Price,
          description: row.Description,
          category: row.Category,  // Include category in the result
          similarity_score: similarity.toFixed(2),
        };
      }
    });

    const results = await Promise.all(promises);

    // Filter out any null results
    const filteredResults = results.filter(item => item !== undefined);

    // If no matching images found, return an empty array
    if (filteredResults.length === 0) {
      res.json({ relatedImages: [] });
    } else {
      // Save Updated Cache
      fs.writeFileSync(cacheFilePath, JSON.stringify(featuresCache, null, 2));

      // Clean up
      fs.unlinkSync(tempFilePath);

      // Send relevant results
      res.json({ relatedImages: filteredResults });
    }
  } catch (error) {
    console.error("Error in search_by_image route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Helper Functions

async function loadModel() {
  return await mobilenet.load();
}

async function preprocessImage(imagePath) {
  let image;
  if (isValidHttpUrl(imagePath)) {
    const response = await axios({ url: imagePath, responseType: "arraybuffer" });
    image = await loadImage(response.data);
  } else {
    image = await loadImage(fs.readFileSync(imagePath));
  }

  const canvas = createCanvas(224, 224);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, 224, 224);

  const input = tf.browser.fromPixels(canvas);
  return input.expandDims(0).toFloat().div(tf.scalar(255));
}

async function loadImage(imageBuffer) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imageBuffer;
  });
}

async function extractFeatures(imagePath, model) {
  const image = await preprocessImage(imagePath);
  const features = model.infer(image, true);
  return features.flatten().arraySync();
}

function cosineSimilarity(vec1, vec2) {
  const dotProduct = tf.dot(tf.tensor(vec1), tf.tensor(vec2)).arraySync();
  const magnitude1 = tf.norm(tf.tensor(vec1)).arraySync();
  const magnitude2 = tf.norm(tf.tensor(vec2)).arraySync();
  return dotProduct / (magnitude1 * magnitude2);
}

function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

function isValidHttpUrl(url) {
  const pattern = /^(http|https):\/\/[^ "]+$/;
  return pattern.test(url);
}

export default router;
