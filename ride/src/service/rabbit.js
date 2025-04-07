import amqp from 'amqplib';
import { RABIT_URL } from '../config/env.js';

let channel;

export const connectQueue = async () => {
    try {
        const connection = await amqp.connect(RABIT_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
};

export const publishToQueue = async (queueName, data) => {
    try {
        if (!channel) {
            await connectQueue();
        }
        await channel.assertQueue(queueName);
        return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.error('Error publishing to queue:', error);
        throw error;
    }
};

export const subscribeToQueue = async (queueName, callback) => {
    try {
        if (!channel) {
            await connectQueue();
        }
        await channel.assertQueue(queueName);
        console.log(`Waiting for messages in ${queueName}`);
        channel.consume(queueName, (data) => {
            if (data) {
                const message = JSON.parse(data.content);
                callback(message);
                channel.ack(data);
            }
        });
    } catch (error) {
        console.error('Error subscribing to queue:', error);
        throw error;
    }
};

// Initialize connection when the file is imported
connectQueue().catch(console.error);