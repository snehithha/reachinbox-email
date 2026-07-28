import { Request, Response } from "express";
import { ZodError } from "zod";

import { createEmailJob } from "../services/email.service";
import emailQueue from "../queue/email.queue";
import prisma from "../config/prisma";
import { scheduleEmailSchema } from "../validators/email.validator";
import { getAllEmailJobs } from "../services/email.service";

export const scheduleEmail = async (
  req: Request,
  res: Response
) => {
  try {
    // ✅ Validate request body
    const validatedData = scheduleEmailSchema.parse(req.body);

    throw new Error("I AM INSIDE THE CONTROLLER");

    // Save email to PostgreSQL
    const job = await createEmailJob({
      recipient: validatedData.recipient,
      subject: validatedData.subject,
      body: validatedData.body,
      sender: validatedData.sender,
      scheduledAt: new Date(validatedData.scheduledAt),
      
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

    // Save BullMQ Job ID
    await prisma.emailJob.update({
      where: {
        id: job.id,
      },
      data: {
        bullJobId: bullJob.id?.toString(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Email scheduled successfully",
      jobId: job.id,
      bullJobId: bullJob.id,
    });

  } catch (error) {

    // ✅ Validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }

    // ✅ Other errors
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllEmails = async (
  req: Request,
  res: Response
) => {
  try {
    const emails = await getAllEmailJobs();

    return res.status(200).json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};