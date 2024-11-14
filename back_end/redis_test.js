const redis = require('redis');

const client = redis.createClient({
    url: 'redis://127.0.0.1:6379', // Redis 地址
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    try {
        await client.connect();

        await client.set('name', 'Jane Doe');
        console.log('Set key "name"');

        const value = await client.get('name');
        console.log('Get key "name":', value);

        await client.del('name');
        console.log('Key "name" deleted');

        await client.quit();
    } catch (err) {
        console.error('Error with Redis operation:', err);
    }
})();