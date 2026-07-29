"use client";

import { Email } from "@/types/email";
import { Star } from "lucide-react";
import clsx from "clsx";

interface Props {
  email: Email;
  selected: boolean;
  onSelect: () => void;
}

export default function EmailListItem({
  email,
  selected,
  onSelect,
}: Props) {
  const badgeColor = {
    PENDING: "bg-orange-100 text-orange-600",
    SENT: "bg-green-100 text-green-600",
    FAILED: "bg-red-100 text-red-600",
    SCHEDULED: "bg-blue-100 text-blue-600",
  }[email.status] ?? "bg-slate-100 text-slate-600";

  return (
  <button
    onClick={onSelect}
    className={clsx(
      "w-full rounded-lg border px-4 py-3 text-left transition",
      selected
        ? "border-green-500 bg-green-50"
        : "border-gray-200 bg-white hover:bg-gray-50"
    )}
  >
    <div className="flex items-start justify-between">

      <div className="flex gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
          {email.recipient.charAt(0).toUpperCase()}
        </div>

        <div>

          <h3 className="font-medium text-sm">
            {email.recipient}
          </h3>

          <p className="mt-1 text-xs text-gray-500 truncate w-52">
            {email.subject}
          </p>

        </div>

      </div>

      <Star
        size={16}
        className="text-gray-400"
      />

    </div>

    <div className="mt-3 flex items-center justify-between">

      <span
        className={clsx(
          "rounded-full px-2 py-1 text-[10px] font-semibold",
          badgeColor
        )}
      >
        {email.status}
      </span>

      <span className="text-xs text-gray-400">
        {new Date(email.scheduledAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>

    </div>
  </button>
);
}