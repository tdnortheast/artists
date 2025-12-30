import { Release } from "@shared/schema";
import { motion } from "framer-motion";
import { Disc, Calendar, Music2, Edit2 } from "lucide-react";
import { useState } from "react";
import { ChangeRequestModal } from "./ChangeRequestModal";
import { useTracks, useFeatures } from "@/hooks/use-releases";

interface ReleaseCardProps {
  release: Release;
  index: number;
}

export function ReleaseCard({ release, index }: ReleaseCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group relative"
      >
        <div className="
          glass-panel rounded-2xl overflow-hidden
          hover:border-primary/50 transition-colors duration-300
          h-full flex flex-col
        ">
          {/* Cover Image Area */}
          <div className="aspect-square relative overflow-hidden bg-secondary">
            {release.coverUrl ? (
              <img 
                src={release.coverUrl} 
                alt={release.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background">
                <Disc className="w-16 h-16 text-muted-foreground/20" />
              </div>
            )}
            
            {/* Overlay with Type Badge */}
            <div className="absolute top-3 right-3">
              <span className="
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                bg-black/60 backdrop-blur-md text-white border border-white/10
              ">
                {release.type}
              </span>
            </div>

            {/* Request Changes Button */}
            <button
              onClick={() => setShowModal(true)}
              className="
                absolute bottom-3 left-3 right-3
                px-3 py-2 rounded-lg text-xs font-semibold
                bg-primary text-white
                hover:bg-primary/90
                transition-all duration-200
                flex items-center justify-center gap-2
                opacity-0 group-hover:opacity-100
              "
              data-testid={`button-request-changes-${release.id}`}
            >
              <Edit2 className="w-3 h-3" />
              Request Changes
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" title={release.title}>
              {release.title}
            </h3>
            
            <div className="mt-4 space-y-2">
              <TrackList releaseId={release.id} />
            </div>

            <div className="flex items-center gap-4 mt-auto pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{release.year}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Music2 className="w-3.5 h-3.5" />
                <span className="capitalize">{release.type}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <ChangeRequestModal
          release={release}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function TrackList({ releaseId }: { releaseId: number }) {
  const { data: tracks = [] } = useTracks(releaseId);

  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div key={track.id} className="text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{track.title}</span>
            {track.explicit && <span className="text-xs text-red-500 font-bold">🅴</span>}
          </div>
          <FeatureList trackId={track.id} />
        </div>
      ))}
    </div>
  );
}

function FeatureList({ trackId }: { trackId: number }) {
  const { data: features = [] } = useFeatures(trackId);

  if (features.length === 0) return null;

  return (
    <div className="text-xs text-muted-foreground pl-2">
      feat. {features.map(f => f.artistName).join(", ")}
    </div>
  );
}
