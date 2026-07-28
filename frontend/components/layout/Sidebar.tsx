import {
  LayoutDashboard,
  Mail,
  Send,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule Email",
    icon: Mail,
  },
  {
    title: "Sent Emails",
    icon: Send,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">
          Outbox
        </h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.title}
            className="flex items-center gap-3 w-full px-6 py-3 hover:bg-gray-100 transition"
          >
            <item.icon size={18} />
            {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}