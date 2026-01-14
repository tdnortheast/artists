import { Release } from '../data/artists';
import { Disc3 } from 'lucide-react';

interface ReleaseCardProps {
  release: Release;
  onClick: () => void;
}

export default function ReleaseCard({ release, onClick }: ReleaseCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/20"
    >
      <div className="aspect-square overflow-hidden bg-slate-700">
        <img
          src={release.coverArt}
          alt={release.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="transform group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Disc3 className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase">
              {release.type === 'album' ? 'Album' : 'Single'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{release.title}</h3>
          <p className="text-xs text-slate-300">
            {new Date(release.releaseDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-xs text-slate-400 mt-1">{release.tracks.length} track{release.tracks.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </button>
  );
}
