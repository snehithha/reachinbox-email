"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import EmailDetails from "@/components/email/EmailDetails";
import { Email } from "@/types/email";
import { getEmailById } from "@/services/email";

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmail() {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) {
        return;
      }

      try {
        const fetched = await getEmailById(id);
        setEmail(fetched);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load email details."
        );
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadEmail();
  }, [params, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          Loading email details...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-full bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to inbox
            </Link>
            <h1 className="text-2xl font-semibold mt-2">
              Email details
            </h1>
          </div>

          {email?.status === "PENDING" ? (
            <button
              type="button"
              onClick={() =>
                router.push(`/email/${params.id}/edit`)
              }
              className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Edit scheduled email
            </button>
          ) : null}
        </div>

        <EmailDetails
          email={email}
          detailUrl={undefined}
          onEdit={() =>
            email &&
            router.push(`/email/${params.id}/edit`)
          }
        />
      </div>
    </MainLayout>
  );
}
