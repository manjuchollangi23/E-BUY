import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Express Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Main Application Route Setup
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health Check API
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('E-BUY E-Commerce Backend API is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database, seed default records, then boot server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n=============================================================`);
      console.log(`E-BUY backend server successfully booted!`);
      console.log(`Port: ${PORT}`);
      console.log(`URL:  http://localhost:${PORT}`);
      console.log(`=============================================================\n`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
