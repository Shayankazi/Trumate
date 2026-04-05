import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, BookOpen, Users, ArrowRight, Heart, MessageCircle, Sparkles } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const user = useAuthStore((state) => state.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500/30 overflow-x-hidden pb-32">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Heart className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            TruMate
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Link
            to={user ? "/discover" : "/login"}
            className="group relative px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 font-medium text-sm">
              {user ? "Go to Dashboard" : "Sign In"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
              The Next Gen Student Matcher
            </span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]"
          >
            Find your <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              ideal roommate
            </span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
          >
            Ditch the sketchy campus flyers. Use TruMate to find fellow students 
            based on major, study habits, and lifestyle. Built specifically for campus life.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link
              to={user ? "/discover" : "/login"}
              className="group relative inline-flex items-center gap-2 bg-white text-black font-bold text-lg px-8 py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {user ? 'Go to Discover' : 'Start Swiping'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-2xl border border-zinc-800 font-bold text-lg hover:bg-zinc-900 transition-all">
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Floating UI Elements Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-32 w-full grid md:grid-cols-3 gap-6 relative"
        >
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group p-8 rounded-[2rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-900/50 transition-all duration-500 text-left"
          >
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <GraduationCap size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Campus Circle</h3>
            <p className="text-zinc-500 leading-relaxed">Connect exclusively with students from your college or nearby verified universities.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group p-8 rounded-[2rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-900/50 transition-all duration-500 text-left"
          >
            <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Study Habits</h3>
            <p className="text-zinc-500 leading-relaxed">Match with early birds or night owls who respect your intense exam study schedules.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group p-8 rounded-[2rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-900/50 transition-all duration-500 text-left"
          >
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Real Matches</h3>
            <p className="text-zinc-500 leading-relaxed">Safety first. Connect with real students through our mutual-like discovery system.</p>
          </motion.div>
        </motion.div>

        {/* Demo Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 w-full"
        >
          <div className="relative max-w-4xl mx-auto rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
            <img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern+mobile+app+interface+on+iphone+showing+a+dating+app+style+card+for+roommate+matching+dark+mode+purple+accents&image_size=landscape_16_9" 
              alt="App Demo" 
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute bottom-12 left-12 right-12 z-20 text-left flex items-end justify-between">
              <div>
                <h4 className="text-3xl font-bold mb-2">Modern Swipe UI</h4>
                <p className="text-zinc-400">Experience roommate hunting like never before.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-700 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Heart className="w-6 h-6 text-black" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto px-8 py-20 text-center border-t border-zinc-900 mt-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center opacity-50">
            <Heart className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <p className="text-zinc-600 text-sm">© 2024 TruMate. Built for the modern student experience.</p>
        </div>
      </footer>

      {user ? <BottomNav /> : null}
    </div>
  );
}
