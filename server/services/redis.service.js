const dotenv = require("dotenv")
dotenv.config()
const Redis = require("ioredis");

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
})

redisClient.on("connect", () => {
    console.log("redis connected")
})

module.exports = redisClient;