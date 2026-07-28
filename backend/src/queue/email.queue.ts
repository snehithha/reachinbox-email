import { Queue } from "bullmq";
import redis from "../config/redis";

const emailQueue = new Queue("email-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export default emailQueue;