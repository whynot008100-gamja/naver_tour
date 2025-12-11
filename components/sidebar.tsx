"use client";

import { TourSearch } from "./tour-search";
import { TourFilters } from "./tour-filters";

export function Sidebar() {
  return (
    <aside className="w-full h-full p-6 pt-6 space-y-8 overflow-y-auto bg-card/30 backdrop-blur-sm">
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground/90">검색 및 필터</h2>
        <div className="space-y-6">
          <TourSearch />
          <TourFilters />
        </div>
      </div>
    </aside>
  );
}
