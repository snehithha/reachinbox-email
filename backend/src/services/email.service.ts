import prisma from "../config/prisma";

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
      status: "PENDING",
    },
  });
}