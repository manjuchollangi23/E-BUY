import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export let useLocalDB = false;
export const dataDir = path.resolve('data');

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('Warning: MONGO_URI is not defined in environment variables.');
    enableLocalDBFallback('MONGO_URI environment variable missing');
    return;
  }

  try {
    // Attempt Mongoose connection with a timeout of 5 seconds to avoid long hangs
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB Connected successfully.');
    useLocalDB = false;
  } catch (error) {
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    enableLocalDBFallback(error.message);
  }
};

function enableLocalDBFallback(reason) {
  console.log(`\n=============================================================`);
  console.log(`DATABASE FALLBACK ACTIVATED:`);
  console.log(`Reason: ${reason}`);
  console.log(`Backend will read and write to local JSON files in: ${dataDir}`);
  console.log(`=============================================================\n`);
  
  useLocalDB = true;
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const initJsonFile = (filename, defaultVal = []) => {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
      console.log(`Initialized fallback database file: ${filename}`);
    }
  };

  initJsonFile('users.json');
  initJsonFile('products.json');
  initJsonFile('orders.json');
}

// Utility to read JSON fallback files
export const readLocalFile = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading fallback file ${filename}:`, err);
    return [];
  }
};

// Utility to write JSON fallback files
export const writeLocalFile = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing fallback file ${filename}:`, err);
  }
};
