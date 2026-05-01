"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CURRICULUM, getSheetLabel, getSheetDisplayName } from "@/lib/constants";
import { FileText, Award } from "lucide-react";

export default function ContestSidebar() {
  const searchParams = useSearchParams();
  const activeSheet = searchParams.get("sheet") || CURRICULUM[0]?.id || "";

  return (
    <aside className="w-56 xl:w-64 h-full overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
      {/* Sidebar Header */}
      <div className="px-4 py-4 border-b border-[var(--border-subtle)]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
          <Award className="w-3.5 h-3.5" />
          Sheets
        </h2>
      </div>

      {/* Sheet List */}
      <nav className="p-2 space-y-0.5">
        {CURRICULUM.map((sheet) => {
          const isActive = sheet.id === activeSheet;
          const label = getSheetLabel(sheet.name);
          const isContest = label.toLowerCase().includes("contest");

          return (
            <Link
              key={sheet.id}
              href={`/contest/assiut?sheet=${sheet.id}`}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-[var(--emerald-glow)] text-[var(--emerald)] border border-[var(--border-glow)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(51,65,85,0.2)]"
                }
              `}
            >
              <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[var(--emerald)]" : isContest ? "text-amber-500/70" : "text-[var(--text-muted)]"}`} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
