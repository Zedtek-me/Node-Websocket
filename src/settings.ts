import { config } from "dotenv";
config();

export const DIRECT_EXCHANGE_NAME = "private_exchange";
export const TOPIC_EXCHANGE_NAME = "group_exchange";
export const MONGO_DB_CONNECTION_STRING = process.env.MONGO_URI || "mongodb://node-ws-user:password@mongo:27017/node-ws";
export const PORT = 4000;
export const RABBITMQ_CONNECTION_STRING = process.env.RABBITMQ_URI