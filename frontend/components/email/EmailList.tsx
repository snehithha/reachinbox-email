"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Email } from "@/types/email";

interface Props {
  selectedEmail: Email | null;
  setSelectedEmail: React.Dispatch<React.SetStateAction<Email | null>>;
  refreshKey?: number;
}

export default function EmailList({
  selectedEmail,
  setSelectedEmail,
  refreshKey,
}: Props) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmails() {
      try {
        const res = await api.get("/email");

        const emailList = Array.isArray(res.data.emails)
          ? res.data.emails
          : [];

        setEmails(emailList);

        if (emailList.length > 0 && !selectedEmail) {
          setSelectedEmail(emailList[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadEmails();
  }, [refreshKey, selectedEmail, setSelectedEmail]);

  if (loading) {
    return (
      <div className="w-80 border-r bg-white p-6">
        Loading emails...
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-white overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">
          Scheduled Emails
        </h2>
      </div>

      {emails.map((email) => (
        <div
  key={email.id}
  onClick={() => setSelectedEmail(email)}
  className={`border-b p-4 cursor-pointer transition ${
    selectedEmail?.id === email.id
      ? "bg-green-50 border-l-4 border-green-500"
      : "hover:bg-gray-50"
  }`}
>
  <h3 className="font-semibold text-gray-800 truncate">
    {email.recipient}
  </h3>

  <p className="text-sm text-gray-600 mt-1 truncate">
    {email.subject}
  </p>

  <p className="text-xs text-gray-400 mt-2">
    {new Date(email.scheduledAt).toLocaleString()}
  </p>

  <span
    className={`inline-flex mt-3 rounded-full px-3 py-1 text-xs font-medium ${
      email.status === "SENT"
        ? "bg-green-100 text-green-700"
        : email.status === "PENDING"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {email.status}
  </span>
</div>
      ))}
    </div>
  );
}