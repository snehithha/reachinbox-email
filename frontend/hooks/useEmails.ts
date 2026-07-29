"use client";

import { useEffect, useMemo, useState } from "react";
import { getEmails } from "@/services/email";
import { Email } from "@/types/email";

export interface EmailStats {
  total: number;
  pending: number;
  scheduled: number;
  sent: number;
  failed: number;
  cancelled: number;
}

export default function useEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadEmails() {
    setLoading(true);
    setError(null);

    try {
      const response = await getEmails();
      setEmails(response);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to load emails."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmails();
  }, []);

  const stats = useMemo<EmailStats>(() => {
    const counts = {
      total: emails.length,
      pending: 0,
      scheduled: 0,
      sent: 0,
      failed: 0,
      cancelled: 0,
    };

    emails.forEach((email) => {
      const status = email.status?.toUpperCase();
      if (status === "PENDING") counts.pending += 1;
      else if (status === "SCHEDULED") counts.scheduled += 1;
      else if (status === "SENT") counts.sent += 1;
      else if (status === "FAILED") counts.failed += 1;
      else if (status === "CANCELLED") counts.cancelled += 1;
    });

    return counts;
  }, [emails]);

  return {
    emails,
    loading,
    error,
    refresh: loadEmails,
    stats,
  };
}
