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
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);

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
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 500 : -500,
        opacity: 0,
        scale: 0.85,
        transition: { duration: 0.35 },
      }}
      whileTap={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="absolute inset-3 cursor-grab active:cursor-grabbing"
    >
      <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl bg-[#1A1714]">
        <img
          src={user.images[0]}
          alt={user.name}
          className="h-full w-full object-cover select-none pointer-events-none"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

        {/* Like / Pass indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-8 rotate-[-20deg] border-4 border-[#D94F1E] text-[#D94F1E] rounded-xl px-4 py-2 z-20"
        >
          <span className="text-2xl font-bold tracking-wide">LIKE</span>
        </motion.div>
        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute top-10 right-8 rotate-[20deg] border-4 border-white text-white rounded-xl px-4 py-2 z-20"
        >
          <span className="text-2xl font-bold tracking-wide">NOPE</span>
        </motion.div>

        {/* Compatibility badge */}
        <div
          className={`absolute top-5 right-5 px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 ${
            user.compatibilityScore <= 25
              ? 'bg-white/15 text-white'
              : 'bg-[#D94F1E]/90 text-white'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              user.compatibilityScore <= 25 ? 'bg-white/60' : 'bg-white'
            }`}
          />
          <span className="text-xs font-semibold">{user.compatibilityScore}% match</span>
        </div>

        {/* User info */}
        <div className="absolute bottom-28 left-5 right-5 z-10 pointer-events-none space-y-3">
          <div>
            <h3 className="text-3xl font-bold text-white leading-tight">
              {user.name}, {user.age}
            </h3>
            {user.gender && (
              <span className="text-white/60 text-sm">{user.gender}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-white/80 text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#D94F1E]" />
              {user.location.city}
            </div>
            {user.major && (
              <div className="flex items-center gap-1.5">
                <Briefcase size={13} className="text-[#D94F1E]" />
                {user.major}
              </div>
            )}
            {user.college && (
              <div className="flex items-center gap-1.5">
                <GraduationCap size={13} className="text-[#D94F1E]" />
                {user.college} {user.year && `(${user.year})`}
              </div>
            )}
            {user.rent && (
              <div className="flex items-center gap-1">
                <span className="text-[#D94F1E] font-semibold">₹</span>
                {user.rent}/mo
              </div>
            )}
          </div>

          {user.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {user.interests.slice(0, 5).map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[11px] text-white/90 border border-white/10"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{user.bio}</p>
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
    const currentUser = users[currentIndex];
    setCurrentIndex((prev) => prev + 1);

    try {
      await fetch(apiUrl('/api/matches/swipe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUserId: currentUser._id,
          action: direction,
          compatibilityScore: currentUser.compatibilityScore,
        }),
      });
    } catch (error) {
      console.error('Failed to record swipe:', error);
    }
  };

  const handleRestack = async () => {
    setIsRestacking(true);
    try {
      const response = await fetch(apiUrl('/api/matches/restack'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setCurrentIndex(0);
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to restack:', error);
    } finally {
      setIsRestacking(false);
    }
  };

  return (
    <div className="h-screen bg-[#111111] overflow-hidden relative flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2 z-10">
        <h1 className="text-white font-bold text-xl">Discover</h1>
        <div className="text-white/40 text-sm">
          {currentIndex < users.length ? `${users.length - currentIndex} left` : ''}
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 relative px-0 z-10">
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-5 px-8"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Compass size={36} className="text-white/30" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">You've seen everyone</h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-[260px] mx-auto">
                  You've gone through all the profiles nearby. Want to see them again?
                </p>
              </div>
              <button
                onClick={handleRestack}
                disabled={isRestacking}
                className="flex items-center gap-2 px-7 py-3 bg-white text-[#1A1714] rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isRestacking ? (
                  <div className="w-4 h-4 border-2 border-[#1A1714]/20 border-t-[#1A1714] rounded-full animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Restack profiles
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="pb-24 px-10 flex justify-center gap-8 z-20">
        <button
          disabled={currentIndex >= users.length}
          onClick={() => handleSwipe('pass')}
          className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:bg-white/15 hover:text-white active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <X size={28} />
        </button>
        <button
          disabled={currentIndex >= users.length}
          onClick={() => handleSwipe('like')}
          className="w-20 h-20 bg-[#D94F1E] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#D94F1E]/30 hover:bg-[#C2441A] active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <Heart size={34} fill="currentColor" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
