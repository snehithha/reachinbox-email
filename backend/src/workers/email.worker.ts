import { Worker } from "bullmq";
import redis from "../config/redis";

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("📧 Processing Job:", job.id);
    console.log(job.data);
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed`, err);
});