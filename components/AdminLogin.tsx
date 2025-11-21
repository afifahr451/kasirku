import React, { useState } from 'react';
import { Lock, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for effect
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid credentials. Access denied.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl shadow-black relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 shadow-inner border border-neutral-700">
              <Lock className="text-orange-500" size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Admin Access</h2>
            <p className="text-neutral-400 text-sm mt-1">Please verify your identity</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                <ShieldCheck size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Login to Dashboard <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-xs text-neutral-600">
               Hint: User: <span className="font-mono text-neutral-400">admin</span> | Pass: <span className="font-mono text-neutral-400">123</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;