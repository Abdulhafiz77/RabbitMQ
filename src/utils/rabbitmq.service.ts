import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";

class RabbitMQService {
    private requestQueue = "PRODUCT_BATCH_REQUEST";
    private responseQueue = "PRODUCT_BATCH_RESPONSE";
    private connection!: Connection;
    private channel!: Channel;
    private correlationMap = new Map<string, (response: any) => void>();

    constructor() {
        this.init();
    }

    async init() {
        this.connection = await amqp.connect(config.msgBrokerURL!);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.requestQueue);
        await this.channel.assertQueue(this.responseQueue);
        this.listenForResponses();
    }

    async sendRequest(message: any, correlationId: string, callback: (response: any) => void) {
        this.correlationMap.set(correlationId, callback);
        this.channel.sendToQueue(this.requestQueue, Buffer.from(JSON.stringify(message)), { correlationId });
    }

    private async listenForResponses() {
        this.channel.consume(this.responseQueue, (msg) => {
            if (msg && msg.properties.correlationId && this.correlationMap.has(msg.properties.correlationId)) {
                const responseCallback = this.correlationMap.get(msg.properties.correlationId);
                if (responseCallback) {
                    responseCallback(msg.content.toString());
                    this.correlationMap.delete(msg.properties.correlationId);
                }
                this.channel.ack(msg);
            }
        }, { noAck: false });
    }
}

export const rabbitMQService = new RabbitMQService();