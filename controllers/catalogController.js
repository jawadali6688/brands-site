import catalog from '../models/catalog.js';  // Adjust the import path as needed

export const getAllProducts = async (req, res) => {
  try {
    const products = await catalog.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const getProductById = async (req, res) => {
  console.log(req.params);
  console.log(req.params.id);
  try {
    const product = await catalog.findById(req.params.id.toString());
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product', error });
  }
};
