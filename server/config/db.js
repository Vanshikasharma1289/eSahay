const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[eSahay DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[eSahay DB Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;