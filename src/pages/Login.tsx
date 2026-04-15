import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import Logo from '../components/Logo';
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
        if (!isLogin) {
          // New registration → complete profile first
          navigate('/profile-setup');
        } else if (data.user.hasProfile) {
          // Returning user with profile → home page (nav shows "Open App")
          navigate('/');
        } else {
          // Returning user without profile → complete profile
          navigate('/profile-setup');
        }
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="hidden md:flex md:w-[42%] bg-[#1A1714] flex-col justify-between p-12">
        <Link to="/">
          <Logo size={28} variant="light" />
        </Link>

        <div>
          <blockquote className="text-2xl font-medium text-white leading-relaxed mb-6">
            "Found my roommate on TruMate in less than a week. We both love late-night coding sessions and hate loud music. Perfect match."
          </blockquote>
          <div>
            <div className="font-semibold text-white text-sm">Priya M.</div>
            <div className="text-[#706B64] text-sm">Computer Science, MIT-WPU</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#A09890] text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D94F1E]" />
          Verified student community
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile nav */}
        <div className="md:hidden flex items-center justify-between px-6 py-5 border-b border-[#E8E5DF]">
          <Link to="/">
            <Logo size={26} />
          </Link>
          <Link to="/" className="text-sm text-[#706B64] font-medium">Back</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1A1714] mb-1.5">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-[#706B64] text-sm">
                {isLogin
                  ? 'Sign in to continue finding your roommate.'
                  : 'Join thousands of students already on TruMate.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                        Full name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 text-[#1A1714] placeholder:text-[#A09890] focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all text-sm"
                        placeholder="Alex Johnson"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                        I'm looking to...
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('seeker')}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                            role === 'seeker'
                              ? 'bg-[#FEF0EB] border-[#D94F1E] text-[#D94F1E]'
                              : 'bg-white border-[#D8D4CC] text-[#706B64] hover:border-[#A09890]'
                          }`}
                        >
                          Find a room
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('owner')}
                          className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                            role === 'owner'
                              ? 'bg-[#FEF0EB] border-[#D94F1E] text-[#D94F1E]'
                              : 'bg-white border-[#D8D4CC] text-[#706B64] hover:border-[#A09890]'
                          }`}
                        >
                          List a room
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 text-[#1A1714] placeholder:text-[#A09890] focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all text-sm"
                  placeholder="you@college.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1714] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#D8D4CC] rounded-xl px-4 py-3 text-[#1A1714] placeholder:text-[#A09890] focus:outline-none focus:ring-2 focus:ring-[#D94F1E]/30 focus:border-[#D94F1E] transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#D94F1E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#C2441A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Create account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[#706B64] hover:text-[#1A1714] transition-colors"
              >
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <span className="font-semibold text-[#D94F1E]">Sign up free</span>
                  </>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <ChevronLeft className="w-4 h-4" />
                    Back to sign in
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
