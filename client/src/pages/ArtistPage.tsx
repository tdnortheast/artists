import { useReleases } from "@/hooks/use-releases";
import { ReleaseCard } from "@/components/ReleaseCard";
import { NewReleaseModal } from "@/components/NewReleaseModal";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogOut, Disc3, Mic2, Plus } from "lucide-react";
import { useState } from "react";

interface ArtistPageProps {
  artistId: string;
  artistName: string;
}

export default function ArtistPage({ artistId, artistName }: ArtistPageProps) {
  const { data: releases, isLoading, error } = useReleases(artistId);
  const [, setLocation] = useLocation();
  const [isNewReleaseOpen, setIsNewReleaseOpen] = useState(false);

  const handleLogout = () => {
    setLocation("/");
  };

  // Sort releases by year (newest first)
  const sortedReleases = releases?.sort((a, b) => b.year - a.year);

  // Background image based on artist for visual flair
  const bgImage =
    artistId === "artist1"
      ? // Taylor Swift / Pop aesthetic
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop"
      : // Rock / Alternative aesthetic
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Header */}
      <header className="relative h-[40vh] min-h-[300px] flex items-end">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Artist Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container max-w-7xl mx-auto px-6 pb-12 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-primary mb-2 font-medium tracking-wide uppercase text-sm"
              >
                <Mic2 className="w-4 h-4" />
                <span>Verified Artist</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-gradient-gold"
              >
                {artistName}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mt-2 max-w-xl text-lg"
              >
                Explore your complete discography and manage releases.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => setIsNewReleaseOpen(true)}
                className="
                  px-6 py-3 rounded-full
                  bg-primary text-white
                  hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20
                  transition-all duration-200
                  flex items-center gap-2 font-bold
                "
              >
                <Plus className="w-5 h-5" />
                <span>Release New</span>
              </button>

              <button
                onClick={handleLogout}
                className="
                  px-6 py-3 rounded-full
                  bg-white/5 border border-white/10 text-white
                  hover:bg-white/10 hover:border-primary/50
                  transition-all duration-200
                  flex items-center gap-2 backdrop-blur-md
                "
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-6 py-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">
              Loading discography...
            </p>
          </div>
        )}

        {error && (
          <div className="glass-panel p-8 rounded-2xl text-center max-w-lg mx-auto border-red-500/20">
            <h3 className="text-xl font-bold text-red-400 mb-2">
              Connection Error
            </h3>
            <p className="text-muted-foreground mb-6">
              Failed to load artist data. Please check your connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && releases?.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <Disc3 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-medium">No releases found</h3>
            <p>This vault seems to be empty for now.</p>
          </div>
        )}

        {!isLoading && releases && releases.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedReleases?.map((release, idx) => (
              <ReleaseCard key={release.id} release={release} index={idx} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="container max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground/40">
          <p>
            &copy; {new Date().getFullYear()} Vault Music Systems. All rights
            reserved.
          </p>
        </div>
      </footer>

      <NewReleaseModal
        artistId={artistId}
        isOpen={isNewReleaseOpen}
        onClose={() => setIsNewReleaseOpen(false)}
      />
    </div>
  );
}
