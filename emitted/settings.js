"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MONGO_DB_CONNECTION_STRING = exports.TOPIC_EXCHANGE_NAME = exports.DIRECT_EXCHANGE_NAME = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.DIRECT_EXCHANGE_NAME = "private_exchange";
exports.TOPIC_EXCHANGE_NAME = "group_exchange";
exports.MONGO_DB_CONNECTION_STRING = process.env.MONGO_URI || "mongodb://node-ws-user:password@mongo:27017/node-ws";
exports.PORT = 4000;
//# sourceMappingURL=settings.js.map