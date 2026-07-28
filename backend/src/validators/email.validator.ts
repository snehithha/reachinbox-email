import { z } from "zod";

export const scheduleEmailSchema = z.object({
  recipient: z.string().email(),

  subject: z.string().min(1).max(200),

  body: z.string().min(1),

  sender: z.string().min(1),

  scheduledAt: z.string().datetime(),

  
});