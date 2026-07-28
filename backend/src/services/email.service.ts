import prisma from "../config/prisma";
import { EmailStatus } from "../constants/status";  

export async function createEmailJob(data: {
  recipient: string;
  subject: string;
  body: string;
  sender: string;
  scheduledAt: Date;
}) {
  return prisma.emailJob.create({
    data: {
      ...data,
      status: EmailStatus.PENDING,
    },
  });
}

export async function getAllEmailJobs() {
  return prisma.emailJob.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}