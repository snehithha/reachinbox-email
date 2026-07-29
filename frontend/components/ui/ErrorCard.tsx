import Link from "next/link";

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function ErrorCard({
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="max-w-xl rounded-[32px] border border-red-200 bg-white p-8 text-center shadow-sm">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <span>!</span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-slate-900">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
