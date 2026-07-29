import Link from "next/link";

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        {title}
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">
        {description}
      </h2>
      {actionLabel && actionHref ? (
        <div className="mt-8">
          <Link
            href={actionHref}
            className="inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
