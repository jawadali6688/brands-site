import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    productId: { type: String, required: false, unique: false },
    productName: { type: String, required: false },
    productDescription: { type: String, required: false },
    price: { type: String, required: false },
    availability: { type: Boolean, required: false, default: false },
    color: { type: String, required: false },
    imagePath: { type: String, required: false },
    category: { type: String, required: false },
    size: { type: String, required: false },
    brand: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false },
    contactNumber: { type: String, required: false },
    status: {
      type: String,
      enum: ["published", "approved", "rejected", "other"],
      default: "published",
      required: true
  }
  },
  {
    timestamps: false, // Adds createdAt and updatedAt timestamps
  }
);

export default mongoose.model("Catalog", catalogSchema);
