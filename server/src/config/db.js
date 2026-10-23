import mongoose from 'mongoose';

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const isDbReady = () => mongoose.connection.readyState === 1;

export const getDbStatus = () => ({
  connected: isDbReady(),
  readyState: mongoose.connection.readyState,
});

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/applyai';

  if (isDbReady()) return;

  await mongoose.connect(uri, options);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

export const connectDBWithRetry = async (retries = 5, delayMs = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await connectDB();
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) {
        console.error('Could not connect to MongoDB. API will return 503 until database is available.');
        console.error('Start MongoDB with: docker compose up -d');
        return;
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
};

export default connectDB;
