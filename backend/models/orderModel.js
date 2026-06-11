import mongoose from 'mongoose';
import { useLocalDB, readLocalFile, writeLocalFile } from '../config/db.js';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
    }
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true, default: 'Stripe' },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    email_address: { type: String }
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  status: { type: String, required: true, default: 'Pending' }, // Pending, Shipped, Delivered
  deliveredAt: { type: Date }
}, { timestamps: true });

const MongoOrder = mongoose.model('Order', orderSchema);

export const Order = {
  async create(orderData) {
    if (!useLocalDB) {
      const order = new MongoOrder(orderData);
      return await order.save();
    }
    const orders = readLocalFile('orders.json');
    const newOrder = {
      _id: 'o_' + Math.random().toString(36).substr(2, 9),
      user: orderData.user,
      orderItems: orderData.orderItems || [],
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'Stripe',
      paymentResult: orderData.paymentResult || {},
      itemsPrice: Number(orderData.itemsPrice) || 0,
      shippingPrice: Number(orderData.shippingPrice) || 0,
      taxPrice: Number(orderData.taxPrice) || 0,
      totalPrice: Number(orderData.totalPrice) || 0,
      isPaid: orderData.isPaid || false,
      paidAt: orderData.isPaid ? new Date().toISOString() : null,
      status: orderData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    writeLocalFile('orders.json', orders);
    return newOrder;
  },

  async find(query = {}) {
    if (!useLocalDB) {
      return await MongoOrder.find(query).populate('user', 'id name email').sort({ createdAt: -1 });
    }
    let orders = readLocalFile('orders.json');
    
    // Simple filter support for user
    if (query.user) {
      orders = orders.filter(o => o.user === query.user);
    }
    
    // Sort latest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Mock user populate
    const users = readLocalFile('users.json');
    return orders.map(order => {
      const userObj = users.find(u => u._id === order.user) || { name: 'Unknown User', email: 'unknown@ebuy.com' };
      return {
        ...order,
        user: {
          _id: order.user,
          name: userObj.name,
          email: userObj.email
        }
      };
    });
  },

  async findById(id) {
    if (!useLocalDB) {
      return await MongoOrder.findById(id).populate('user', 'name email');
    }
    const orders = readLocalFile('orders.json');
    const order = orders.find(o => o._id === id);
    if (!order) return null;

    const users = readLocalFile('users.json');
    const userObj = users.find(u => u._id === order.user) || { name: 'Unknown User', email: 'unknown@ebuy.com' };
    
    return {
      ...order,
      user: {
        _id: order.user,
        name: userObj.name,
        email: userObj.email
      }
    };
  },

  async findByIdAndUpdate(id, updateData, options = {}) {
    if (!useLocalDB) {
      return await MongoOrder.findByIdAndUpdate(id, updateData, { new: true, ...options });
    }
    const orders = readLocalFile('orders.json');
    const index = orders.findIndex(o => o._id === id);
    if (index === -1) return null;

    const order = orders[index];
    const updated = {
      ...order,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (updateData.status === 'Delivered' && order.status !== 'Delivered') {
      updated.deliveredAt = new Date().toISOString();
    }

    orders[index] = updated;
    writeLocalFile('orders.json', orders);
    return updated;
  }
};
