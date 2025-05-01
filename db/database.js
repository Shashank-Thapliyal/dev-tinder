import mongoose from "mongoose";


const connectDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("Error while connecting to database");
    process.exit(1);
  }
};

export default connectDb;
