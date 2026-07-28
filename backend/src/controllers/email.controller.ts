import { Request, Response } from "express";
import { createEmailJob } from "../services/email.service";
import emailQueue from "../queue/email.queue";
import prisma from "../config/prisma";

export const scheduleEmail = async (
  req: Request,
  res: Response
) => {
  try {
    // Save email to PostgreSQL
    const job = await createEmailJob({
      recipient: req.body.recipient,
      subject: req.body.subject,
      body: req.body.body,
      sender: req.body.sender,
      scheduledAt: new Date(req.body.scheduledAt),
    });

    // Add job to BullMQ
    const bullJob = await emailQueue.add(
      "send-email",
      {
        emailJobId: job.id,
        recipient: job.recipient,
        subject: job.subject,
        body: job.body,
        sender: job.sender,
      },
      {
        delay: Math.max(
          new Date(job.scheduledAt).getTime() - Date.now(),
          0
        ),
      }
    );

    // Save BullMQ Job ID in database
    await prisma.emailJob.update({
      where: {
        id: job.id,
      },
      data: {
        bullJobId: bullJob.id?.toString(),
      },
    });

    // Return response
    res.status(201).json({
      success: true,
      message: "Email scheduled successfully",
      jobId: job.id,
      bullJobId: bullJob.id,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};