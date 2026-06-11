import { Order } from '../models/orderModel.js';
import { Product } from '../models/productModel.js';
import { User } from '../models/userModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true, // Mock payment completes instantly on checkout
      paidAt: new Date().toISOString(),
      status: 'Pending'
    });

    // Adjust product inventory levels
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const newStock = Math.max(0, product.countInStock - item.qty);
        await Product.findByIdAndUpdate(item.product, { countInStock: newStock });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Allow only the owner or an admin to view this order
      if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status to shipped/delivered
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body; // 'Shipped' or 'Delivered'

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const updateData = { status };
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin sales analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const products = await Product.findAllRaw ? await Product.findAllRaw() : [];
    const users = await User.find({});

    const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;

    // Sales by Category
    const categorySalesMap = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        // Try finding matching product category, fallback to 'Other'
        const matchedProduct = products.find(p => p._id.toString() === item.product.toString());
        const cat = matchedProduct ? matchedProduct.category : 'General';
        categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price * item.qty);
      });
    });

    const categorySales = Object.keys(categorySalesMap).map(key => ({
      category: key,
      value: Number(categorySalesMap[key].toFixed(2))
    }));

    // Recent Sales Timeline (Grouped by date)
    const dailySalesMap = {};
    orders.slice(0, 30).forEach(order => {
      const date = order.createdAt.substring(0, 10);
      dailySalesMap[date] = (dailySalesMap[date] || 0) + order.totalPrice;
    });

    const dailySales = Object.keys(dailySalesMap).map(key => ({
      date: key,
      sales: Number(dailySalesMap[key].toFixed(2))
    })).sort((a,b) => new Date(a.date) - new Date(b.date));

    res.json({
      summary: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalUsers,
        totalProducts
      },
      categorySales,
      dailySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
