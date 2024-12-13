import express from "express";
import { getAllProducts, getProductById } from '../controllers/catalogController.js';
 // Correct path to your controllers
const router = express.Router();


// Route to get all products
router.get('/', getAllProducts);

// Route to get product details by ID
router.get('/:id', getProductById);

export default router;
