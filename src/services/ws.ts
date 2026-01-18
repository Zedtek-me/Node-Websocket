import { WebSocketType, MessageType, MessageTypes } from "../types/ws_types/ws";
import { WebSocketServer } from "ws";
import AmqpService from "./amqp";
import UserService from "./user_service";
import User from "../models/users";

class WebSocketService{

    public ws: WebSocketType;
    public amqpService: AmqpService;
    private userService: UserService;

    constructor(ws: WebSocketType){
        this.ws = ws;
        this.amqpService = new AmqpService();
        this.userService = UserService;
    }
    public handleMessage(message: string): void {
        console.log(`Webocket message received:::::: ${message}`);
        if(this.ws){
            this.ws.send(`Echo from WebSocketService: ${message}`);
        }
    }

    public async sendMessage(
        message: MessageType,
        msgType?: MessageTypes,
        recipientId: string | null = null,
        groupId: string | null = null,
    ){
        if(msgType === "private" && !recipientId){
            console.error("Recipient ID is required for private messages");
            return;

        }
        if(msgType === "group" && !groupId){
            console.error("Group ID is required for group messages");
            return;
        }
        if (msgType === "private"){
            const recipientUser = await UserService.fetchUser()
            if(!recipientUser){
                console.error(`User with ID ${recipientId} not found`);
                return;
            }
            /**
             * fetch the recipient user queue name, then send the message to that queue via AMQP
             */
        }
        if(msgType === "group"){
            /**
             * fetch group from db; get the group name; construct its routing key, then send the message to that group via AMQP
             */
        }
    }
}


export default WebSocketService;