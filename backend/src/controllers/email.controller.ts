import { Request, Response } from "express";
import { ZodError } from "zod";
import { EmailStatus } from "../constants/status";

import {
  createEmailJob,
  getAllEmailJobs,
  getEmailJobById,
  updateEmailJobById,
  deleteEmailJobById,
} from "../services/email.service";
import emailQueue from "../queue/email.queue";
import prisma from "../config/prisma";
import { scheduleEmailSchema } from "../validators/email.validator";

export const scheduleEmail = async (
  req: Request,
  res: Response
) => {
  try {
    // ✅ Validate request body
    const validatedData = scheduleEmailSchema.parse(req.body);


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
    const status = req.query.status as EmailStatus | undefined;

    const emails = await getAllEmailJobs(status);

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

export const getEmailById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const email = await getEmailJobById(id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    return res.status(200).json({
      success: true,
      email,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const validatedData = scheduleEmailSchema.parse(req.body);

    const email = await getEmailJobById(id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    if (email.status !== EmailStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: "Only pending emails can be edited",
      });
    }

    const updatedEmail = await updateEmailJobById(id, {
      recipient: validatedData.recipient,
      subject: validatedData.subject,
      body: validatedData.body,
      sender: validatedData.sender,
      scheduledAt: new Date(validatedData.scheduledAt),
    });

    if (email.bullJobId) {
      const existingJob = await emailQueue.getJob(email.bullJobId);
      if (existingJob) {
        await existingJob.remove();
      }

      const bullJob = await emailQueue.add(
        "send-email",
        {
          emailJobId: updatedEmail.id,
          recipient: updatedEmail.recipient,
          subject: updatedEmail.subject,
          body: updatedEmail.body,
          sender: updatedEmail.sender,
        },
        {
          delay: Math.max(
            new Date(updatedEmail.scheduledAt).getTime() - Date.now(),
            0
          ),
        }
      );

      await prisma.emailJob.update({
        where: { id: updatedEmail.id },
        data: { bullJobId: bullJob.id?.toString() },
      });
    }

    const refreshedEmail = await getEmailJobById(id);

    return res.status(200).json({
      success: true,
      email: refreshedEmail,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const email = await getEmailJobById(id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    if (email.status !== EmailStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: "Only pending emails can be deleted",
      });
    }

    if (email.bullJobId) {
      const existingJob = await emailQueue.getJob(email.bullJobId);
      if (existingJob) {
        await existingJob.remove();
      }
    }

    await deleteEmailJobById(id);

    return res.status(200).json({
      success: true,
      message: "Email deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
