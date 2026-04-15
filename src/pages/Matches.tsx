import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import BottomNav from '../components/BottomNav';
import { MessageCircle, Heart, UserCheck, UserX, Clock, Send, MapPin } from 'lucide-react';
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
        fetch(apiUrl('/api/matches'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/matches/requests'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/matches/sent'), { headers: { Authorization: `Bearer ${token}` } }),
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
      if (response.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    { key: 'matches', label: 'Matches', count: matches.length },
    { key: 'requests', label: 'Requests', count: requests.length, dot: requests.length > 0 },
    { key: 'sent', label: 'Sent', count: sentRequests.length },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F6F2] pb-28">
      <div className="max-w-xl mx-auto px-5 pt-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1A1714]">Connections</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-[#E8E5DF] p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#1A1714] text-white shadow-sm'
                  : 'text-[#706B64] hover:text-[#1A1714]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 text-xs ${
                    activeTab === tab.key ? 'text-white/60' : 'text-[#A09890]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {'dot' in tab && tab.dot && activeTab !== tab.key && (
                <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-[#D94F1E] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <div className="w-8 h-8 border-2 border-[#E8E5DF] border-t-[#D94F1E] rounded-full animate-spin" />
            </motion.div>
          ) : activeTab === 'matches' ? (
            <motion.div
              key="matches-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {matches.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-center">
                  <div className="w-16 h-16 bg-white border border-[#E8E5DF] rounded-2xl flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7 text-[#D8D4CC]" />
                  </div>
                  <p className="text-[#706B64] font-medium mb-1">No matches yet</p>
                  <p className="text-[#A09890] text-sm mb-5">Start swiping to find your roommate</p>
                  <button
                    onClick={() => navigate('/discover')}
                    className="px-6 py-2.5 bg-[#D94F1E] text-white rounded-xl text-sm font-semibold hover:bg-[#C2441A] transition-colors"
                  >
                    Go to Discover
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {matches.map((match) => (
                    <motion.div
                      key={match._id}
                      layoutId={match._id}
                      onClick={() => navigate(`/chat/${match._id}`)}
                      className="bg-white rounded-2xl overflow-hidden border border-[#E8E5DF] cursor-pointer hover:border-[#D8D4CC] hover:shadow-sm transition-all"
                    >
                      <div className="aspect-[4/5] relative">
                        <img
                          src={match.user.images[0]}
                          alt={match.user.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-2.5 right-2.5 bg-[#D94F1E] px-2 py-0.5 rounded-full text-[10px] font-semibold text-white">
                          {match.compatibility_score}%
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-semibold text-sm truncate">{match.user.name}</h3>
                          <p className="text-white/60 text-xs truncate">{match.user.major}</p>
                        </div>
                      </div>
                      <div className="p-2.5">
                        <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#F8F6F2] hover:bg-[#F0EDE8] text-[#1A1714] rounded-lg text-xs font-medium transition-colors">
                          <MessageCircle size={13} />
                          Message
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeTab === 'requests' ? (
            <motion.div
              key="requests-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {requests.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-center">
                  <div className="w-16 h-16 bg-white border border-[#E8E5DF] rounded-2xl flex items-center justify-center mb-4">
                    <Clock className="w-7 h-7 text-[#D8D4CC]" />
                  </div>
                  <p className="text-[#706B64] font-medium">No pending requests</p>
                  <p className="text-[#A09890] text-sm mt-1">When someone likes you, they'll show up here</p>
                </div>
              ) : (
                requests.map((request) => (
                  <motion.div
                    key={request._id}
                    layoutId={request._id}
                    className="bg-white border border-[#E8E5DF] p-4 rounded-2xl flex items-center gap-4"
                  >
                    <img
                      src={request.requester_id.images[0]}
                      alt={request.requester_id.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[#1A1714] font-semibold truncate text-sm">
                          {request.requester_id.name}
                        </h3>
                        <span className="shrink-0 text-[10px] font-semibold text-[#D94F1E] bg-[#FEF0EB] px-1.5 py-0.5 rounded-md">
                          {request.compatibility_score}%
                        </span>
                      </div>
                      <p className="text-[#A09890] text-xs truncate mb-3">
                        {request.requester_id.major} · {request.requester_id.college}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(request._id, 'accept')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1A1714] text-white rounded-lg text-xs font-semibold hover:bg-[#2d2926] transition-colors"
                        >
                          <UserCheck size={13} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(request._id, 'reject')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#F8F6F2] text-[#706B64] rounded-lg text-xs font-semibold hover:bg-[#F0EDE8] transition-colors border border-[#E8E5DF]"
                        >
                          <UserX size={13} />
                          Decline
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {sentRequests.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-center">
                  <div className="w-16 h-16 bg-white border border-[#E8E5DF] rounded-2xl flex items-center justify-center mb-4">
                    <Send className="w-7 h-7 text-[#D8D4CC]" />
                  </div>
                  <p className="text-[#706B64] font-medium">No sent requests</p>
                  <p className="text-[#A09890] text-sm mt-1">Swipe right on someone to send a request</p>
                </div>
              ) : (
                sentRequests.map((req) => (
                  <motion.div
                    key={req._id}
                    layoutId={req._id}
                    className="bg-white border border-[#E8E5DF] p-4 rounded-2xl flex items-center gap-4"
                  >
                    <img
                      src={req.target_id?.images[0]}
                      alt={req.target_id?.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 opacity-70"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-[#1A1714] font-semibold text-sm truncate">
                          {req.target_id?.name}
                        </h3>
                        <span className="shrink-0 flex items-center gap-1 text-xs text-[#A09890]">
                          <Clock size={11} />
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#A09890] text-xs mb-0.5">
                        <MapPin size={10} />
                        {req.target_id?.location.city}
                      </div>
                      <p className="text-[#A09890] text-xs truncate">
                        {req.target_id?.major} · {req.target_id?.college}
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
