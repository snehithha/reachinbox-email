import { Worker } from "bullmq";
import redis from "../config/redis";

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("\n📧 Processing Email Job");
    console.log("------------------------");
    console.log("Bull Job ID:", job.id);
    console.log("Data:", job.data);

    // Email sending logic will be added here later.
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed`);
  console.error(err);
});

console.log("🚀 Email Worker Started");