"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Spinner from "@/components/ui/Spinner";

const initialState = {
  recipient: "",
  subject: "",
  sender: "",
  body: "",
  scheduledAt: "",
};

export default function ComposePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const charCount = useMemo(() => form.body.length, [form.body]);

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.sender.trim()) nextErrors.sender = "Sender is required.";
    if (!form.recipient.trim()) nextErrors.recipient = "Recipient is required.";
    if (!form.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!form.body.trim()) nextErrors.body = "Email body cannot be empty.";
    if (!form.scheduledAt) nextErrors.scheduledAt = "Scheduled date and time are required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/email/schedule", {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });

      toast.success("Email scheduled successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to schedule email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Compose new email
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Schedule a message
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="compose-form"
                disabled={loading}
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Scheduling..." : "Schedule Email"}
              </button>
            </div>
          </div>

          <form
            id="compose-form"
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-[2fr_1fr]"
          >
            <div className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    From
                  </span>
                  <input
                    value={form.sender}
                    onChange={(event) =>
                      setForm({ ...form, sender: event.target.value })
                    }
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    aria-label="Sender email"
                  />
                  {errors.sender ? (
                    <p className="mt-2 text-xs text-red-600">{errors.sender}</p>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    To
                  </span>
                  <input
                    value={form.recipient}
                    onChange={(event) =>
                      setForm({ ...form, recipient: event.target.value })
                    }
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    aria-label="Recipient email"
                  />
                  {errors.recipient ? (
                    <p className="mt-2 text-xs text-red-600">{errors.recipient}</p>
                  ) : null}
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Subject
                </span>
                <input
                  value={form.subject}
                  onChange={(event) =>
                    setForm({ ...form, subject: event.target.value })
                  }
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  aria-label="Email subject"
                />
                {errors.subject ? (
                  <p className="mt-2 text-xs text-red-600">{errors.subject}</p>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Message
                </span>
                <textarea
                  rows={12}
                  value={form.body}
                  onChange={(event) =>
                    setForm({ ...form, body: event.target.value })
                  }
                  className="mt-2 w-full resize-none rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  aria-label="Email body"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <p>{errors.body || "Write the message content."}</p>
                  <p>{charCount}/2000</p>
                </div>
              </label>
            </div>

            <div className="space-y-5">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Schedule details</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Pick the date and time when the email should be sent.
                </p>

                <label className="mt-5 block">
                  <span className="text-sm font-semibold text-slate-700">
                    Send time
                  </span>
                  <input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        scheduledAt: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    aria-label="Scheduled send time"
                  />
                  {errors.scheduledAt ? (
                    <p className="mt-2 text-xs text-red-600">{errors.scheduledAt}</p>
                  ) : null}
                </label>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Tips</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>Use a clear subject line.</li>
                  <li>Keep message content concise.</li>
                  <li>Choose a future date and time.</li>
                </ul>
              </div>
            </div>
          </form>

          {loading ? (
            <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <Spinner />
            </div>
          ) : null}
        </div>
      </div>
    </MainLayout>
  );
}
