import mongoose from "mongoose";
const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true }, // Name of the brand
    brandCategory: { type: String, required: true }, // Category of the brand (e.g., Fashion, Electronics)
    brandImage: { type: String, required: true }, // Cloudinary URL for brand image/logo
    brandAuth: { type: String, required: true }, // Cloudinary URL for authentication document
    categories: {
      type: [
        {
          pant: { type: Boolean, default: false },
          shirt: { type: Boolean, default: false },
          stitch: { type: Boolean, default: false },
          unstitch: { type: Boolean, default: false },
        },
      ],
      default: [],
    }, // Array of objects representing categories

    status: {
      type: String,
      enum: ["Pending", "Approved", "Disapproved"], // Only valid statuses are allowed
      default: "Pending", // Default status when a brand is created
    },
    reason: { type: String, default: "" }, // Reason for disapproval, if applicable
    createdAt: { type: Date, default: Date.now }, // Automatically records the date when the brand was created
  },
  { timestamps: true }
); // Automatically adds `createdAt` and `updatedAt` fields

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
