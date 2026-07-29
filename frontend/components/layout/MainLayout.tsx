import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        {/* Content */}
        <main className="flex flex-1 overflow-hidden bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}