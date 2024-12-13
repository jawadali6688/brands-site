// models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the User model
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog', required: true },  // Reference to the Catalog model
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
