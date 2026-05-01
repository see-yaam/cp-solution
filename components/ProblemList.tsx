"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import CodeViewerModal from "./CodeViewerModal";
import { getCodeforcesLink } from "@/lib/constants";

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
}

export interface ProblemData {
  letter: string;
  name: string;
  status: "uploaded" | "pending";
  file: GitHubFile | null;
}

export default function ProblemList({
  problems,
  folderName,
  contestId,
}: {
  problems: ProblemData[];
  folderName: string;
  contestId: string;
}) {
  const [selectedProblem, setSelectedProblem] = useState<ProblemData | null>(null);

  if (!problems || problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(51,65,85,0.2)] flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-[var(--text-muted)] text-sm">No problems found for this sheet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl">
        <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-card)] backdrop-blur-sm">
          {problems.map((problem, index) => {
            const isUploaded = problem.status === "uploaded";
            const isLast = index === problems.length - 1;
            const cfLink = getCodeforcesLink(contestId, problem.letter);

            return (
              <div
                key={problem.letter + problem.name}
                onClick={() => isUploaded && setSelectedProblem(problem)}
                className={`
                  flex items-center justify-between px-4 sm:px-5 py-3 group transition-all duration-200
                  ${!isLast ? "border-b border-[rgba(51,65,85,0.3)]" : ""}
                  ${isUploaded
                    ? "cursor-pointer hover:bg-[rgba(16,185,129,0.04)]"
                    : "opacity-60"
                  }
                `}
              >
                {/* Left: "A. Problem Name" */}
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-4">
                  <span className={`
                    text-sm font-bold shrink-0
                    ${isUploaded ? "text-[var(--emerald)]" : "text-[var(--text-muted)]"}
                  `}>
                    {problem.letter}.
                  </span>
                  <span className={`
                    text-sm font-medium truncate transition-colors
                    ${isUploaded
                      ? "text-[#e2e8f0] group-hover:text-white"
                      : "text-[var(--text-muted)]"
                    }
                  `}>
                    {problem.name}
                  </span>
                </div>

                {/* Right: CF Link + Status dot */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* CF Link */}
                  <a
                    href={cfLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-[var(--text-muted)] hover:text-blue-400 rounded-md transition-colors hover:bg-[rgba(51,65,85,0.3)]"
                    title="Open on Codeforces"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Status dot */}
                  <div className={isUploaded ? "neon-dot" : "neon-dot-gray"} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CodeViewerModal
        isOpen={!!selectedProblem}
        onClose={() => setSelectedProblem(null)}
        problem={selectedProblem}
        folderName={folderName}
        contestId={contestId}
      />
    </>
  );
}
