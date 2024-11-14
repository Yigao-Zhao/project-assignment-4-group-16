const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD || null,
});

// Event listeners
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Test Redis connection
(async () => {
    try {
        if (!client.isOpen) await client.connect();
        console.log('Redis connection tested successfully');
    } catch (err) {
        console.error('Redis connection test failed:', err);
    }
})();

module.exports = client;