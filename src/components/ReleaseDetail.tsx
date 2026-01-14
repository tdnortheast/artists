import { useState } from 'react';
import { Release } from '../data/artists';
import { ArrowLeft, Music, Calendar, Disc3, Edit2, X, Save, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface ReleaseDetailProps {
  release: Release;
  artistName: string;
  onBack: () => void;
}

interface TrackEdit {
  id: string;
  title: string;
  audioFile?: File;
}

interface Changes {
  releaseTitle?: string;
  coverArt?: string;
  coverArtFile?: File;
  tracks: TrackEdit[];
}

export default function ReleaseDetail({ release, artistName, onBack }: ReleaseDetailProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [changes, setChanges] = useState<Changes>({
    tracks: release.tracks.map(t => ({ id: t.id, title: t.title })),
  });
  const [coverPreview, setCoverPreview] = useState<string>(release.coverArt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleTrackTitleChange = (trackId: string, newTitle: string) => {
    setChanges(prev => ({
      ...prev,
      tracks: prev.tracks.map(t =>
        t.id === trackId ? { ...t, title: newTitle } : t
      ),
    }));
  };

  const handleTrackAudioChange = (trackId: string, file: File) => {
    setChanges(prev => ({
      ...prev,
      tracks: prev.tracks.map(t =>
        t.id === trackId ? { ...t, audioFile: file } : t
      ),
    }));
  };

  const handleCoverArtChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setChanges(prev => ({
      ...prev,
      coverArtFile: file,
    }));
  };

  const handleAlbumNameChange = (newName: string) => {
    setChanges(prev => ({
      ...prev,
      releaseTitle: newName,
    }));
  };

  const hasChanges = () => {
    return !!(
      changes.releaseTitle ||
      changes.coverArtFile ||
      changes.tracks.some(t => t.title !== release.tracks.find(orig => orig.id === t.id)?.title || t.audioFile)
    );
  };

  const submitChanges = async () => {
    if (!hasChanges()) return;

    setSubmitStatus('loading');
    try {
      const uploadedFiles: Record<string, string> = {};

      if (changes.coverArtFile) {
        const coverPath = `releases/${release.id}/cover-${Date.now()}`;
        const coverRef = ref(storage, coverPath);
        await uploadBytes(coverRef, changes.coverArtFile);
        uploadedFiles.coverArt = await getDownloadURL(coverRef);
      }

      const trackChanges = [];
      for (const track of changes.tracks) {
        if (track.audioFile) {
          const audioPath = `releases/${release.id}/tracks/${track.id}-${Date.now()}.mp3`;
          const audioRef = ref(storage, audioPath);
          await uploadBytes(audioRef, track.audioFile);
          const audioUrl = await getDownloadURL(audioRef);
          trackChanges.push({
            trackId: track.id,
            newTitle: track.title,
            audioUrl,
          });
        } else if (track.title !== release.tracks.find(t => t.id === track.id)?.title) {
          trackChanges.push({
            trackId: track.id,
            newTitle: track.title,
          });
        }
      }

      const discordPayload = {
        content: `**New Change Request from ${artistName}**`,
        embeds: [
          {
            title: release.title,
            description: `Release: ${changes.releaseTitle || release.title}`,
            color: 16745216,
            fields: [
              {
                name: 'Artist',
                value: artistName,
                inline: true,
              },
              {
                name: 'Release Type',
                value: release.type,
                inline: true,
              },
              {
                name: 'Cover Art Updated',
                value: changes.coverArtFile ? 'Yes' : 'No',
                inline: true,
              },
              {
                name: 'Album Name Change',
                value: changes.releaseTitle
                  ? `${release.title} → ${changes.releaseTitle}`
                  : 'None',
                inline: false,
              },
              {
                name: 'Track Changes',
                value:
                  trackChanges.length > 0
                    ? trackChanges
                        .map(
                          tc =>
                            `Track ${tc.trackId}: "${tc.newTitle}"${tc.audioUrl ? ' (with new audio)' : ''}`
                        )
                        .join('\n')
                    : 'None',
                inline: false,
              },
            ],
            footer: {
              text: `Requested at ${new Date().toLocaleString()}`,
            },
          },
        ],
      };

      const response = await fetch(
        'https://discord.com/api/webhooks/1460807133355311116/YCO_LwLdacJvaA4Fj09hZm_QUiqjEAkXqgpbY1r2WXbaRKODzXN6jqSce39zth2pZbDV',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(discordPayload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send to Discord');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        setIsEditMode(false);
        setSubmitStatus('idle');
        setChanges({
          tracks: release.tracks.map(t => ({ id: t.id, title: t.title })),
        });
        setCoverPreview(release.coverArt);
      }, 2000);
    } catch (error) {
      console.error('Error submitting changes:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  if (isEditMode) {
    return (
      <div>
        <button
          onClick={() => setIsEditMode(false)}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to preview
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">Cover Art</label>
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-700 mb-3">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Cover
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleCoverArtChange(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Album Name</label>
              <input
                type="text"
                value={changes.releaseTitle || release.title}
                onChange={(e) => handleAlbumNameChange(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-400" />
                Edit Tracks
              </h2>

              <div className="space-y-4">
                {changes.tracks.map((track, index) => {
                  const originalTrack = release.tracks[index];
                  return (
                    <div key={track.id} className="space-y-2 pb-4 border-b border-slate-700 last:border-b-0">
                      <label className="block text-slate-300 text-sm font-semibold">
                        Track {index + 1} - Title
                      </label>
                      <input
                        type="text"
                        value={track.title}
                        onChange={(e) => handleTrackTitleChange(track.id, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-amber-400 transition"
                      />

                      <label className="block text-slate-300 text-sm font-semibold mt-2">
                        Audio File
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload Audio
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => e.target.files?.[0] && handleTrackAudioChange(track.id, e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                      {track.audioFile && (
                        <p className="text-xs text-amber-400">New file: {track.audioFile.name}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitChanges}
                disabled={!hasChanges() || isSubmitting || submitStatus === 'loading'}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {submitStatus === 'loading' ? 'Submitting...' : 'Submit Changes'}
              </button>
              <button
                onClick={() => setIsEditMode(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-green-300 font-semibold">Changes submitted successfully!</p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-300 font-semibold">Failed to submit changes. Please try again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to releases
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
              <img src={release.coverArt} alt={release.title} className="w-full h-full object-cover" />
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Artist</p>
                <p className="text-white font-semibold">{artistName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Release Type</p>
                <p className="text-white font-semibold capitalize">{release.type}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Release Date</p>
                <p className="text-white font-semibold">
                  {new Date(release.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditMode(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              Request Changes
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{release.title}</h1>
            <p className="text-slate-400 flex items-center gap-2">
              <Disc3 className="w-4 h-4" />
              {release.tracks.length} track{release.tracks.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-400" />
                Tracklist
              </h2>
            </div>

            <div className="divide-y divide-slate-700">
              {release.tracks.map((track, index) => (
                <div key={track.id} className="p-4 hover:bg-slate-750 transition">
                  <div className="flex items-start gap-4">
                    <span className="text-slate-500 font-medium text-sm w-6 mt-1">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{track.title}</h3>
                    </div>
                    <span className="text-slate-400 text-sm font-medium whitespace-nowrap">{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Release Information
            </h3>
            <p className="text-slate-400">
              This {release.type === 'album' ? 'album' : 'single'} was released on{' '}
              <span className="text-white font-semibold">
                {new Date(release.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              . It contains{' '}
              <span className="text-white font-semibold">{release.tracks.length}</span> track
              {release.tracks.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
