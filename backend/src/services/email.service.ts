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

export async function getAllEmailJobs(status?: EmailStatus) {
  return prisma.emailJob.findMany({
    where: status
      ? {
          status,
        }
      : undefined,

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getEmailJobById(id: string) {
  return prisma.emailJob.findUnique({
    where: {
      id,
    },
  });
}

export async function updateEmailJobById(id: string, data: {
  recipient: string;
  subject: string;
  body: string;
  sender: string;
  scheduledAt: Date;
}) {
  return prisma.emailJob.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteEmailJobById(id: string) {
  return prisma.emailJob.delete({
    where: {
      id,
    },
  });
}
