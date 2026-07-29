"use client";

import Link from "next/link";
import { Email } from "@/types/email";

interface Props {
  email: Email | null;
  detailUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EmailDetails({
  email,
  detailUrl,
  onEdit,
  onDelete,
}: Props) {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-400">Select an email</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border">
        <div className="border-b px-8 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {email.subject}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Scheduled for {new Date(email.scheduledAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {detailUrl ? (
              <Link
                href={detailUrl}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Details
              </Link>
            ) : null}

            {onEdit && email.status === "PENDING" ? (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Edit
              </button>
            ) : null}

            {onDelete && email.status === "PENDING" ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 p-8">
          <div>
            <p className="text-sm text-gray-500">Recipient</p>
            <p className="font-semibold">{email.recipient}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Sender</p>
            <p className="font-semibold">{email.sender}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-flex rounded-full px-3 py-1 mt-2 text-sm font-medium ${
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

          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-semibold">
              {new Date(email.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Updated At</p>
            <p className="font-semibold">
              {new Date(email.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t p-8">
          <p className="text-sm text-gray-500 mb-3">Email Body</p>

          <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap leading-7">
            {email.body}
          </div>
        </div>
      </div>
    </div>
  );
}
