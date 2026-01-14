import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [authenticatedArtist, setAuthenticatedArtist] = useState<string | null>(null);

  const handleLogout = () => {
    setAuthenticatedArtist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {!authenticatedArtist ? (
        <Login onLogin={setAuthenticatedArtist} />
      ) : (
        <Dashboard artistId={authenticatedArtist} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
