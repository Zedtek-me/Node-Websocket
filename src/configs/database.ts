import mongoose from "mongoose";
import * as settings from "../settings";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(settings.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/node-ws");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
export default connectToDatabase;