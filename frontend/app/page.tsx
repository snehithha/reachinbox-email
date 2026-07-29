"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MainLayout from "@/components/layout/MainLayout";
import EmailList from "@/components/email/EmailList";
import EmailDetails from "@/components/email/EmailDetails";
import { Email } from "@/types/email";
import { deleteEmailById } from "@/services/email";


export default function Home() {
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] =
    useState<Email | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete() {
    if (!selectedEmail) return;

    if (!confirm("Delete this scheduled email?")) {
      return;
    }

    try {
      await deleteEmailById(selectedEmail.id);
      toast.success("Email deleted.");
      setSelectedEmail(null);
      setRefreshKey((prev) => prev + 1);
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete email."
      );
    }
  }

  return (
    <MainLayout>
      <div className="flex h-full">
        <EmailList
          selectedEmail={selectedEmail}
          setSelectedEmail={setSelectedEmail}
          refreshKey={refreshKey}
        />

        <EmailDetails
          email={selectedEmail}
          detailUrl={selectedEmail ? `/email/${selectedEmail.id}` : undefined}
          onEdit={() =>
            selectedEmail &&
            router.push(`/email/${selectedEmail.id}/edit`)
          }
          onDelete={handleDelete}
        />
      </div>
    </MainLayout>
  );
}