import { Router } from "express";
import upload from "../middlewares/multer.js";
import { editRent, publishRent } from "../controllers/rent.controller.js";
import { uploadFile } from "../middlewares/uploadMiddleware.js";
import Catalog from "../models/catalog.js";
const router = Router()


router.route("/publish").post(uploadFile, publishRent)

router.route("/edit/:productId").post(uploadFile, editRent)

router.post("/approve", async (req, res) => {
    try {
      const { id, status, reason } = req.body;
  
      const updatedBrand = await Catalog.findByIdAndUpdate(
        id,
        { status, reason: reason || "" },
        { new: true }
      );
  
      res.json(updatedBrand);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  router.post("/disapprove", async (req, res) => {
    try {
      const { id, status, reason } = req.body;
  
      const updatedBrand = await Catalog.findByIdAndUpdate(
        id,
        { status, reason: reason || "" },
        { new: true }
      );
  
      res.json(updatedBrand);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


router.delete("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
    
        // Find the product by ID
        const existingProduct = await Catalog.findById(productId);
        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        // Delete the product from the database
        await Catalog.findByIdAndDelete(productId);
    
        res.status(200).json({ message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
      }
})


export default router