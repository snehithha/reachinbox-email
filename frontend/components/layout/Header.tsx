"use client";

import { Search, SlidersHorizontal, RotateCw } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">

      {/* Search */}
      <div className="relative w-[480px]">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          placeholder="Search"
          className="h-10 w-full rounded-full bg-gray-100 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-5">

        <button>
          <SlidersHorizontal
            size={18}
            className="text-gray-500"
          />
        </button>

        <button>
          <RotateCw
            size={18}
            className="text-gray-500"
          />
        </button>

      </div>
    </header>
  );
}