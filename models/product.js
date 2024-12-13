import mongoose from "mongoose";

// Define the Product schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String },
  size: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }, // Reference to Brand model
  createdAt: { type: Date, default: Date.now },
  whishListBy: {
    type: Array
  }
});

// Create the Product model
const Product = mongoose.model("Product", productSchema);

// Export the Product model as default
export default Product;
