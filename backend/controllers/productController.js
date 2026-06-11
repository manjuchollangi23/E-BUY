import { Product } from '../models/productModel.js';

// @desc    Get all products with filters, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const { search, category, brand, priceMin, priceMax, ratingMin, sort, page, limit } = req.query;

  try {
    const result = await Product.find({
      search,
      category,
      brand,
      priceMin,
      priceMax,
      ratingMin,
      sort,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, price, description, images, brand, category, countInStock, discount, deliveryTime } = req.body;

  try {
    const product = await Product.create({
      name,
      price: Number(price),
      description,
      images,
      brand,
      category,
      countInStock: Number(countInStock),
      discount: Number(discount) || 0,
      deliveryTime: deliveryTime || '3-5 business days',
      rating: 0,
      numReviews: 0,
      reviews: []
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { name, price, description, images, brand, category, countInStock, discount, deliveryTime } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const updateData = {
        name: name || product.name,
        price: price !== undefined ? Number(price) : product.price,
        description: description || product.description,
        images: images || product.images,
        brand: brand || product.brand,
        category: category || product.category,
        countInStock: countInStock !== undefined ? Number(countInStock) : product.countInStock,
        discount: discount !== undefined ? Number(discount) : product.discount,
        deliveryTime: deliveryTime || product.deliveryTime
      };

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const updatedProduct = await Product.addReview(req.params.id, {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      });
      res.status(201).json({ message: 'Review added', product: updatedProduct });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error.message === 'Product already reviewed') {
      res.status(400).json({ message: 'You have already reviewed this product' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
