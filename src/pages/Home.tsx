import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, BookOpen, Shield, ArrowRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';

export default function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1A1714] pb-24">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 max-w-6xl mx-auto">
        <Logo size={28} />
        <Link
          to={user ? '/discover' : '/login'}
          className="px-5 py-2 text-sm font-semibold border border-[#D8D4CC] rounded-full text-[#1A1714] hover:bg-[#1A1714] hover:text-white hover:border-[#1A1714] transition-all duration-200"
        >
          {user ? 'Open App' : 'Sign In'}
        </Link>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FEF0EB] border border-[#F5C4B2] rounded-full mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D94F1E]" />
            <span className="text-xs font-semibold text-[#D94F1E]">Made for college students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[#1A1714] leading-[1.05] tracking-tight mb-6 max-w-3xl">
            Find a roommate<br />who actually fits.
          </h1>

          <p className="text-[#706B64] text-xl leading-relaxed mb-10 max-w-xl">
            No more sketchy Facebook posts or housing assignment luck. TruMate matches you with students who share your habits, schedule, and lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={user ? '/discover' : '/login'}
              className="inline-flex items-center gap-2 bg-[#D94F1E] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#C2441A] transition-colors"
            >
              {user ? 'Continue Swiping' : 'Get Started Free'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#D8D4CC] font-semibold text-[#1A1714] bg-white hover:bg-[#F0EDE8] transition-colors">
              See how it works
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="mt-20 flex flex-wrap gap-10 md:gap-16 border-t border-[#E8E5DF] pt-10"
        >
          {[
            { value: '2,400+', label: 'Active students' },
            { value: '89%', label: 'Match satisfaction' },
            { value: '40+', label: 'Colleges covered' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-[#1A1714]">{stat.value}</div>
              <div className="text-sm text-[#706B64] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Features */}
      <section className="bg-white border-y border-[#E8E5DF] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#1A1714] mb-2">Built for campus life</h2>
            <p className="text-[#706B64]">Three things that actually matter when finding a roommate.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: GraduationCap,
                title: 'Campus-verified',
                description: 'Everyone on TruMate is a real student. Connect with people from your college or nearby universities — no randoms.',
                iconColor: '#D94F1E',
                iconBg: '#FEF0EB',
              },
              {
                Icon: BookOpen,
                title: 'Lifestyle matching',
                description: 'Early bird or night owl? Clean freak or laid-back? We match on the stuff that actually causes roommate conflicts.',
                iconColor: '#6B4FE8',
                iconBg: '#F0EDFF',
              },
              {
                Icon: Shield,
                title: 'Mutual interest only',
                description: 'No unsolicited messages. You only connect when both of you match — giving you full control over who reaches out.',
                iconColor: '#16A34A',
                iconBg: '#ECFDF5',
              },
            ].map(({ Icon, title, description, iconColor, iconBg }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl border border-[#E8E5DF] bg-[#FAFAF8]"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon size={22} style={{ color: iconColor }} />
                </div>
                <h3 className="text-base font-semibold text-[#1A1714] mb-2">{title}</h3>
                <p className="text-[#706B64] text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 max-w-6xl mx-auto px-6 md:px-10">
        <div className="bg-[#1A1714] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Your future roommate<br />is already here.
            </h2>
            <p className="text-[#A09890]">Set up your profile in under 5 minutes. It's free.</p>
          </div>
          <Link
            to={user ? '/discover' : '/login'}
            className="shrink-0 inline-flex items-center gap-2 bg-[#D94F1E] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#C2441A] transition-colors text-base"
          >
            {user ? 'Back to App' : 'Join TruMate'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E5DF] py-8 px-6 md:px-10 max-w-6xl mx-auto flex items-center justify-between">
        <Logo size={24} />
        <p className="text-sm text-[#A09890]">© 2024 TruMate. Built for students.</p>
      </footer>

      {user && <BottomNav />}
    </div>
  );
}
