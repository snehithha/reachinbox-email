import { Worker } from "bullmq";
import redis from "../config/redis";
import prisma from "../config/prisma";
import brevo from "../config/mailer";
import emailQueue from "../queue/email.queue";
import { reserveSendSlot } from "../services/throttle.service";

import { EmailStatus } from "../constants/status";
import {
  canSendEmail,
  getDelayUntilNextHour,
} from "../services/ratelimiter.service";

// Removed accidental top-level job logging (job is only defined inside the worker callback)


const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("\n📧 Processing Email Job");
    

    try {
      // ==========================
      // 1. Idempotency Check
      // ==========================

      const existing = await prisma.emailJob.findUnique({
        where: {
          id: job.data.emailJobId,
        },
      });

      if (!existing) {
        console.log("⚠️ Email record not found.");
        return;
      }

      if (existing.status === EmailStatus.SENT) {
        console.log("⚠️ Email already sent. Skipping.");
        return;
      }

      // ==========================
      // 2. Rate Limit
      // ==========================

      console.log(
        "Hourly Limit:",
        job.data.hourlyLimit
      );

      const allowed = await canSendEmail(
        job.data.sender
      );

      if (!allowed) {
        console.log("⏳ Hourly limit reached.");

        const newJob = await emailQueue.add(
          "send-email",
          job.data,
          {
            delay: getDelayUntilNextHour(),
          }
        );

        await prisma.emailJob.update({
          where: {
            id: job.data.emailJobId,
          },
          data: {
            bullJobId: newJob.id?.toString(),
          },
        });

        console.log("↪️ Job rescheduled for next hour.");

        return;
      }

      // ==========================
      // 3. Update Status
      // ==========================

      await prisma.emailJob.update({
        where: {
          id: job.data.emailJobId,
        },
        data: {
          status: EmailStatus.SENDING,
        },
      });

      // Temporary delay
      // await new Promise((resolve) =>
      //   setTimeout(
      //     resolve,
      //     Number(process.env.MIN_EMAIL_DELAY) || 2000
      //   )
      // );


      console.log(
        "Delay:",
        job.data.delayBetweenEmails
      );

      const slot = await reserveSendSlot(
      );

      const wait = slot - Date.now();
      
      if (wait > 0) {
        console.log(`⏳ Waiting ${wait} ms before sending...`);
      
        await new Promise((resolve) =>
          setTimeout(resolve, wait)
        );
      }

      // ==========================
      // 4. Send Email
      // ==========================

      

const response = await brevo.post("/smtp/email", {
  sender: {
    name: job.data.sender,
    email: process.env.EMAIL_FROM,
  },
  to: [
    {
      email: job.data.recipient,
    },
  ],
  subject: job.data.subject,
  textContent: job.data.body,
});

console.log("Email sent!");
console.log(response.data);

      // ==========================
      // 5. Mark SENT
      // ==========================

      await prisma.emailJob.update({
        where: {
          id: job.data.emailJobId,
        },
        data: {
          status: EmailStatus.SENT,
          sentAt: new Date(),
        },
      });

    } catch (error) {
      console.error(error);

      await prisma.emailJob.update({
        where: {
          id: job.data.emailJobId,
        },
        data: {
          status: EmailStatus.FAILED,
        },
      });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: Number(process.env.WORKER_CONCURRENCY) || 5,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed`);
  console.error(err.message);
});

worker.on("error", (err) => {
  console.error("🚨 Worker Error:", err);
});

console.log("🚀 Email Worker Started");