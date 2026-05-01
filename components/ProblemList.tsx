"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import CodeViewerModal from "./CodeViewerModal";

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
  contestId
}: {
  problems: ProblemData[];
  folderName: string;
  contestId: string;
}) {
  const [selectedProblem, setSelectedProblem] = useState<ProblemData | null>(null);

  if (!problems || problems.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        No problems found.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
          {problems.map((problem, index) => {
            const isUploaded = problem.status === "uploaded";
            const isLast = index === problems.length - 1;
            
            return (
              <div
                key={problem.letter + problem.name}
                onClick={() => setSelectedProblem(problem)}
                className={`flex items-center justify-between px-5 py-3.5 group cursor-pointer transition-colors ${
                  !isLast ? "border-b border-slate-100 dark:border-slate-800/60" : ""
                } hover:bg-slate-50 dark:hover:bg-slate-900`}
              >
                {/* Left Side: ID & Name */}
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="w-6 text-sm font-semibold text-slate-400 dark:text-slate-500 text-right shrink-0">
                    {problem.letter}
                  </div>
                  <div className={`text-sm font-medium truncate ${
                    isUploaded ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {problem.name}
                  </div>
                </div>

                {/* Right Side: Status & Link */}
                <div className="flex items-center gap-6 shrink-0">
                  {/* Status Indicator */}
                  <div className="hidden sm:flex items-center gap-2 w-28">
                    {isUploaded ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Available</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Pending</span>
                      </>
                    )}
                  </div>

                  {/* Codeforces Link */}
                  <a
                    href={`https://codeforces.com/group/MWSDmqGsZm/contest/${contestId}/problem/${problem.letter}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    title="View on Codeforces"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
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
