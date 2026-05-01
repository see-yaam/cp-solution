import { Suspense } from "react";
import ContestSidebar from "@/components/ContestSidebar";
import ProblemList from "@/components/ProblemList";
import { CURRICULUM, getSheetDisplayName, getCodeforcesLink } from "@/lib/constants";

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

async function getFiles(folderPath: string): Promise<GitHubFile[]> {
  const encodedPath = encodeURIComponent(folderPath);
  try {
    const res = await fetch(
      `https://api.github.com/repos/see-yaam/ICPC-assiut-university-solutions/contents/${encodedPath}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.filter((item: GitHubFile) => {
      if (item.type !== "file") return false;
      const lowerName = item.name.toLowerCase();
      return lowerName.endsWith(".cpp") || lowerName.endsWith(".c") || lowerName.endsWith(".py");
    });
  } catch {
    return [];
  }
}

/**
 * Find the matching GitHub folder name for a sheet.
 */
async function getGitHubFolders(): Promise<GitHubFile[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/see-yaam/ICPC-assiut-university-solutions/contents",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: GitHubFile[] = await res.json();
    return data.filter((item) => item.type === "dir");
  } catch {
    return [];
  }
}

function matchFolderToSheet(folders: GitHubFile[], sheetName: string): string | null {
  const lower = sheetName.toLowerCase();
  const folder = folders.find(
    (f) =>
      f.name.toLowerCase().includes(lower) ||
      lower.includes(f.name.toLowerCase())
  );
  return folder?.path || null;
}

export default async function AssiutDashboard(
  props: { searchParams: Promise<{ sheet?: string }> }
) {
  const searchParams = await props.searchParams;
  const sheetId = searchParams.sheet || CURRICULUM[0]?.id || "sheet-1";
  const sheet = CURRICULUM.find((s) => s.id === sheetId) || CURRICULUM[0];

  // Get GitHub folder structure
  const folders = await getGitHubFolders();

  // Find matching folder for this sheet
  const folderPath = matchFolderToSheet(folders, sheet.name);
  const files = folderPath ? await getFiles(folderPath) : [];

  // Build problem list with status
  const problems = sheet.problems.map((prob) => {
    // Match files by extracting the letter from filename using .split('_')[0]
    // e.g. "A_Say_Hello.cpp" → "A", "K_Max_and_Min.c" → "K"
    const matchedFile = files.find((f) => {
      const fileLetter = f.name.split("_")[0].toUpperCase();
      return fileLetter === prob.letter.toUpperCase();
    });

    return {
      letter: prob.letter,
      name: prob.name,
      status: (matchedFile ? "uploaded" : "pending") as "uploaded" | "pending",
      file: matchedFile || null,
    };
  });

  const uploadedCount = problems.filter((p) => p.status === "uploaded").length;

  return (
    <>
      {/* Sidebar */}
      <Suspense fallback={<div className="w-full lg:w-56 xl:w-64 h-12 lg:h-full bg-[var(--bg-surface)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]" />}>
        <ContestSidebar />
      </Suspense>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Sheet Header */}
        <div className="px-6 lg:px-8 py-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                {getSheetDisplayName(sheet.name)}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--emerald)] font-semibold">{uploadedCount}</span>
                  <span className="text-[var(--text-muted)]"> / {problems.length} solutions</span>
                </span>
                {/* Progress bar */}
                <div className="w-24 h-1.5 bg-[rgba(51,65,85,0.3)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--emerald)] to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${problems.length > 0 ? (uploadedCount / problems.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="p-4 lg:p-6">
          {/* @ts-ignore */}
          <ProblemList
            problems={problems}
            folderName={getSheetDisplayName(sheet.name)}
            contestId={sheet.contestId}
          />
        </div>
      </main>
    </>
  );
}
