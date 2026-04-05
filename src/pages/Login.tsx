import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User, GraduationCap, Heart, ArrowRight, ChevronLeft } from 'lucide-react';
import { apiUrl } from '../lib/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'owner' | 'seeker'>('seeker');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, role, name };

    try {
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        setAuth(data.user, data.token);
        if (isLogin && data.user.hasProfile) {
          navigate('/discover');
        } else {
          navigate('/profile-setup');
        }
      } else {
        alert(data.message || 'Error occurred');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Heart className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-lg font-black text-white">TruMate</span>
          </Link>

          <Link
            to="/"
            className="text-zinc-500 hover:text-white text-sm font-semibold transition-colors"
          >
            Home
          </Link>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20"
            >
              <Heart className="text-white w-8 h-8" fill="currentColor" />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join TruMate'}
            </h1>
            <p className="text-zinc-500 text-sm">
              {isLogin ? 'Continue your campus journey' : 'Start finding your perfect campus match'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="flex gap-3 p-1 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setRole('seeker')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-bold ${
                        role === 'seeker'
                          ? 'bg-zinc-800 text-white shadow-lg'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      I need a room
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('owner')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-bold ${
                        role === 'owner'
                          ? 'bg-zinc-800 text-white shadow-lg'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      I have a room
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative bg-white text-black font-black py-4 rounded-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-500 hover:text-white text-sm font-medium transition-colors"
            >
              {isLogin ? (
                <>New here? <span className="text-purple-400">Create an account</span></>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Sign In
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-8 flex items-center justify-center gap-2 text-zinc-600">
          <GraduationCap className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">Verified Student Community</span>
        </div>
      </motion.div>
    </div>
  );
}
