import {
  LayoutDashboard,
  Mail,
  Send,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Schedule Email",
    icon: Mail,
    href: "/compose",
  },
  {
    title: "Sent Emails",
    icon: Send,
    href: "/sent",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r flex flex-col h-screen">
      <div className="p-8 border-b">
        <h1 className="text-3xl font-bold text-green-700">
          Outbox
        </h1>
      </div>

      <nav className="flex-1 mt-6 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`flex items-center gap-4 rounded-xl px-4 py-4 mb-2 transition

            ${
              item.title === "Schedule Email"
                ? "bg-green-100 text-green-700 font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <item.icon size={20} />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
            S
          </div>

          <div>
            <p className="font-medium">Snehithha</p>
            <p className="text-sm text-gray-500">
              Logged in
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}