"use client";

import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import EmailList from "@/components/email/EmailList";
import EmailDetails from "@/components/email/EmailDetails";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { Email } from "@/types/email";
import { deleteEmailById } from "@/services/email";
import useEmails from "@/hooks/useEmails";
import { useRouter, useSearchParams } from "next/navigation";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Sent", value: "SENT" },
  { label: "Failed", value: "FAILED" },
];

const searchParams = useSearchParams();

export default function HomeContent() {
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
  const filter = searchParams.get("filter");

  switch (filter) {
    case "sent":
      setStatusFilter("SENT");
      break;

    case "scheduled":
      setStatusFilter("PENDING"); // or "SCHEDULED" if that's how your app stores scheduled emails
      break;

    case "failed":
      setStatusFilter("FAILED");
      break;

    default:
      setStatusFilter("all");
  }
}, [searchParams]);
  const [showDelete, setShowDelete] = useState(false);

  const { emails, loading, error, refresh, stats } = useEmails();

  const filteredEmails = useMemo(
    () =>
      emails.filter((email) => {
        const matchesStatus =
          statusFilter === "all" || email.status === statusFilter;
        const query = searchText.toLowerCase();
        const matchesSearch =
          email.recipient.toLowerCase().includes(query) ||
          email.sender.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
      }),
    [emails, searchText, statusFilter]
  );

  const emptyLabel = searchText
    ? "No search results"
    : "No emails found";

  async function handleDelete() {
    if (!selectedEmail) return;

    try {
      await deleteEmailById(selectedEmail.id);
      toast.success("Email deleted.");
      setSelectedEmail(null);
      refresh();
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete email."
      );
    } finally {
      setShowDelete(false);
    }
  }

  return (
    <MainLayout>
      <div className="flex h-full flex-col gap-6 p-6 lg:p-8">
        <div className="mb-6">
  <h1 className="text-2xl font-semibold text-slate-900">
    Inbox
  </h1>

  <p className="text-sm text-slate-500 mt-1">
    {filteredEmails.length} messages
  </p>
</div>
        <div className="grid flex-1 overflow-hidden gap-6 xl:grid-cols-[420px_1fr]">
          <EmailList
            emails={filteredEmails}
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            loading={loading}
            error={error}
            emptyLabel={emptyLabel}
          />

          <div className="rounded-x1 border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b p-6">
              <div>
                <p className="text-sm text-slate-500">Message preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedEmail ? "Selected message" : "Preview"}
                </h2>
              </div>
              {selectedEmail?.status === "PENDING" ? (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto">
            {selectedEmail ? (
              <EmailDetails
                email={selectedEmail}
                detailUrl={`/email/${selectedEmail.id}`}
                onEdit={() =>
                  router.push(`/email/${selectedEmail.id}/edit`)
                }
                onDelete={() => setShowDelete(true)}
              />
            ) : (
              <EmptyState
                title="No email selected"
                description="Select a message from the list to preview the details."
              />
            )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showDelete}
        title="Delete scheduled email"
        description="Are you sure you want to delete this pending email? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </MainLayout>
  );
}
