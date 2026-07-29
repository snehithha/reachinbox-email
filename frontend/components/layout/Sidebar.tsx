"use client";

import {
  MailPlus,
  Clock3,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmails } from "@/services/email";

const menuItems = [
  
  {
    title: "Scheduled",
    icon: Clock3,
    href: "/?filter=scheduled",
  },
  {
    title: "Sent",
    icon: Send,
    href: "/?filter=sent",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [counts, setCounts] = useState({
    scheduled: 0,
    sent: 0,
  });

  useEffect(() => {
    async function load() {
      const emails = await getEmails();

      setCounts({
        scheduled: emails.filter((e) => e.status === "PENDING").length,
        sent: emails.filter((e) => e.status === "SENT").length,
      });
    }

    load();
  }, []);

  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-white">

      {/* Logo */}
      <div className="border-b px-8 py-7">

        <h2 className="text-2xl font-bold tracking-wide text-gray-900">
          ReachInbox
        </h2>

      </div>

      <div className="border-b p-5">

    <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-3 hover:bg-gray-50">

        <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-lg font-semibold text-white">
                S
            </div>

            <div className="text-left">

                <p className="text-sm font-semibold">
                    Snehithha
                </p>

                <p className="text-xs text-gray-500">
                    snehithha@gmail.com
                </p>

            </div>

        </div>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>

    </button>

</div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        <Link
    href="/compose"
    className="mb-6 flex h-11 items-center justify-center rounded-full border border-green-600 font-medium text-green-600 transition hover:bg-green-50"
>
    Compose
</Link>

<p className="mb-3 mt-2 px-2 text-[10px] uppercase tracking-widest text-gray-400">
    CORE
</p>
        {menuItems.map((item) => {

          const active =
            pathname === item.href ||
            (item.href.includes("filter") &&
              searchParams.get("filter") === item.href.split("=")[1]);

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`mb-2 flex items-center justify-between rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-green-50 text-green-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">

                <item.icon size={18} />

                <span>{item.title}</span>

              </div>

              {item.title === "Scheduled" && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {counts.scheduled}
                </span>
              )}

              {item.title === "Sent" && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {counts.sent}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      
    </aside>
  );
}