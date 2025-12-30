import { Release } from "@shared/schema";
import { useState } from "react";
import { useTracks, useCreateChangeRequest, useUploadFile, useFeatures } from "@/hooks/use-releases";
import { X, Upload } from "lucide-react";

interface ChangeRequestModalProps {
  release: Release;
  isOpen: boolean;
  onClose: () => void;
}

const CHANGE_TYPES = [
  { value: "cover_art", label: "Cover Art" },
  { value: "track_name", label: "Track Name" },
  { value: "album_name", label: "Album Name" },
  { value: "explicit", label: "Explicit Status" },
  { value: "featured_artist", label: "Featured Artist" },
  { value: "audio_swap", label: "Audio Swap" },
];

function TrackOption({ track }: { track: any }) {
  const { data: features = [] } = useFeatures(track.id);
  const featureList = features.length > 0 ? ` (feat. ${features.map(f => f.artistName).join(", ")})` : "";
  const explicitSymbol = track.explicit ? " 🅴" : "";
  
  return (
    <option key={track.id} value={track.id}>
      {track.title}{explicitSymbol}{featureList}
    </option>
  );
}

export function ChangeRequestModal({
  release,
  isOpen,
  onClose,
}: ChangeRequestModalProps) {
  const { data: tracks = [] } = useTracks(release.id);
  const createRequest = useCreateChangeRequest();
  const uploadFile = useUploadFile();
  const [changeType, setChangeType] = useState("cover_art");
  const [description, setDescription] = useState("");
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAlbum = release.type === "album";
  const needsTrackSelection = ["audio_swap", "explicit", "featured_artist", "track_name"].includes(changeType);
  const isExplicitChange = changeType === "explicit";
  const needsFile = changeType === "cover_art" || changeType === "audio_swap";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target?.result as string;
      uploadFile.mutate({
        fileData,
        fileName: selectedFile.name,
        changeType,
      }, {
        onSuccess: (data) => {
          setUploadedFilePath(data.filePath);
          setSelectedFile(null);
        },
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (needsFile && !uploadedFilePath) {
      alert("Please upload a file first");
      return;
    }

    if (needsTrackSelection && !selectedTrackId) {
      alert("Please select a track");
      return;
    }

    createRequest.mutate({
      releaseId: release.id,
      trackId: selectedTrackId || undefined,
      changeType,
      description: isExplicitChange ? `Change explicit status to: ${explicitStatus ? "ON" : "OFF"}${description ? " - " + description : ""}` : description || undefined,
      filePath: uploadedFilePath || undefined,
    });

    onClose();
  };

  const [explicitStatus, setExplicitStatus] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Request Changes</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Release</label>
            <div className="text-sm text-muted-foreground">{release.title}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Change Type</label>
            <select
              value={changeType}
              onChange={(e) => {
                setChangeType(e.target.value);
                setSelectedFile(null);
                setUploadedFilePath(null);
                setSelectedTrackId(null);
              }}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-white/10 text-white focus:outline-none focus:border-primary"
            >
              {CHANGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {needsTrackSelection && isAlbum && (
            <div>
              <label className="block text-sm font-medium mb-2">Track</label>
              <select
                required
                value={selectedTrackId || ""}
                onChange={(e) => setSelectedTrackId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-white/10 text-white focus:outline-none focus:border-primary"
              >
                <option value="">Select a track...</option>
                {tracks.map((track) => (
                  <TrackOption key={track.id} track={track} />
                ))}
              </select>
            </div>
          )}

          {isExplicitChange && (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-white/10">
              <label className="text-sm font-medium">Explicit Status</label>
              <button
                type="button"
                onClick={() => setExplicitStatus(!explicitStatus)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  explicitStatus ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    explicitStatus ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}

          {needsFile && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload {changeType === "cover_art" ? "Image" : "Audio File"}
              </label>
              <input
                type="file"
                accept={changeType === "cover_art" ? "image/*" : "audio/*"}
                onChange={handleFileSelect}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-white/10 text-white focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white"
              />
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUploadFile}
                  disabled={uploadFile.isPending}
                  className="mt-2 w-full px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadFile.isPending ? "Uploading..." : "Upload File"}
                </button>
              )}
              {uploadedFilePath && (
                <div className="mt-2 text-sm text-green-400">
                  ✓ File uploaded
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your requested change..."
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none h-24"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRequest.isPending}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {createRequest.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
