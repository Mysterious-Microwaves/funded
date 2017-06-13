const redis = require('redis');
const redisClient = (process.env.REDIS_URL) ? redis.createClient(process.env.REDIS_URL) : redis.createClient();

redisClient.on('connect', () => {
  console.log('connected');
})

module.exports = redisClient;