import mongoose from "mongoose"; // Add this line
import Product from "../models/product.js";
import {
  uploadToCloudinary,
  deleteLocalFile,
} from "../middlewares/uploadMiddleware.js";
import xlsx from "xlsx";
import fs from "fs";
import Brand from "../models/brandModel.js";
// import MixAndMatch from "../models/mixAndMatchModel.js";  // Import the MixAndMatch model

export const addToMixAndMatch = async (req, res) => {
  try {
    const { productId, userId } = req.body;  // Get the productId and userId from the request body

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the Mix and Match collection for this user
    const existingMixAndMatch = await MixAndMatch.findOne({ productId, userId });
    if (existingMixAndMatch) {
      return res.status(400).json({ message: "Product already in Mix and Match" });
    }

    // Create a new entry in the Mix and Match collection with the product image and userId
    const newMixAndMatch = new MixAndMatch({
      productId,
      image: product.image,  // Store the product image in the Mix and Match collection
      userId,  // Store the userId in the Mix and Match collection
    });

    // Save to the database
    await newMixAndMatch.save();

    return res.status(201).json({ message: "Product added to Mix and Match", data: newMixAndMatch });
  } catch (error) {
    console.error("Error adding product to Mix and Match:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// Add Product Function
// export const addProduct = async (req, res) => {
//   try {
//     const { title, description, category, color, size, price } = req.body;
//     const file = req.files?.["image"]?.[0];

//     if (!title || !description || !category || !price) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be filled." });
//     }

//     if (!file) {
//       return res.status(400).json({ message: "Product image is required." });
//     }

//     const imageUrl = await uploadToCloudinary(file.path, "product_images");

//     const newProduct = new Product({
//       title,
//       description,
//       category,
//       color,
//       size,
//       price,
//       image: imageUrl,
//     });

//     await newProduct.save();

//     deleteLocalFile(file.path);

//     return res.status(201).json({
//       message: "Product added successfully!",
//       data: newProduct,
//     });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export const addProduct = async (req, res) => {
//   try {
//     const productData = req.body;

//     // Extract and validate the brand ObjectId
//     const brand = productData.brand;
//     if (!mongoose.isValidObjectId(brand)) {
//       return res.status(400).json({ error: "Invalid brand ID" });
//     }

//     // Check if the brand exists in the database
//     const existingBrand = await Brand.findById(brand);
//     if (!existingBrand) {
//       return res.status(400).json({ error: "Brand not found" });
//     }
//     // Handle image upload to Cloudinary
//     let imageUrl = "default_image_url"; // Default image URL if no image is provided
//     if (req.files && req.files.image) {
//       const filePath = req.files.image[0].path; // Get the file path from Multer
//       imageUrl = await uploadToCloudinary(filePath, "product_images"); // Upload to Cloudinary and get the URL
//       deleteLocalFile(filePath); // Optionally delete the local file after uploading to Cloudinary
//     }
//     // Create a new product with the provided data and default values where necessary
//     const newProduct = new Product({
//       title: productData.title,
//       description: productData.description,
//       category: productData.category,
//       color: productData.color || "N/A", // Default to "N/A" if color is not provided
//       size: productData.size || "N/A", // Default to "N/A" if size is not provided
//       price: productData.price,
//       image: productData.image || "default_image_url", // Default to a placeholder image if not provided
//       brand: brand, // Ensure brand is passed correctly as a valid ObjectId
//     });

//     await newProduct.save();
//     res.status(201).json(newProduct); // Return the newly created product
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ error: "Failed to add product" });
//   }
// };
export const addProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Extract and validate the brand ObjectId
    const brand = productData.brand;
    if (!mongoose.isValidObjectId(brand)) {
      return res.status(400).json({ error: "Invalid brand ID" });
    }

    // Check if the brand exists in the database
    const existingBrand = await Brand.findById(brand);
    if (!existingBrand) {
      return res.status(400).json({ error: "Brand not found" });
    }

    // Handle image upload to Cloudinary
    let imageUrl = "default_image_url"; // Default image URL if no image is provided
    if (req.files && req.files.image) {
      const filePath = req.files.image[0].path; // Get the file path from Multer
      imageUrl = await uploadToCloudinary(filePath, "product_images"); // Upload to Cloudinary and get the URL
      deleteLocalFile(filePath); // Optionally delete the local file after uploading to Cloudinary
    }

    // Create a new product with the provided data and Cloudinary image URL
    const newProduct = new Product({
      title: productData.title,
      description: productData.description,
      category: productData.category,
      color: productData.color || "N/A", // Default to "N/A" if color is not provided
      size: productData.size || "N/A", // Default to "N/A" if size is not provided
      price: productData.price,
      image: imageUrl, // Use the Cloudinary URL here
      brand: brand, // Ensure brand is passed correctly as a valid ObjectId
    });

    await newProduct.save();
    res.status(201).json(newProduct); // Return the newly created product
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// Get Products Function
export const getProducts = async (req, res) => {
  try {
    const {
      size,
      color,
      category,
      price,
      sortBy = "price",
      order = "asc",
      limit = 10,
      page = 1,
    } = req.query;
    const filter = {};

    if (size) filter.size = size;
    if (color) filter.color = color;
    if (category) filter.category = category;
    if (price === "under-3000") filter.price = { $lt: 3000 };
    if (price === "above-3000") filter.price = { $gte: 3000 };

    const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    const totalProducts = await Product.countDocuments(filter);

    return res.json({
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Bulk Upload Products Function
// export const bulkUploadProducts = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }

//     const filePath = req.file.path;

//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     let jsonData = xlsx.utils.sheet_to_json(worksheet);

//     jsonData = jsonData.map((productData) => {
//       return Object.keys(productData).reduce((acc, key) => {
//         acc[key.toLowerCase()] = productData[key];
//         return acc;
//       }, {});
//     });

//     const productsToSave = [];

//     for (const productData of jsonData) {
//       if (
//         !productData.title ||
//         !productData.description ||
//         !productData.price ||
//         !productData.category
//       ) {
//         continue;
//       }

//       const newProduct = new Product({
//         title: productData.title,
//         description: productData.description,
//         category: productData.category,
//         color: productData.color || "N/A",
//         size: productData.size || "N/A",
//         price: productData.price,
//         image: productData.image || "default_image_url",
//         brand, // This should be a valid ObjectId
//       });

//       productsToSave.push(newProduct);
//     }

//     if (productsToSave.length > 0) {
//       await Product.insertMany(productsToSave);
//     }

//     deleteLocalFile(filePath);

//     return res.json({
//       message: "Bulk upload successful!",
//       products: productsToSave,
//     });
//   } catch (error) {
//     console.error("Error during bulk upload:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// };

export const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { brand } = req.body; // Get the brand ID from the request body
    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let jsonData = xlsx.utils.sheet_to_json(worksheet);

    jsonData = jsonData.map((productData) => {
      return Object.keys(productData).reduce((acc, key) => {
        acc[key.toLowerCase()] = productData[key];
        return acc;
      }, {});
    });

    const productsToSave = [];

    for (const productData of jsonData) {
      if (
        !productData.title ||
        !productData.description ||
        !productData.price ||
        !productData.category
      ) {
        continue;
      }

      const newProduct = new Product({
        title: productData.title,
        description: productData.description,
        category: productData.category,
        color: productData.color || "N/A",
        size: productData.size || "N/A",
        price: productData.price,
        image: productData.image || "default_image_url",
        brand: brand, // Include the selected brand in each product
      });

      productsToSave.push(newProduct);
    }

    if (productsToSave.length > 0) {
      await Product.insertMany(productsToSave);
    }

    deleteLocalFile(filePath);

    return res.json({
      message: "Bulk upload successful!",
      products: productsToSave,
    });
  } catch (error) {
    console.error("Error during bulk upload:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    // Fetch products by brandId
    const products = await Product.find({ brand: brandId });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this brand." });
    }

    return res.json({
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const productData = req.body;

    // Find the product by ID
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image upload to Cloudinary (if a new image is provided)
    if (req.files && req.files.image) {
      const filePath = req.files.image[0].path; // Get the file path from Multer
      const imageUrl = await uploadToCloudinary(filePath, "product_images"); // Upload to Cloudinary and get the URL
      deleteLocalFile(filePath); // Optionally delete the local file after uploading to Cloudinary
      productData.image = imageUrl; // Update image URL in product data
    }

    // Update product details in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: productData },
      { new: true } // Return the updated product
    );

    res.status(200).json(updatedProduct); // Return updated product
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
export const getShirts = async (req, res) => {
  try {
    const { color, price } = req.query;
    const filter = { category: "Shirts" };

    // Apply optional color and price filters
    if (color) filter.color = color;
    if (price) {
      const parsedPrice = parseInt(price, 10);
      if (parsedPrice) {
        filter.price = { $lte: parsedPrice };
      }
    }

    const shirts = await Product.find(filter);

    if (shirts.length === 0) {
      return res.status(404).json({ message: "No shirts found" });
    }

    res.status(200).json(shirts);
  } catch (error) {
    console.error("Error fetching shirts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPents = async (req, res) => {
  try {
    const { color, price } = req.query;
    const filter = { category: "Pents" };

    // Apply optional color and price filters
    if (color) filter.color = color;
    if (price) {
      const parsedPrice = parseInt(price, 10);
      if (parsedPrice) {
        filter.price = { $lte: parsedPrice };
      }
    }

    const pents =  await Product.find(filter);

    if (pents.length === 0) {
      return res.status(404).json({ message: "No Pents found" });
    }

    res.status(200).json(pents);
  } catch (error) {
    console.error("Error fetching pents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getStiched = async (req, res) => {
  try {
    const { color, price } = req.query;
    const filter = { category: "Stiched" };

    // Apply optional color and price filters
    if (color) filter.color = color;
    if (price) {
      const parsedPrice = parseInt(price, 10);
      if (parsedPrice) {
        filter.price = { $lte: parsedPrice };
      }
    }

    const stiched =  await Product.find(filter);

    if (stiched.length === 0) {
      return res.status(404).json({ message: "No Stiched found" });
    }

    res.status(200).json(stiched);
  } catch (error) {
    console.error("Error fetching Stiched:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const getUnstiched = async (req, res) => {
  try {
    const { color, price } = req.query;
    const filter = { category: "Unstiched" };

    // Apply optional color and price filters
    if (color) filter.color = color;
    if (price) {
      const parsedPrice = parseInt(price, 10);
      if (parsedPrice) {
        filter.price = { $lte: parsedPrice };
      }
    }

    const unstiched =  await Product.find(filter);

    if (unstiched.length === 0) {
      return res.status(404).json({ message: "No Stiched found" });
    }

    res.status(200).json(unstiched);
  } catch (error) {
    console.error("Error fetching Stiched:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const getFootwear = async (req, res) => {
  try {
    const { color, price } = req.query;
    const filter = { category: "Footwear" };

    if (color) filter.color = color;
    if (price) {
      const parsedPrice = parseInt(price, 10);
      if (parsedPrice) {
        filter.price = { $lte: parsedPrice };
      }
    }

    const footwear = await Product.find(filter);

    if (footwear.length === 0) {
      return res.status(404).json({ message: "No Footwear found" });
    }

    res.status(200).json(footwear);
  } catch (error) {
    console.error("Error fetching Footwear:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getProductsById = async (req, res) => {
  console.log(req.params)
  try {
    const product = await Product.findById(req.params.id)
      .populate('brand', 'brandName'); // Populate the 'brand' field with only the 'brandName' field from the Brand model

    if (product) {
      res.json(product);  // Return the product with the brand name
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product', error });
  }
};
