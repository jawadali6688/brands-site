// routes/cartRoutes.js
import express from 'express';
import { addToCart, removeFromCart } from '../controllers/cartController.js'; // Import the controllers

const router = express.Router();

// Route to add a product to the cart
router.post('/add', addToCart);

// Route to remove a product from the cart
router.post('/remove', removeFromCart);

export default router;
