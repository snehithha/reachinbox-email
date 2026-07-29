export interface Email {
  id: string;
  recipient: string;
  sender: string;
  subject: string;
  body: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}