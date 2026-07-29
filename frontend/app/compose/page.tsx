"use client";

import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";

export default function ComposePage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    recipient: "",
    subject: "",
    sender: "",
    body: "",
    scheduledAt: "",
  });

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
    <div className="h-full bg-white">
      {/* Top Bar */}
      <div className="border-b px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl hover:text-green-700 transition"
          >
            ←
          </Link>

          <h1 className="text-2xl font-semibold">
            Compose Email
          </h1>
        </div>

        <button
          form="compose-form"
          type="submit"
          disabled={loading}
          className="rounded-full bg-green-600 px-8 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Body */}
      <form
        id="compose-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-8 p-8"
      >
        {/* Left Side */}
        <div className="col-span-8 space-y-6">

          <input
            placeholder="From"
            value={form.sender}
            onChange={(e) =>
              setForm({ ...form, sender: e.target.value })
            }
            className="w-full border-b py-3 outline-none text-lg"
          />

          <input
            placeholder="To"
            value={form.recipient}
            onChange={(e) =>
              setForm({ ...form, recipient: e.target.value })
            }
            className="w-full border-b py-3 outline-none text-lg"
          />

          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            className="w-full border-b py-3 outline-none text-lg"
          />

          <textarea
            rows={16}
            placeholder="Write your email..."
            value={form.body}
            onChange={(e) =>
              setForm({ ...form, body: e.target.value })
            }
            className="w-full resize-none rounded-xl border p-5 outline-none"
          />
        </div>

        {/* Right Side */}
        <div className="col-span-4">
          <div className="rounded-xl border bg-gray-50 p-6">
            <h2 className="text-lg font-semibold mb-5">
              Send Later
            </h2>

            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({
                  ...form,
                  scheduledAt: e.target.value,
                })
              }
              className="w-full rounded-lg border bg-white p-3"
            />
          </div>
        </div>
      </form>
    </div>
  </MainLayout>
);
}