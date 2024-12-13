import { User } from "../models/user.model.js";
import mongoose from "mongoose";
// Add product to wishlist
export const addToWishlist = async (req, res) => {
  let { productId, userId } = req.body;
  productId = new mongoose.Types.ObjectId(productId)
  console.log(productId, userId, "ids")
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the item is already a favorite
    if (user.favourites.includes(productId)) {
      return res.status(400).json({ message: "Item already in favorites" });
    }

    user.favourites.push(productId);
    await user.save();
    const userFav = await User.findById(userId)
      .populate("favourites")
      .select("favourites");
    res
      .status(200)
      .json({ message: "Item added to favorites", favourites: userFav });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Filter the product out of the user's favourites
    user.favourites = user.favourites.filter(
      (id) => !id.equals(productObjectId)
    );

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({
        message: "Item removed from favorites",
        favourites: user.favourites,
      });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeAllFromWishlist = async (req, resp) => {
  const { userId } = req.body;
  try {
    const user = await User.findById({_id: userId})
    user.favourites = []
    user.save()
    return resp.json({
      status: 201,
      message: "Cleared wishlist successfully!",
      data: user.favourites,
    })
  } catch (error) {
    console.log(error);
    resp.json({
      status: 503,
      success: false,
      message: "Something went wrong",
    });
  }
};

// get whishlist data

export const getUserFavourites = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId).populate("favourites");
    res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
