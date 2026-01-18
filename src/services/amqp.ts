import amqp from 'amqplib';
import { MessageType, WebSocketType } from '../types/ws_types/ws';
import * as settings from "../settings";

class AMQPService{
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    private retryCount: number;

    constructor(){
        this.connection = null;
        this.channel = null;
        this.retryCount = 0
        this.connect();
    }

    private async connect(): Promise<void>{
        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            console.log('AMQP connected');
            // Further setup like asserting exchanges, queues, bindings, etc.
        } catch (error) {
            console.error('Failed to connect to AMQP:', error);
            // retry logic or exit
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
        message = message.toString()
        this.channel.publish(exchange, routingKey, Buffer.from(message.toString()));
        console.log(`Sent message to exchange ${exchange} with routing key ${routingKey}: ${message.toString()}`);
    }
}

export default AMQPService;