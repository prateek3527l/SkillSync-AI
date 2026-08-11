const mongoose = require('mongoose');
const dns = require('dns');

// Set Node.js DNS resolver to use reliable DNS servers for MongoDB Atlas SRV resolution
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('🧪 Test environment detected. Skipping real database connection.');
    return;
  }
  let mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.includes('<db_password>')) {
    console.warn('⚠️ MONGO_URI is missing or contains placeholder <db_password>. Falling back to local MongoDB.');
    mongoUri = 'mongodb://127.0.0.1:27017/skillsync';
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (mongoUri !== 'mongodb://127.0.0.1:27017/skillsync') {
      console.log('🔄 Attempting fallback to local MongoDB...');
      try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/skillsync', {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected to local fallback: ${conn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error(`❌ Local MongoDB fallback failed: ${fallbackError.message}`);
      }
    }
    console.warn('⚠️ Server running without active MongoDB connection. Database operations will fail.');
  }
};

module.exports = connectDB;