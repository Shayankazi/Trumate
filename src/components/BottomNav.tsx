import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User } from 'lucide-react';

const navItems = [
  { to: '/', Icon: Home, label: 'Home' },
  { to: '/discover', Icon: Compass, label: 'Discover' },
  { to: '/matches', Icon: Heart, label: 'Matches' },
  { to: '/profile-setup', Icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const isDiscover = location.pathname === '/discover';

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 px-2 py-2 flex justify-around items-center z-50 ${
        isDiscover
          ? 'bg-[#111111]/90 border-t border-white/10'
          : 'bg-white border-t border-[#E8E5DF]'
      }`}
    >
      {navItems.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
              isActive
                ? isDiscover
                  ? 'text-white'
                  : 'text-[#D94F1E]'
                : isDiscover
                ? 'text-white/40 hover:text-white/70'
                : 'text-[#A09890] hover:text-[#706B64]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
