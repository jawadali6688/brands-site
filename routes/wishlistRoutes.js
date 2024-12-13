import express from 'express';
import { addToWishlist, getUserFavourites, removeAllFromWishlist, removeFromWishlist } from '../controllers/wishlistController.js'; 

const router = express.Router();

// Route to add a product to the wishlist
router.post('/add', addToWishlist);

// Route to remove a product from the wishlist
router.post('/remove', removeFromWishlist); 

// Remove all
router.post('/remove_all', removeAllFromWishlist);

// get wishlist
router.post('/:userId', getUserFavourites); 


export default router;
