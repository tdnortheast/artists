import { useState } from 'react';
import { LogOut, Music } from 'lucide-react';
import { artists } from '../data/artists';
import ReleaseCard from './ReleaseCard';
import ReleaseDetail from './ReleaseDetail';
import { Release } from '../data/artists';

interface DashboardProps {
  artistId: string;
  onLogout: () => void;
}

export default function Dashboard({ artistId, onLogout }: DashboardProps) {
  const artist = artists.find((a) => a.id === artistId);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  if (!artist) {
    return <div className="min-h-screen flex items-center justify-center text-white">Artist not found</div>;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">{artist.name}</h1>
              <p className="text-slate-400 text-sm">Artist Portal</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {selectedRelease ? (
          <ReleaseDetail
            release={selectedRelease}
            artistName={artist.name}
            onBack={() => setSelectedRelease(null)}
          />
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Releases</h2>
              <p className="text-slate-400">
                {artist.releases.length} release{artist.releases.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.releases.map((release) => (
                <ReleaseCard
                  key={release.id}
                  release={release}
                  onClick={() => setSelectedRelease(release)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
