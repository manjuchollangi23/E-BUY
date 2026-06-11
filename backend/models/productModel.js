import mongoose from 'mongoose';
import { useLocalDB, readLocalFile, writeLocalFile } from '../config/db.js';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0.0 },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  brand: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: true, default: 0 }, // Discount in percentage
  deliveryTime: { type: String, default: '3-5 business days' },
  reviews: [reviewSchema]
}, { timestamps: true });

const MongoProduct = mongoose.model('Product', productSchema);

export const Product = {
  async find({ search, category, brand, priceMin, priceMax, ratingMin, sort, page = 1, limit = 12 } = {}) {
    if (!useLocalDB) {
      // Build MongoDB query
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (category) query.category = category;
      if (brand) query.brand = brand;
      if (priceMin || priceMax) {
        query.price = {};
        if (priceMin) query.price.$gte = Number(priceMin);
        if (priceMax) query.price.$lte = Number(priceMax);
      }
      if (ratingMin) {
        query.rating = { $gte: Number(ratingMin) };
      }

      // Sorting
      let sortQuery = {};
      if (sort === 'priceAsc') sortQuery = { price: 1 };
      else if (sort === 'priceDesc') sortQuery = { price: -1 };
      else if (sort === 'bestSelling') sortQuery = { rating: -1, numReviews: -1 };
      else if (sort === 'latest') sortQuery = { createdAt: -1 };
      else sortQuery = { createdAt: -1 }; // Default

      const count = await MongoProduct.countDocuments(query);
      const products = await MongoProduct.find(query)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return { products, total: count, pages: Math.ceil(count / limit) };
    } else {
      // Local JSON File Queries
      let products = readLocalFile('products.json');

      // Filters
      if (search) {
        const s = search.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      if (category) {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (brand) {
        products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      }
      if (priceMin) {
        products = products.filter(p => p.price >= Number(priceMin));
      }
      if (priceMax) {
        products = products.filter(p => p.price <= Number(priceMax));
      }
      if (ratingMin) {
        products = products.filter(p => p.rating >= Number(ratingMin));
      }

      // Sorting
      if (sort === 'priceAsc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'priceDesc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'bestSelling') {
        products.sort((a, b) => (b.rating * b.numReviews) - (a.rating * a.numReviews));
      } else if (sort === 'latest') {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const total = products.length;
      const paginated = products.slice((page - 1) * limit, page * limit);

      return { products: paginated, total, pages: Math.ceil(total / limit) };
    }
  },

  async findById(id) {
    if (!useLocalDB) {
      return await MongoProduct.findById(id);
    }
    const products = readLocalFile('products.json');
    return products.find(p => p._id === id) || null;
  },

  async create(productData) {
    if (!useLocalDB) {
      const product = new MongoProduct(productData);
      return await product.save();
    }
    const products = readLocalFile('products.json');
    const newProduct = {
      _id: 'p_' + Math.random().toString(36).substr(2, 9),
      name: productData.name,
      description: productData.description,
      price: Number(productData.price) || 0.0,
      images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
      category: productData.category || 'Uncategorized',
      brand: productData.brand || 'Generic',
      rating: Number(productData.rating) || 0,
      numReviews: Number(productData.numReviews) || 0,
      countInStock: Number(productData.countInStock) || 0,
      discount: Number(productData.discount) || 0,
      deliveryTime: productData.deliveryTime || '3-5 business days',
      reviews: productData.reviews || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    writeLocalFile('products.json', products);
    return newProduct;
  },

  async findByIdAndUpdate(id, updateData, options = {}) {
    if (!useLocalDB) {
      return await MongoProduct.findByIdAndUpdate(id, updateData, { new: true, ...options });
    }
    const products = readLocalFile('products.json');
    const index = products.findIndex(p => p._id === id);
    if (index === -1) return null;

    const updated = {
      ...products[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Typecast numeric fields
    if (updateData.price !== undefined) updated.price = Number(updateData.price);
    if (updateData.countInStock !== undefined) updated.countInStock = Number(updateData.countInStock);
    if (updateData.discount !== undefined) updated.discount = Number(updateData.discount);
    if (updateData.rating !== undefined) updated.rating = Number(updateData.rating);
    if (updateData.numReviews !== undefined) updated.numReviews = Number(updateData.numReviews);

    products[index] = updated;
    writeLocalFile('products.json', products);
    return updated;
  },

  async findByIdAndDelete(id) {
    if (!useLocalDB) {
      return await MongoProduct.findByIdAndDelete(id);
    }
    const products = readLocalFile('products.json');
    const filtered = products.filter(p => p._id !== id);
    writeLocalFile('products.json', filtered);
    return true;
  },

  async addReview(productId, reviewData) {
    if (!useLocalDB) {
      const product = await MongoProduct.findById(productId);
      if (!product) return null;
      
      const alreadyReviewed = product.reviews.find(
        r => r.user.toString() === reviewData.user.toString()
      );
      if (alreadyReviewed) {
        throw new Error('Product already reviewed');
      }

      product.reviews.push({
        name: reviewData.name,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        user: reviewData.user
      });
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      
      return await product.save();
    } else {
      const products = readLocalFile('products.json');
      const index = products.findIndex(p => p._id === productId);
      if (index === -1) return null;

      const product = products[index];
      product.reviews = product.reviews || [];

      const alreadyReviewed = product.reviews.find(
        r => r.user === reviewData.user
      );
      if (alreadyReviewed) {
        throw new Error('Product already reviewed');
      }

      const newReview = {
        _id: 'r_' + Math.random().toString(36).substr(2, 9),
        name: reviewData.name,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        user: reviewData.user,
        createdAt: new Date().toISOString()
      };

      product.reviews.push(newReview);
      product.numReviews = product.reviews.length;
      product.rating = Number((product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1));

      products[index] = product;
      writeLocalFile('products.json', products);
      return product;
    }
  },

  // Direct array fetch for dashboard/listing without pagination
  async findAllRaw() {
    if (!useLocalDB) {
      return await MongoProduct.find({}).sort({ createdAt: -1 });
    }
    return readLocalFile('products.json');
  }
};
