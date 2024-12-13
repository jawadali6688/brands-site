// models/Wishlist.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User model
  products: [
    { 
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true }  // Reference to the Catalog model
    }
  ]
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);
