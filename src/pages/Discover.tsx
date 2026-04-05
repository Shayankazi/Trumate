import { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, MapPin, Compass, Briefcase, GraduationCap, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import BottomNav from '../components/BottomNav';
import { apiUrl } from '../lib/api';

interface UserCard {
  _id: string;
  name: string;
  age: number;
  gender?: string;
  major?: string;
  college?: string;
  year?: string;
  interests: string[];
  bio: string;
  images: string[];
  location: { city: string };
  rent?: number;
  preferences: {
    smoking: boolean;
    drinking: boolean;
    sleep_schedule: string;
    cleanliness: string;
    gaming: boolean;
    guests: boolean;
    pets: string;
    diet: string;
  };
  compatibilityScore: number;
}

interface CardProps {
  user: UserCard;
  onSwipe: (direction: 'like' | 'pass') => void;
}

const DiscoveryCard = forwardRef<HTMLDivElement, CardProps>(({ user, onSwipe }, ref) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      key={user._id}
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('like');
        else if (info.offset.x < -100) onSwipe('pass');
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ 
        x: x.get() > 0 ? 500 : -500, 
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.4 } 
      }}
      whileTap={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="absolute inset-4 cursor-grab active:cursor-grabbing"
    >
      <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-800/50 bg-zinc-900">
        <img
          src={user.images[0]}
          alt={user.name}
          className="h-full w-full object-cover select-none pointer-events-none"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 pointer-events-none" />

        {/* Compatibility Badge */}
        <div className={`absolute top-8 left-8 backdrop-blur-xl border px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl z-10 transition-colors duration-500 ${
          user.compatibilityScore <= 25 
            ? 'bg-red-500/30 border-red-500/50' 
            : 'bg-zinc-950/40 border-white/10'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${
            user.compatibilityScore <= 25 
              ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse' 
              : 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
          }`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            user.compatibilityScore <= 25 ? 'text-red-200' : 'text-white'
          }`}>
            {user.compatibilityScore}% Match
          </span>
        </div>

        {/* User Info */}
        <div className="absolute bottom-32 left-8 right-8 space-y-4 z-10 pointer-events-none">
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-black text-white tracking-tight">
              {user.name}, {user.age}
            </h3>
            {user.gender && (
              <span className="text-zinc-400 text-sm font-bold opacity-80 uppercase tracking-widest">{user.gender}</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-zinc-300">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-400" />
              <span className="text-xs font-bold">{user.location.city}</span>
            </div>
            {user.major && (
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-purple-400" />
                <span className="text-xs font-bold">{user.major}</span>
              </div>
            )}
            {user.college && (
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-purple-400" />
                <span className="text-xs font-bold">{user.college} {user.year && `(${user.year})`}</span>
              </div>
            )}
            {user.rent && (
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold text-lg">₹</span>
                <span className="text-xs font-bold">{user.rent}/mo</span>
              </div>
            )}
          </div>

          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 py-1">
              {user.interests.map((interest) => (
                <span 
                  key={interest} 
                  className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-bold text-zinc-300 border border-white/5"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 opacity-90">{user.bio}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(user.preferences).map(([key, val]) => {
              if (typeof val === 'boolean' && val) {
                return (
                  <span key={key} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    {key}
                  </span>
                );
              }
              if (typeof val === 'string' && val && val !== 'no' && val !== 'anything') {
                 return (
                  <span key={key} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20">
                    {val.replace('_', ' ')}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Discover() {
  const [users, setUsers] = useState<UserCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRestacking, setIsRestacking] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(apiUrl('/api/users/discover'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (currentIndex >= users.length) return;
    
    const targetUserId = users[currentIndex]._id;
    
    setCurrentIndex((prev) => prev + 1);

    try {
      await fetch(apiUrl('/api/matches/swipe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId, action: direction }),
      });
    } catch (error) {
      console.error("Failed to record swipe:", error);
    }
  };

  const handleRestack = async () => {
    setIsRestacking(true);
    try {
      const response = await fetch(apiUrl('/api/matches/restack'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setCurrentIndex(0);
        await fetchUsers();
      }
    } catch (error) {
      console.error("Failed to restack:", error);
    } finally {
      setIsRestacking(false);
    }
  };

  return (
    <div className="h-screen bg-[#0A0A0A] overflow-hidden relative flex flex-col selection:bg-purple-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 relative p-4 mt-4 z-10">
        <AnimatePresence mode="popLayout">
          {currentIndex < users.length ? (
            <DiscoveryCard 
              key={users[currentIndex]._id}
              user={users[currentIndex]} 
              onSwipe={handleSwipe} 
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center border border-zinc-800 backdrop-blur-xl">
                <Compass size={40} className="text-zinc-700 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">No more users</h2>
                <p className="text-zinc-500 text-sm max-w-[250px] mx-auto font-medium leading-relaxed">
                  You've swiped through everyone nearby. Want to see rejected profiles again?
                </p>
              </div>
              <button 
                onClick={handleRestack}
                disabled={isRestacking}
                className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.05] transition-all active:scale-95 disabled:opacity-50"
              >
                {isRestacking ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                    Restack Profiles
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="pb-28 px-12 flex justify-center gap-10 z-20">
        <button
          disabled={currentIndex >= users.length}
          onClick={() => handleSwipe('pass')}
          className="w-24 h-24 bg-zinc-950/50 backdrop-blur-2xl border border-zinc-800 rounded-full flex items-center justify-center text-red-500 shadow-2xl active:scale-90 transition-all hover:border-red-500/20 group disabled:opacity-30 disabled:pointer-events-none"
        >
          <X size={44} className="group-hover:scale-110 transition-transform" />
        </button>
        <button
          disabled={currentIndex >= users.length}
          onClick={() => handleSwipe('like')}
          className="w-24 h-24 bg-white border border-white rounded-full flex items-center justify-center text-black shadow-2xl active:scale-90 transition-all hover:bg-zinc-100 group disabled:opacity-30 disabled:pointer-events-none"
        >
          <Heart size={44} fill="currentColor" className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
