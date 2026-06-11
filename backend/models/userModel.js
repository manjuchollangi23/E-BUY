import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { useLocalDB, readLocalFile, writeLocalFile } from '../config/db.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' }
  }
}, { timestamps: true });

// Hash password before saving in MongoDB
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const MongoUser = mongoose.model('User', userSchema);

export const matchPassword = async (user, enteredPassword) => {
  return await bcrypt.compare(enteredPassword, user.password);
};

export const User = {
  async findOne({ email }) {
    if (!useLocalDB) {
      return await MongoUser.findOne({ email });
    }
    const users = readLocalFile('users.json');
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id) {
    if (!useLocalDB) {
      return await MongoUser.findById(id);
    }
    const users = readLocalFile('users.json');
    return users.find(u => u._id === id) || null;
  },

  async create(userData) {
    if (!useLocalDB) {
      const user = new MongoUser(userData);
      return await user.save();
    }
    const users = readLocalFile('users.json');
    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) {
      throw new Error('User already exists');
    }
    
    let password = userData.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const newUser = {
      _id: 'u_' + Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      password: password,
      isAdmin: userData.isAdmin || false,
      address: userData.address || { street: '', city: '', state: '', zipCode: '', country: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    writeLocalFile('users.json', users);
    return newUser;
  },

  async findByIdAndUpdate(id, updateData, options = {}) {
    if (!useLocalDB) {
      return await MongoUser.findByIdAndUpdate(id, updateData, { new: true, ...options });
    }
    const users = readLocalFile('users.json');
    const userIndex = users.findIndex(u => u._id === id);
    if (userIndex === -1) return null;

    let user = users[userIndex];
    let updatedAddress = { ...user.address };
    if (updateData.address) {
      updatedAddress = { ...updatedAddress, ...updateData.address };
    }

    let password = user.password;
    if (updateData.password && updateData.password !== user.password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = {
      ...user,
      ...updateData,
      password,
      address: updatedAddress,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    writeLocalFile('users.json', users);
    return updatedUser;
  },

  async find() {
    if (!useLocalDB) {
      return await MongoUser.find({});
    }
    return readLocalFile('users.json');
  },

  async findByIdAndDelete(id) {
    if (!useLocalDB) {
      return await MongoUser.findByIdAndDelete(id);
    }
    const users = readLocalFile('users.json');
    const filtered = users.filter(u => u._id !== id);
    writeLocalFile('users.json', filtered);
    return true;
  }
};
