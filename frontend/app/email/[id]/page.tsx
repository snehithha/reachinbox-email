"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import EmailDetails from "@/components/email/EmailDetails";
import { Email } from "@/types/email";
import { getEmailById } from "@/services/email";
import Spinner from "@/components/ui/Spinner";
import ErrorCard from "@/components/ui/ErrorCard";

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmail() {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) {
        setError("Invalid email selected.");
        setLoading(false);
        return;
      }

      try {
        const fetched = await getEmailById(id);
        setEmail(fetched);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Unable to load email details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmail();
  }, [params]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center bg-slate-50 p-6">
          <ErrorCard
            title="Unable to load email"
            description={error}
            actionLabel="Back to inbox"
            actionHref="/"
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                ← Back to inbox
              </Link>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                Email details
              </h1>
            </div>
            {email?.status === "PENDING" ? (
              <button
                type="button"
                onClick={() =>
                  router.push(`/email/${params.id}/edit`)
                }
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Edit scheduled email
              </button>
            ) : null}
          </div>

          <EmailDetails
            email={email}
            detailUrl={undefined}
            onEdit={() =>
              email && router.push(`/email/${params.id}/edit`)
            }
          />
        </div>
      </div>
    </MainLayout>
  );
}
