import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export default function PasswordGate({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('site-unlocked');
    if (stored === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_SITE_PASSWORD || 'My-Drop-Site';

    if (password === correctPassword) {
      setIsUnlocked(true);
      localStorage.setItem('site-unlocked', 'true');
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (!mounted) return null;

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                <Lock size={32} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Access Required</h1>
              <p className="text-slate-400 text-sm mt-2">Enter password to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-green-500 outline-none transition-all"
              />
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-bold py-3 rounded-lg transition-all uppercase tracking-widest text-sm"
              >
                Unlock
              </button>
            </form>

            <p className="text-slate-500 text-xs text-center mt-6">Use the password from Netlify deployment</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
