"use client";

import Link from "next/link";
import { Email } from "@/types/email";
import Badge from "@/components/ui/Badge";

interface Props {
  email: Email | null;
  detailUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

function formatDate(date?: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleString();
}

export default function EmailDetails({
  email,
  detailUrl,
  onEdit,
  onDelete,
}: Props) {
  if (!email) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="text-center">

          <h2 className="text-xl font-semibold text-gray-700">
            No Email Selected
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Select an email from the left panel.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">

      <div className="flex items-center justify-between">

        <Badge status={email.status} />

        <div className="flex gap-2">

          {detailUrl && (
            <Link
              href={detailUrl}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
            >
              Details
            </Link>
          )}

          {email.status === "PENDING" && onEdit && (
            <button
              onClick={onEdit}
              className="rounded bg-green-600 px-3 py-1 text-sm text-white"
            >
              Edit
            </button>
          )}

          {email.status === "PENDING" && onDelete && (
            <button
              onClick={onDelete}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white"
            >
              Delete
            </button>
          )}

        </div>

      </div>

      <div className="mt-6">

        <h1 className="text-2xl font-semibold">
          {email.subject}
        </h1>

      </div>

      <div className="mt-8 space-y-5">

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            From
          </p>

          <p className="mt-1">
            {email.sender}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            To
          </p>

          <p className="mt-1">
            {email.recipient}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Scheduled
          </p>

          <p className="mt-1">
            {formatDate(email.scheduledAt)}
          </p>
        </div>

      </div>

      <hr className="my-8" />

      <div>

        <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
          Message
        </p>

        <div className="whitespace-pre-wrap leading-7 text-gray-700">
          {email.body}
        </div>

      </div>

    </div>
  );
}