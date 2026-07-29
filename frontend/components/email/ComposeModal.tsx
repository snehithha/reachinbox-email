"use client";

import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ComposeModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    recipient: "",
    subject: "",
    sender: "",
    body: "",
    scheduledAt: "",
  });

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      };

      await api.post("/email/schedule", payload);

      toast.success("Email scheduled successfully!");

      setForm({
        recipient: "",
        subject: "",
        sender: "",
        body: "",
        scheduledAt: "",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Backend Error:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          "Failed to schedule email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold">Schedule Email</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Recipient
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.recipient}
              onChange={(e) =>
                setForm({ ...form, recipient: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Subject
            </label>
            <input
              type="text"
              placeholder="Email Subject"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Sender
            </label>
            <input
              type="email"
              placeholder="sender@example.com"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.sender}
              onChange={(e) =>
                setForm({ ...form, sender: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Schedule Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({
                  ...form,
                  scheduledAt: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Email Body
            </label>
            <textarea
              rows={6}
              placeholder="Write your email..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.body}
              onChange={(e) =>
                setForm({ ...form, body: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Scheduling..." : "Schedule Email"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}