import express from "express";
import {
  addProduct,
  getProducts,
  bulkUploadProducts,
  getProductsByBrand,
  updateProduct,
  deleteProduct,
  getShirts,
  getPents,
  getStiched,
  getFootwear,
  getProductsById,
  addToMixAndMatch,
  getUnstiched // Import the getShirts controller
} from "../controllers/productController.js";
import { uploadFiles, uploadFile } from "../middlewares/uploadMiddleware.js";
import Product from "../models/product.js";

const router = express.Router();

// Route to add a new product
router.post("/", uploadFiles, addProduct);

// Route to get all products with optional filters
router.get("/", getProducts);

// Route to get all shirts across all brands
router.get("/shirts", getShirts); // New route for fetching shirts
router.get("/pents", getPents); // New route for fetching shirts
router.get("/stiched", getStiched); // New route for fetching shirts
router.get("/unstiched", getUnstiched); // New route for fetching Unstitched products
router.get("/footwear", getFootwear);  // New route for fetching Footwear products
router.post("/mixandmatch", addToMixAndMatch);


// Route to get products by brand
router.get("/:brandId/products", getProductsByBrand);
router.get('/:id', getProductsById);

// Route to update a product by ID
router.put("/:productId", uploadFiles, updateProduct);

// Route to delete a product by ID
router.delete("/:productId", deleteProduct);

// Route for bulk upload of products
router.post("/upload", uploadFile, async (req, res, next) => {
  try {
    if (req.file) {
      console.log("Received file:", req.file.originalname);
    } else {
      return res.status(400).json({ message: "No file uploaded." });
    }

    await bulkUploadProducts(req, res);
  } catch (error) {
    console.error("Error handling bulk upload:", error);
    next(error);
  }
});


const fetchProductByURL = async (req, resp) => {
  const { url } = req.body
  try {
    const data = await Product.findOne({image: url})
    if (!data) {
      return resp.json({
        message: "There is no data"
      })
    }
    return resp.json({
      message: "Data fetched",
      data: data
    })
  } catch (error) {
    console.log(error)
    return resp.json({
      message: "There is an error",
      error: error
    })
  }
}


router.post("/fetch_by_url", fetchProductByURL)



export const productRoutes = router;
