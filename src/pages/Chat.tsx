import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiUrl } from '../lib/api';

interface Message {
  _id: string;
  sender_id: string;
  content: string;
  timestamp: string;
}

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMatchAndHistory = async () => {
      try {
        const [matchRes, historyRes] = await Promise.all([
          fetch(apiUrl('/api/matches'), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(apiUrl(`/api/messages/${matchId}`), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const matches = await matchRes.json();
        const history = await historyRes.json();

        const currentMatch = matches.find((m: any) => m._id === matchId);
        setMatchInfo(currentMatch);
        setMessages(history);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMatchAndHistory();

    socketRef.current = io(apiUrl('/'));
    socketRef.current.emit('join_match', matchId);

    socketRef.current.on('receive_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [matchId, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(apiUrl('/api/messages/send'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ matchId, content: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!matchInfo) return null;

  return (
    <div className="flex flex-col h-screen bg-[#F8F6F2]">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-[#E8E5DF] sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0EDE8] text-[#706B64] hover:text-[#1A1714] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <img
          src={matchInfo.user.images[0]}
          alt={matchInfo.user.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <h2 className="text-[#1A1714] font-semibold text-sm leading-tight">
            {matchInfo.user.name}
          </h2>
          <p className="text-[#A09890] text-xs capitalize">{matchInfo.user.role}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-[#A09890] text-sm">
              Say hi to {matchInfo.user.name}! You matched — don't be shy.
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-[#1A1714] text-white rounded-br-sm'
                    : 'bg-white text-[#1A1714] border border-[#E8E5DF] rounded-bl-sm'
                }`}
              >
                {msg.content}
                <div
                  className={`text-[10px] mt-1 ${
                    isMe ? 'text-white/40 text-right' : 'text-[#A09890]'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-[#E8E5DF]">
        <form onSubmit={handleSendMessage} className="flex gap-2.5 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#F8F6F2] border border-[#E8E5DF] rounded-xl px-4 py-3 text-[#1A1714] text-sm placeholder:text-[#A09890] focus:outline-none focus:border-[#D8D4CC] transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-11 h-11 bg-[#D94F1E] rounded-xl flex items-center justify-center text-white hover:bg-[#C2441A] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
