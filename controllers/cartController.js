import Cart from '../models/Cart.js';
import Catalog from '../models/catalog.js';  // Import Catalog model

// Add product to cart
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;  // Get userId directly from the request body

  try {
    // Get product details from Catalog
    const product = await Catalog.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // If the cart exists, check if the product is already in the cart
      const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

      if (productIndex >= 0) {
        // If the product already exists in the cart, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // If the cart doesn't exist, create a new cart for the user
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }]
      });

      await cart.save();
      return res.status(200).json(cart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;  // Get userId directly from the body

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products.splice(productIndex, 1);  // Remove product from cart

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing product from cart' });
  }
};
