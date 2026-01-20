import amqp from 'amqplib';
import ws from "ws";
import { MessageType, WebSocketType, ConsumerMessageType } from '../types/ws_types/ws';
import { UserType } from '../types/user_types/users';
import * as settings from "../settings";
import { set } from 'mongoose';

class AMQPService{
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;
    public userInfo: UserType;
    public ws: ws.WebSocketServer;

    private retryCount: number;

    constructor(userInfo: UserType, ws: ws.WebSocketServer){
        this.userInfo = userInfo
        this.connection = null;
        this.channel = null;
        this.ws = ws;
        this.retryCount = 0;
        this.connect();
    }

    private async connect(): Promise<void>{
        try {
            this.connection = await amqp.connect(settings.RABBITMQ_CONNECTION_STRING);
            this.channel = await this.connection.createChannel();
            await this.createQueue("direct", (this.userInfo?.email || "anonymous"))
            console.log('AMQP connected');
        } catch (error) {
            console.error('Failed to connect to AMQP:', error);
            if(this.retryCount >= 3){
                throw new Error("unable to establish connection to rabbitmq!")
            }
            this.retryCount += 1;
            this.connect();
        }
    }

    private async disconnect(){
        if(this.connection && this.channel){
            this.channel.close();
            this.connection.close();
        }
    }

    public async sendMessage(
        routingKey: string,
        message: MessageType,
    ): Promise<void> {
        if(!this.channel){
            console.error('AMQP channel is not established');
            return;
        }
        const exchange = settings.DIRECT_EXCHANGE_NAME;
        await this.channel.assertExchange(exchange, 'direct', { durable: true });
        message = JSON.stringify(message);
        this.channel.publish(exchange, routingKey, Buffer.from(message));
        console.log(`Sent message to exchange ${exchange} with routing key ${routingKey}: ${message.toString()}`);
    }

    public async createQueue(type: string, name: string): Promise<any> {
        if(!this.channel){
            throw new Error("Can't assert a queue without connection to the brokerage server!")
        }
        if(
            type.toLocaleLowerCase() === "direct"
        ){
            this._createDirectQueue(name);
        }
        else this._createTopicQueue(name);
    }

    private _getQueueNameAndKey(queueName: string): string[]{
        return [queueName, queueName];
    }

    private async _consumeFromQueue(queueName: string): Promise<void>{
        this.channel && this.channel.consume(
            queueName, async (msg: ConsumerMessageType): Promise<void> => {
                        let { content, fields, properties } = (msg || {});
                        content = content.toString();
                        console.log(`content from the consumer handler::::::  `, content)
                        await this.ws?.send(content)
                        await this.channel.ack(msg);
            }
        )
    }

    private async _createDirectQueue(name: string): Promise<void>{
        const exchange = await this.channel.assertExchange(settings.DIRECT_EXCHANGE_NAME, "direct", {durable: true})
        const [queueName, bindingKey] = this._getQueueNameAndKey(name)
        const { queue } = await this.channel.assertQueue(queueName, {durable: true})
        await this.channel.bindQueue(queue, settings.DIRECT_EXCHANGE_NAME, bindingKey)
        await this._consumeFromQueue(queueName);
    }

    private async _createTopicQueue(topic: string): Promise<void>{

    }
}

export default AMQPService;