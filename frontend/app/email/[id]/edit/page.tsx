"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import api from "@/services/api";
import { Email } from "@/types/email";
import Spinner from "@/components/ui/Spinner";
import ErrorCard from "@/components/ui/ErrorCard";

const initialForm = {
  recipient: "",
  sender: "",
  subject: "",
  body: "",
  scheduledAt: "",
};

export default function EmailEditPage() {
  const params = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const charCount = useMemo(() => form.body.length, [form.body]);

  useEffect(() => {
    async function loadEmail() {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) {
        setError("Invalid email selected.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<{ success: boolean; email: Email }>(
          `/email/${id}`
        );

        setEmail(res.data.email);
        setForm({
          recipient: res.data.email.recipient,
          sender: res.data.email.sender,
          subject: res.data.email.subject,
          body: res.data.email.body,
          scheduledAt: new Date(res.data.email.scheduledAt)
            .toISOString()
            .slice(0, 16),
        });
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Unable to load email for editing."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmail();
  }, [params]);

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.sender.trim()) nextErrors.sender = "Sender is required.";
    if (!form.recipient.trim()) nextErrors.recipient = "Recipient is required.";
    if (!form.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!form.body.trim()) nextErrors.body = "Email body cannot be empty.";
    if (!form.scheduledAt) nextErrors.scheduledAt = "Scheduled time is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    if (!id) return;

    try {
      setSubmitting(true);

      await api.put(`/email/${id}`, {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });

      toast.success("Email updated successfully.");
      router.push(`/email/${id}`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update email."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center bg-slate-50 p-6">
          <ErrorCard
            title="Unable to load edit page"
            description={error}
            actionLabel="Back to inbox"
            actionHref="/"
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Edit scheduled message
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                  Update email details
                </h1>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/email/${params.id}`)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>

          <form
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
                    <p className="mt-2 text-xs text-red-600">
                      {errors.sender}
                    </p>
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
                    <p className="mt-2 text-xs text-red-600">
                      {errors.recipient}
                    </p>
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
                  <p className="mt-2 text-xs text-red-600">
                    {errors.subject}
                  </p>
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
                  <p>{errors.body || "Edit the email text."}</p>
                  <p>{charCount}/2000</p>
                </div>
              </label>
            </div>

            <div className="space-y-5">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Schedule
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Choose the new send date and time for this email.
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
                    aria-label="Scheduled time"
                  />
                  {errors.scheduledAt ? (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.scheduledAt}
                    </p>
                  ) : null}
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
