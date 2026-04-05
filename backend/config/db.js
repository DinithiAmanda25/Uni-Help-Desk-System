import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uni_help_desk';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\x1b[32m✔\x1b[0m MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m✖\x1b[0m MongoDB Connection Error: ${error.message}`);
    console.log('\n\x1b[33mTip:\x1b[0m Make sure MongoDB is installed and running locally.');
    console.log('Or update MONGO_URI in .env with your MongoDB Atlas connection string.');
    process.exit(1);
  }
};

export default connectDB;
