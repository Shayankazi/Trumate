import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import BottomNav from '../components/BottomNav';
import { MessageCircle, Heart, UserCheck, UserX, Clock, Sparkles, Send, MapPin } from 'lucide-react';
import { apiUrl } from '../lib/api';

interface Match {
  _id: string;
  user: {
    _id: string;
    name: string;
    images: string[];
    role: string;
    major?: string;
    college?: string;
  };
  compatibility_score: number;
  matched_at: string;
}

interface Request {
  _id: string;
  requester_id: {
    _id: string;
    name: string;
    images: string[];
    role: string;
    major?: string;
    college?: string;
    bio?: string;
  };
  target_id?: {
    _id: string;
    name: string;
    images: string[];
    role: string;
    major?: string;
    college?: string;
    location: { city: string };
  };
  compatibility_score: number;
  status: string;
}

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'matches' | 'requests' | 'sent'>('matches');
  const [matches, setMatches] = useState<Match[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [matchesRes, requestsRes, sentRes] = await Promise.all([
        fetch(apiUrl('/api/matches'), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(apiUrl('/api/matches/requests'), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(apiUrl('/api/matches/sent'), {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const matchesData = await matchesRes.json();
      const requestsData = await requestsRes.json();
      const sentData = await sentRes.json();

      setMatches(Array.isArray(matchesData) ? matchesData : []);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
      setSentRequests(Array.isArray(sentData) ? sentData : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAction = async (matchId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(apiUrl(`/api/matches/${matchId}/${action}`), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32 selection:bg-purple-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight">Connections</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <Sparkles size={12} className="text-purple-400" />
            Active Community
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 mb-8">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'matches'
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'requests'
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Received ({requests.length})
            {requests.length > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'sent'
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </motion.div>
          ) : activeTab === 'matches' ? (
            <motion.div
              key="matches-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4"
            >
              {matches.length === 0 ? (
                <div className="col-span-2 text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800">
                  <Heart className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No matches yet</p>
                  <button 
                    onClick={() => navigate('/discover')}
                    className="mt-4 text-purple-400 text-xs font-black hover:underline"
                  >
                    Go Swiping →
                  </button>
                </div>
              ) : (
                matches.map((match) => (
                  <motion.div
                    key={match._id}
                    layoutId={match._id}
                    onClick={() => navigate(`/chat/${match._id}`)}
                    className="group bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-zinc-800/50 hover:border-zinc-700/50 transition-all cursor-pointer"
                  >
                    <div className="aspect-[4/5] relative">
                      <img
                        src={match.user.images[0]}
                        alt={match.user.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 bg-zinc-950/40 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full text-[8px] font-black text-white">
                        {match.compatibility_score}%
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-black truncate text-sm">{match.user.name}</h3>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider truncate">
                          {match.user.major}
                        </p>
                      </div>
                    </div>
                    <div className="p-3">
                      <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <MessageCircle size={14} className="text-purple-400" />
                        Chat Now
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : activeTab === 'requests' ? (
            <motion.div
              key="requests-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {requests.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800">
                  <Clock className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No pending requests</p>
                </div>
              ) : (
                requests.map((request) => (
                  <motion.div
                    key={request._id}
                    layoutId={request._id}
                    className="bg-zinc-900/40 backdrop-blur-xl p-4 rounded-3xl border border-zinc-800/50 flex items-center gap-4"
                  >
                    <img
                      src={request.requester_id.images[0]}
                      alt={request.requester_id.name}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-black truncate">{request.requester_id.name}</h3>
                        <span className="bg-purple-500/10 text-purple-400 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                          {request.compatibility_score}% Match
                        </span>
                      </div>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest truncate mb-2">
                        {request.requester_id.major} • {request.requester_id.college}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(request._id, 'accept')}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          <UserCheck size={14} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(request._id, 'reject')}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-800/50 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                        >
                          <UserX size={14} />
                          Ignore
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="sent-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {sentRequests.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800">
                  <Send className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No requests sent yet</p>
                </div>
              ) : (
                sentRequests.map((req) => (
                  <motion.div
                    key={req._id}
                    layoutId={req._id}
                    className="bg-zinc-900/40 backdrop-blur-xl p-4 rounded-3xl border border-zinc-800/50 flex items-center gap-4 opacity-80"
                  >
                    <img
                      src={req.target_id?.images[0]}
                      alt={req.target_id?.name}
                      className="w-16 h-16 rounded-2xl object-cover grayscale"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-black truncate">{req.target_id?.name}</h3>
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} />
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                        <MapPin size={10} className="text-purple-500/50" />
                        <span className="text-[10px] font-bold">{req.target_id?.location.city}</span>
                      </div>
                      <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest truncate">
                        {req.target_id?.major} • {req.target_id?.college}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
