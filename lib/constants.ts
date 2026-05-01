import { CURRICULUM, type Sheet, type Problem } from "@/constants/data";

// ===== Contest Metadata =====
export interface Contest {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  emoji: string;
  sheetCount: number;
}

export const CONTESTS: Contest[] = [
  {
    slug: "assiut",
    name: "ICPC Assiut University Training",
    shortName: "Assiut ICPC",
    description: "A comprehensive competitive programming curriculum covering data types, loops, arrays, strings, functions, recursion, and more.",
    emoji: "🏆",
    sheetCount: CURRICULUM.length,
  },
];

// ===== Helpers =====

/**
 * Build a Codeforces problem URL for the Assiut group.
 */
export function getCodeforcesLink(contestId: string, letter: string): string {
  return `https://codeforces.com/group/MWSDmqGsZm/contest/${contestId}/problem/${letter}`;
}

/**
 * Get a pretty display name for a sheet (strip numbering prefix).
 */
export function getSheetDisplayName(name: string): string {
  return name.replace(/^\d+\.\s*/, "");
}

/**
 * Extract the short label from a sheet name, e.g. "Sheet #1" or "Contest #2".
 */
export function getSheetLabel(name: string): string {
  const match = name.match(/(Sheet\s*#\d+|Contest\s*#[\d.]+)/i);
  return match ? match[1] : name.replace(/^\d+\.\s*/, "");
}

// Re-export types and data
export { CURRICULUM, type Sheet, type Problem };
