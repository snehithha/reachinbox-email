"use client";

import { Dispatch, SetStateAction } from "react";
import EmailListItem from "@/components/email/EmailListItem";
import { Email } from "@/types/email";
import EmptyState from "@/components/ui/EmptyState";
import ErrorCard from "@/components/ui/ErrorCard";
import Spinner from "@/components/ui/Spinner";

interface Props {
  emails: Email[];
  selectedEmail: Email | null;
  setSelectedEmail: Dispatch<SetStateAction<Email | null>>;
  loading: boolean;
  error: string | null;
  emptyLabel: string;
}

export default function EmailList({
  emails,
  selectedEmail,
  setSelectedEmail,
  loading,
  error,
  emptyLabel,
}: Props) {
  if (loading) {
    return (
      <div className="w-full max-w-sm border-r border-slate-200 bg-white p-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <Spinner />
          <p className="mt-4 text-sm text-slate-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-sm border-r border-slate-200 bg-white p-6">
        <ErrorCard
          title="Unable to load emails"
          description={error}
        />
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className="w-full max-w-sm border-r border-slate-200 bg-white p-6">
        <EmptyState
          title={emptyLabel}
          description="No messages match your current search and filter."
          actionLabel="Compose email"
          actionHref="/compose"
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
      <div className="space-y-3">
        {emails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            selected={selectedEmail?.id === email.id}
            onSelect={() => setSelectedEmail(email)}
          />
        ))}
      </div>
    </div>
  );
}
