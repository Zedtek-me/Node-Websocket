import amqp from 'amqplib';
import { WebSocketType } from '../types/ws_types/ws';

class AMQPService{
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    constructor(){
        this.connection = null;
        this.channel = null;
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
        }
    }

    private async disconnect(){
        // Logic to close AMQP connection
    }

    public async sendMessage(
        routingKey: string,
        message: string,
    ): Promise<void> {
        if(!this.channel){
            console.error('AMQP channel is not established');
            return;
        }
        const exchange = 'direct_logs';
        await this.channel.assertExchange(exchange, 'direct', { durable: false });
        this.channel.publish(exchange, routingKey, Buffer.from(message));
        console.log(`Sent message to exchange ${exchange} with routing key ${routingKey}: ${message}`);
    }
}

export default AMQPService;