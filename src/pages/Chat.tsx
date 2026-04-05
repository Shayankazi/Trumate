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
    // Fetch match info and history
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

    // Setup Socket
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
          'Authorization': `Bearer ${token}`,
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
    <div className="flex flex-col h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-zinc-400">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={matchInfo.user.images[0]}
            alt={matchInfo.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-white font-bold leading-tight">{matchInfo.user.name}</h2>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
              {matchInfo.user.role}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-tr-none'
                    : 'bg-zinc-800 text-zinc-100 rounded-tl-none'
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#1A1A1A] border-t border-zinc-800">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            type="submit"
            className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-purple-500/20"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
