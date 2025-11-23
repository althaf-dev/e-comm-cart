
const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.log('redis error', err);
});

async function connectRedis() {
  await redisClient.connect();
  console.log('connected succes fully');
}

module.exports = { redisClient, connectRedis };
