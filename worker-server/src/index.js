const { connect } = require('nats');
require('dotenv').config();

async function startWorker() {
    try {
        const nc = await connect({
            servers: process.env.NATS_URL || 'nats://localhost:4222'
        });
        console.log('Connected to NATS server');

        async function publishUpdateEvent() {
            try {
                const message = JSON.stringify({ trigger: 'update' });
                await nc.publish(
                    process.env.NATS_SUBJECT || 'crypto.update',
                    message
                );
                console.log('Published update event:', message);
            } catch (error) {
                console.error('Error publishing event:', error);
            }
        }

        await publishUpdateEvent();

        setInterval(publishUpdateEvent, 15 * 60 * 1000);
        process.on('SIGINT', async () => {
            console.log('Shutting down worker...');
            await nc.drain();
            process.exit(0);
        });

    } catch (error) {
        console.error('Error starting worker:', error);
        process.exit(1);
    }
}

startWorker(); 