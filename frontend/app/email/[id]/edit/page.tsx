"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import api from "@/services/api";
import { Email } from "@/types/email";

export default function EmailEditPage() {
  const params = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    recipient: "",
    sender: "",
    subject: "",
    body: "",
    scheduledAt: "",
  });

  useEffect(() => {
    async function loadEmail() {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) {
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
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load email for editing."
        );
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadEmail();
  }, [params, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    if (!id) {
      return;
    }

    try {
      setSubmitting(true);

      await api.put(`/email/${id}`, {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });

      toast.success("Email updated successfully.");
      router.push(`/email/${params.id}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update email."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          Loading edit form...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-full bg-white p-8">
        <div className="border-b pb-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Edit Scheduled Email
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Only pending emails can be updated.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/email/${params.id}`)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-12 gap-8"
        >
          <div className="col-span-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From
              </label>
              <input
                className="mt-2 w-full rounded-lg border p-3"
                value={form.sender}
                onChange={(e) =>
                  setForm({ ...form, sender: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                To
              </label>
              <input
                className="mt-2 w-full rounded-lg border p-3"
                value={form.recipient}
                onChange={(e) =>
                  setForm({ ...form, recipient: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                className="mt-2 w-full rounded-lg border p-3"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Body
              </label>
              <textarea
                rows={12}
                className="mt-2 w-full resize-none rounded-xl border p-4"
                value={form.body}
                onChange={(e) =>
                  setForm({ ...form, body: e.target.value })
                }
              />
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="rounded-xl border bg-gray-50 p-6">
              <label className="block text-sm font-medium text-gray-700">
                Scheduled At
              </label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-lg border bg-white p-3"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm({ ...form, scheduledAt: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
