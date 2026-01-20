"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("../types/ws_types/ws");
const amqp_1 = __importDefault(require("./amqp"));
const user_service_1 = __importDefault(require("./user_service"));
class WebSocketService {
    constructor(ws, userInfo) {
        this.ws = ws;
        this.amqpService = new amqp_1.default(userInfo, ws);
        this.userService = user_service_1.default;
    }
    async handleMessage(message) {
        console.log(`Webocket message received:::::: ${message}`);
        message = JSON.parse(message.toString());
        let recipientId = null;
        /**TODO: construct a proper routing key for the recipient user based
         * on the routing key generated for their private queue when they
         * initially connected to ws server.
        */
        if (typeof message !== "string") {
            recipientId = message === null || message === void 0 ? void 0 : message.recipientId;
        }
        const msgType = recipientId ? ws_1.MessageTypes.PRIVATE : ws_1.MessageTypes.GROUP;
        await this.sendMessage(message, msgType, recipientId);
    }
    async sendMessage(message, msgType, recipientId = null, groupId = null) {
        if (msgType === "private" && !recipientId) {
            console.error("Recipient ID is required for private messages");
            return;
        }
        if (msgType === "group" && !groupId) {
            console.error("Group ID is required for group messages");
            return;
        }
        if (msgType === "private") {
            // const recipientUser = await UserService.fetchUser()
            // if(!( recipientUser ? Object.keys(recipientUser).length > 0 : null)){
            //     console.error(`User with ID ${recipientId} not found`);
            //     return;
            // }
            /**
             * fetch the recipient user queue name, then send the message to that queue via AMQP
             */
            const recipientRoutingKey = recipientId || "";
            this.amqpService.sendMessage(recipientRoutingKey, message);
        }
        if (msgType === "group") {
            /**
             * fetch group from db; get the group name; construct its routing key, then send the message to that group via AMQP
             */
        }
    }
    async handleClosedsocket() {
        this.amqpService.disconnect();
    }
}
exports.default = WebSocketService;
//# sourceMappingURL=ws.js.map