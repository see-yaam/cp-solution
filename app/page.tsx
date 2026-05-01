import ProblemList from "@/components/ProblemList";
import { FolderOpen } from "lucide-react";
import { CURRICULUM } from "@/constants/data";

async function getFiles(folderPath: string) {
  const encodedPath = encodeURIComponent(folderPath);
  const res = await fetch(
    `https://api.github.com/repos/see-yaam/ICPC-assiut-university-solutions/contents/${encodedPath}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  
  return data.filter((item: any) => {
    if (item.type !== "file") return false;
    const lowerName = item.name.toLowerCase();
    return lowerName.endsWith('.cpp') || lowerName.endsWith('.c') || lowerName.endsWith('.py');
  });
}

export default async function Home(
  props: { searchParams: Promise<{ folder?: string }> }
) {
  const searchParams = await props.searchParams;
  const folder = searchParams.folder;

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 p-8 text-center min-h-[80vh]">
        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-4">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Select a folder
        </h2>
        <p className="max-w-md">
          Choose a folder from the sidebar to view the competitive programming curriculum and solutions.
        </p>
      </div>
    );
  }

  const decodedFolderName = decodeURIComponent(folder);
  const files = await getFiles(folder);

  // Find matching curriculum sheet
  const sheet = CURRICULUM.find(s => 
    decodedFolderName.toLowerCase().includes(s.name.toLowerCase()) || 
    s.name.toLowerCase().includes(decodedFolderName.toLowerCase())
  );
  
  const problems = sheet ? sheet.problems.map(prob => {
    // Look for a file starting with the problem letter
    const regex = new RegExp(`^${prob.letter}[_\\.]`, 'i');
    const matchedFile = files.find((f: any) => regex.test(f.name) || f.name.toUpperCase().startsWith(prob.letter));
    
    return {
      letter: prob.letter,
      name: prob.name,
      status: matchedFile ? "uploaded" : "pending",
      file: matchedFile || null
    };
  }) : files.map((f: any) => {
    const letterMatch = f.name.match(/^([A-Za-z])/);
    const letter = letterMatch ? letterMatch[1].toUpperCase() : "?";
    return {
      letter,
      name: f.name,
      status: "uploaded",
      file: f
    }
  });

  const contestId = sheet?.contestId || "";

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 py-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {sheet ? sheet.name : decodedFolderName}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1.5">
          <span className="text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
            {problems.filter(p => p.status === 'uploaded').length} / {problems.length}
          </span> solutions uploaded
        </p>
      </div>
      {/* @ts-ignore */}
      <ProblemList problems={problems} folderName={decodedFolderName} contestId={contestId} />
    </div>
  );
}
