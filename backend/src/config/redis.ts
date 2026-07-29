import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export default redis;