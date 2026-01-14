import { useState } from 'react';
import { Lock, Music } from 'lucide-react';
import { artists } from '../data/artists';

interface LoginProps {
  onLogin: (artistId: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const artist = artists.find((a) => a.password === password);
      if (artist) {
        onLogin(artist.id);
      } else {
        setError('Invalid password');
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl font-bold text-white">Artist Portal</h1>
          </div>
          <p className="text-slate-400 text-lg">Manage your releases</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-lg p-8 shadow-2xl border border-slate-700"
        >
          <div className="mb-6">
            <label className="block text-slate-300 font-semibold mb-3">
              Enter your password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold py-3 rounded-lg transition duration-200"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>

          <p className="text-slate-500 text-xs text-center mt-6">
            Demo passwords: yuno123 or jamar123
          </p>
        </form>
      </div>
    </div>
  );
}
