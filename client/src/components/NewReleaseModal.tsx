import { useState, useRef } from "react";
import { X, Plus, Music, Upload, Users, Type, FileText } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NewReleaseModalProps {
  artistId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface TrackForm {
  title: string;
  features: string[];
  audioFile: File | null;
  audioPath: string | null;
}

export function NewReleaseModal({ artistId, isOpen, onClose }: NewReleaseModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { uploadFile } = useUpload();
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState("album");
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackForm[]>([{ title: "", features: [], audioFile: null, audioPath: null }]);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const addTrack = () => {
    if (tracks.length < 35) {
      setTracks([...tracks, { title: "", features: [], audioFile: null, audioPath: null }]);
    }
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const addFeature = (trackIndex: number) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].features.push("");
    setTracks(newTracks);
  };

  const updateTrackTitle = (index: number, val: string) => {
    const newTracks = [...tracks];
    newTracks[index].title = val;
    setTracks(newTracks);
  };

  const updateFeature = (trackIndex: number, featureIndex: number, val: string) => {
    const newTracks = [...tracks];
    newTracks[trackIndex].features[featureIndex] = val;
    setTracks(newTracks);
  };

  const handleAudioSelect = (index: number, file: File) => {
    const newTracks = [...tracks];
    newTracks[index].audioFile = file;
    setTracks(newTracks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const folderId = `release-${Date.now()}`;
      
      // 1. Upload Cover Art
      let finalCoverPath = "";
      if (coverArt) {
        const res = await uploadFile(coverArt);
        if (res) finalCoverPath = res.objectPath;
      }

      // 2. Upload Tracks
      const finalTracks = await Promise.all(tracks.map(async (track) => {
        let path = "";
        if (track.audioFile) {
          const res = await uploadFile(track.audioFile);
          if (res) path = res.objectPath;
        }
        return { ...track, audioPath: path };
      }));

      // 3. Create Release on backend
      const res = await fetch("/api/releases/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId,
          title,
          albumId,
          year,
          type,
          coverUrl: finalCoverPath,
          tracks: finalTracks,
          comments,
          folderId
        }),
      });

      if (!res.ok) throw new Error("Failed to create release");

      toast({ title: "Success", description: "Release created successfully" });
      queryClient.invalidateQueries({ queryKey: [`/api/releases/${artistId}`] });
      onClose();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-white/10 rounded-2xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-card z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            New Release
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" /> Title
                </label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" placeholder="Album Title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Year</label>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                <Upload className="w-4 h-4 text-muted-foreground" /> Cover Art
              </label>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center aspect-video hover:border-primary/50 transition-colors relative group">
                {coverArt ? (
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-[200px]">{coverArt.name}</p>
                    <button type="button" onClick={() => setCoverArt(null)} className="text-xs text-destructive hover:underline mt-1">Remove</button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <p className="text-xs text-muted-foreground">Click to upload image</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && setCoverArt(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Tracks */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" /> Tracks ({tracks.length}/35)
              </h3>
              <button type="button" onClick={addTrack} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Track
              </button>
            </div>

            <div className="space-y-4">
              {tracks.map((track, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 relative">
                  <button type="button" onClick={() => removeTrack(i)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Track {i+1} Title</label>
                      <input required value={track.title} onChange={e => updateTrackTitle(i, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2" placeholder="Song Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Audio File</label>
                      <div className="relative">
                        <input type="file" accept="audio/*" onChange={e => e.target.files?.[0] && handleAudioSelect(i, e.target.files[0])} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm file:hidden" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                        </div>
                        {track.audioFile && <p className="text-[10px] text-primary mt-1 truncate">{track.audioFile.name}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" /> Featured Artists
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {track.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                          <input value={f} onChange={e => updateFeature(i, fi, e.target.value)} className="bg-transparent border-0 p-0 text-xs w-24 focus:ring-0" placeholder="Artist Name" />
                          <button type="button" onClick={() => {
                            const nt = [...tracks];
                            nt[i].features.splice(fi, 1);
                            setTracks(nt);
                          }} className="text-muted-foreground hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addFeature(i)} className="text-xs bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1 rounded-full transition-colors">
                        + Feature
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" /> Custom Comments
            </label>
            <textarea value={comments} onChange={e => setComments(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 resize-none" placeholder="Any additional notes for this release..." />
          </div>
        </form>

        <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-card rounded-b-2xl sticky bottom-0 z-10">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2 rounded-xl bg-primary text-white hover:shadow-lg hover:shadow-primary/20 transition-all font-bold disabled:opacity-50">
            {isSubmitting ? "Uploading..." : "Submit Release"}
          </button>
        </div>
      </div>
    </div>
  );
}
