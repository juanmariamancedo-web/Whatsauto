import { Redis } from "ioredis";
const path = require('node:path');

require('dotenv').config({path: path.join(__dirname, "../../../.env")})

const redis = new Redis({
    host: process.env.REDIS_HOST || "http://localhost",
    port: parseInt(process.env.REDIS_PORT || "3000"),
    password: process.env.REDIS_PASSWORD,
});

export default redis