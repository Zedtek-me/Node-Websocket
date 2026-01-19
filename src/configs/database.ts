import mongoose from "mongoose";
import * as settings from "../settings";

const connectToDatabase = async (retries: number = 5) => {
  try {
    await mongoose.connect(settings.MONGO_DB_CONNECTION_STRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    if(retries === 0) process.exit(1);
    setTimeout(() => connectToDatabase(retries - 1), 5000);
  }
};
export default connectToDatabase;