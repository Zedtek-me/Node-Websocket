"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const settings = __importStar(require("../settings"));
class AMQPService {
    constructor(userInfo, ws) {
        this.connection = null;
        this.channel = null;
        this.userInfo = userInfo;
        this.connection = null;
        this.channel = null;
        this.ws = ws;
        this.retryCount = 0;
        this.connect();
    }
    async connect() {
        var _a;
        try {
            this.connection = await amqplib_1.default.connect(settings.RABBITMQ_CONNECTION_STRING);
            this.channel = await this.connection.createChannel();
            await this.createQueue("direct", (((_a = this.userInfo) === null || _a === void 0 ? void 0 : _a.email) || "anonymous"));
            console.log('AMQP connected');
        }
        catch (error) {
            console.error('Failed to connect to AMQP:', error);
            if (this.retryCount >= 3) {
                throw new Error("unable to establish connection to rabbitmq!");
            }
            this.retryCount += 1;
            this.connect();
        }
    }
    async disconnect() {
        if (this.connection && this.channel) {
            this.channel.close();
            this.connection.close();
        }
    }
    async sendMessage(routingKey, message) {
        if (!this.channel) {
            console.error('AMQP channel is not established');
            return;
        }
        const exchange = settings.DIRECT_EXCHANGE_NAME;
        await this.channel.assertExchange(exchange, 'direct', { durable: true });
        message = JSON.stringify(message);
        this.channel.publish(exchange, routingKey, Buffer.from(message));
        console.log(`Sent message to exchange ${exchange} with routing key ${routingKey}: ${message.toString()}`);
    }
    async createQueue(type, name) {
        if (!this.channel) {
            throw new Error("Can't assert a queue without connection to the brokerage server!");
        }
        if (type.toLocaleLowerCase() === "direct") {
            this._createDirectQueue(name);
        }
        else
            this._createTopicQueue(name);
    }
    _getQueueNameAndKey(queueName) {
        return [queueName, queueName];
    }
    async _consumeFromQueue(queueName) {
        this.channel && this.channel.consume(queueName, async (msg) => {
            var _a;
            let { content, fields, properties } = (msg || {});
            content = content.toString();
            console.log(`content from the consumer handler::::::  `, content);
            await ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(content));
            await this.channel.ack(msg);
        });
    }
    async _createDirectQueue(name) {
        const exchange = await this.channel.assertExchange(settings.DIRECT_EXCHANGE_NAME, "direct", { durable: true });
        const [queueName, bindingKey] = this._getQueueNameAndKey(name);
        const { queue } = await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.bindQueue(queue, settings.DIRECT_EXCHANGE_NAME, bindingKey);
        await this._consumeFromQueue(queueName);
    }
    async _createTopicQueue(topic) {
    }
}
exports.default = AMQPService;
//# sourceMappingURL=amqp.js.map