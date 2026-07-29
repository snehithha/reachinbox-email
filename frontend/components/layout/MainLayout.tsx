import { ReactNode, Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex flex-1 overflow-hidden bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}