import Link from 'next/link';
import { Folder } from 'lucide-react';

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

async function getFolders() {
  const res = await fetch('https://api.github.com/repos/see-yaam/ICPC-assiut-university-solutions/contents', {
    next: { revalidate: 3600 } // cache for an hour
  });
  if (!res.ok) {
    console.error('Failed to fetch data');
    return [];
  }
  const data: GitHubContent[] = await res.json();
  return data.filter(item => item.type === 'dir' || item.name.toLowerCase().includes('sheet') || item.name.toLowerCase().includes('contest'));
}

export default async function Sidebar() {
  const folders = await getFolders();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-gray-50 z-10">
        <h1 className="text-xl font-bold text-gray-800">CP Explorer</h1>
      </div>
      <nav className="p-3 space-y-1">
        {folders.map((folder) => (
          <Link
            key={folder.sha}
            href={`/?folder=${encodeURIComponent(folder.path)}`}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            <Folder className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{folder.name}</span>
          </Link>
        ))}
        {folders.length === 0 && (
          <p className="text-sm text-gray-500 px-3 py-2">No folders found or rate limited.</p>
        )}
      </nav>
    </aside>
  );
}
