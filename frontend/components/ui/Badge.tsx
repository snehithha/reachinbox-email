import clsx from "clsx";

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  SENT: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-700",
};

interface Props {
  status: string;
}

export default function Badge({ status }: Props) {
  const normalized = status?.toUpperCase() ?? "";
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        statusColors[normalized] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {normalized}
    </span>
  );
}
