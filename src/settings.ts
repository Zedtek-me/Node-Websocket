import { config } from "dotenv";
config();

export const DIRECT_EXCHANGE_NAME = "private_exchange";
export const TOPIC_EXCHANGE_NAME = "group_exchange";
export const MONGO_DB_CONNECTION_STRING = process.env.MONGODB_URI || "mongodb://localhost:27017/node-ws";
