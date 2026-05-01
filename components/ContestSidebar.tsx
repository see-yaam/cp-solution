"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CURRICULUM, getSheetLabel, getSheetDisplayName } from "@/lib/constants";
import { FileText, Award } from "lucide-react";

export default function ContestSidebar() {
  const searchParams = useSearchParams();
  const activeSheet = searchParams.get("sheet") || CURRICULUM[0]?.id || "";

  return (
    <aside className="w-full lg:w-56 xl:w-64 lg:h-full border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 z-20">
      {/* Sidebar Header - Hidden on Mobile */}
      <div className="hidden lg:flex px-4 py-4 border-b border-[var(--border-subtle)]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
          <Award className="w-3.5 h-3.5" />
          Sheets
        </h2>
      </div>

      {/* Sheet List - Horizontal Scroll on Mobile, Vertical on Desktop */}
      <nav className="flex lg:flex-col p-2 gap-1 lg:gap-0.5 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
        {CURRICULUM.map((sheet) => {
          const isActive = sheet.id === activeSheet;
          const label = getSheetLabel(sheet.name);
          const isContest = label.toLowerCase().includes("contest");

          return (
            <Link
              key={sheet.id}
              href={`/contest/assiut?sheet=${sheet.id}`}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shrink-0
                ${isActive
                  ? "bg-[var(--emerald-glow)] text-[var(--emerald)] border border-[var(--border-glow)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(51,65,85,0.2)] border border-transparent"
                }
              `}
            >
              <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[var(--emerald)]" : isContest ? "text-amber-500/70" : "text-[var(--text-muted)]"}`} />
              <span className="truncate max-w-[120px] lg:max-w-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
