import api from "./api";
import { Email } from "@/types/email";

export interface EmailPayload {
  recipient: string;
  sender: string;
  subject: string;
  body: string;
  scheduledAt: string;
}

export async function getEmails(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await api.get<{ success: boolean; emails: Email[] }>(`/email${query}`);
  return res.data.emails;
}

export async function getEmailById(id: string) {
  const res = await api.get<{ success: boolean; email: Email }>(`/email/${id}`);
  return res.data.email;
}

export async function updateEmailById(id: string, payload: EmailPayload) {
  const res = await api.put<{ success: boolean; email: Email }>(`/email/${id}`, payload);
  return res.data.email;
}

export async function deleteEmailById(id: string) {
  const res = await api.delete<{ success: boolean }>(`/email/${id}`);
  return res.data;
}
