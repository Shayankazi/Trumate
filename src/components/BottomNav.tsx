import { NavLink } from 'react-router-dom';
import { Compass, Heart, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800 px-6 py-3 flex justify-between items-center z-50">
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-purple-500' : 'text-zinc-500'
          }`
        }
      >
        <Compass size={24} />
        <span className="text-[10px] font-medium uppercase tracking-tighter">Discover</span>
      </NavLink>

      <NavLink
        to="/matches"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-purple-500' : 'text-zinc-500'
          }`
        }
      >
        <Heart size={24} />
        <span className="text-[10px] font-medium uppercase tracking-tighter">Matches</span>
      </NavLink>

      <NavLink
        to="/profile-setup"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-purple-500' : 'text-zinc-500'
          }`
        }
      >
        <User size={24} />
        <span className="text-[10px] font-medium uppercase tracking-tighter">Profile</span>
      </NavLink>
    </nav>
  );
}
