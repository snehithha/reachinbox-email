export interface Email {
  id: string;
  recipient: string;
  sender: string;
  subject: string;
  body: string;
  status: string;
  scheduledAt: string;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}