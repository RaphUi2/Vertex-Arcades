import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, Trophy, Swords, Smile, User, X, Hash, Zap } from 'lucide-react';
import { ChatMessage, UserProfile, Friend } from '../types';
import { audio } from '../utils/audio';

interface ArcadeChatModalProps {
  show: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  profile: UserProfile;
  friends: Friend[];
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  onChallengeUser: (username: string) => void;
}

const QUICK_EMOJIS = ['🦖', '🦕', '⚡', '🔥', '👑', '🏆', '💎', '💀', '🚀', '🎮'];
const QUICK_SHOUTS = [
  'Qui est chaud pour un duel sur Jurassic Dino Dash ? 🦖',
  'Je viens de battre mon record ! 🏆',
  'La Saison 2 Jurassique est incroyable ! 🔥',
  'GG à tous pour les raids de boss ! ⚔️',
  'Besoin d\'un défi 1v1 avec mise de 500 PX ! 💰'
];

export const ArcadeChatModal: React.FC<ArcadeChatModalProps> = ({
  show,
  onClose,
  messages = [],
  profile,
  friends = [],
  onSendMessage,
  onChallengeUser
}) => {
  const [activeChannel, setActiveChannel] = useState<'general' | 'jurassic' | 'duels' | 'dm'>('general');
  const [selectedDmFriend, setSelectedDmFriend] = useState<Friend | null>((friends && friends[0]) || null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (show) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, show, activeChannel]);

  if (!show) return null;

  const currentChannelMessages = messages.filter(m => {
    if (activeChannel === 'dm') {
      if (!selectedDmFriend) return false;
      return (
        m.channel === 'dm' &&
        ((m.senderName === profile.username && m.recipientId === selectedDmFriend.id) ||
          (m.senderName === selectedDmFriend.username))
      );
    }
    return m.channel === activeChannel;
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage({
      senderId: 'user',
      senderName: profile.username || 'Pilote_Cyber',
      senderColor: profile.avatarColor || '#06b6d4',
      senderIcon: profile.avatarIcon || 'Zap',
      senderRank: profile.title || 'APEX PILOTE',
      message: inputMessage.trim(),
      channel: activeChannel,
      recipientId: activeChannel === 'dm' ? selectedDmFriend?.id : undefined
    });

    setInputMessage('');
    audio.playClick();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md font-mono select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col text-white shadow-[0_0_60px_rgba(16,185,129,0.35)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-400">
                <MessageSquare size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2 uppercase">
                  TCHAT ARCADE LIVE <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">EN DIRECT</span>
                </h2>
                <p className="text-[11px] text-slate-400 font-sans">
                  Échangez en temps réel avec la communauté Vertex Arcades & défiez les joueurs !
                </p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Chat Layout: Channels Sidebar + Chat Window */}
          <div className="flex-1 flex overflow-hidden">
            {/* Channels Sidebar */}
            <div className="w-56 bg-slate-950/80 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-2 mb-2">SALONS PUBLICS</span>

                <button
                  onClick={() => { audio.playClick(); setActiveChannel('general'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                    activeChannel === 'general'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Hash size={15} /> #Général
                </button>

                <button
                  onClick={() => { audio.playClick(); setActiveChannel('jurassic'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                    activeChannel === 'jurassic'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>🦖</span> #Saison-2-Jurassic
                </button>

                <button
                  onClick={() => { audio.playClick(); setActiveChannel('duels'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                    activeChannel === 'duels'
                      ? 'bg-rose-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Swords size={15} /> #Défis-Duels
                </button>

                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-2 mt-4 mb-2">MESSAGES PRIVÉS</span>

                <button
                  onClick={() => { audio.playClick(); setActiveChannel('dm'); }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                    activeChannel === 'dm'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <User size={15} /> #Amis-DMs
                </button>

                {activeChannel === 'dm' && (
                  <div className="pl-3 space-y-1 mt-1">
                    {friends.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedDmFriend(f)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left flex items-center justify-between transition cursor-pointer ${
                          selectedDmFriend?.id === f.id
                            ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{f.username}</span>
                        <span className={`w-2 h-2 rounded-full ${f.status === 'online' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Self Info Box */}
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {profile.username?.charAt(0) || 'P'}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">{profile.username}</span>
                  <span className="text-[9px] text-yellow-400 font-bold block">{profile.totalPixels} PX</span>
                </div>
              </div>
            </div>

            {/* Chat Messages Feed and Input */}
            <div className="flex-1 flex flex-col bg-slate-900/60 justify-between">
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {currentChannelMessages.map((msg) => {
                  const isMe = msg.senderName === profile.username;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 items-start ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md border border-white/20"
                        style={{ backgroundColor: msg.senderColor }}
                      >
                        {msg.senderName.charAt(0)}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-black text-slate-300">{msg.senderName}</span>
                          {msg.senderRank && (
                            <span className="text-[9px] bg-slate-800 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                              {msg.senderRank}
                            </span>
                          )}
                          <span className="text-[9px] text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl text-xs font-sans ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-tr-none shadow-[0_0_15px_rgba(5,150,105,0.3)]'
                              : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                          }`}
                        >
                          {msg.message}

                          {msg.scoreFlex && (
                            <div className="mt-2 p-2 bg-slate-900 border border-yellow-400/40 rounded-xl flex items-center justify-between text-yellow-300 text-[11px] font-mono">
                              <span>🏆 {msg.scoreFlex.gameName}</span>
                              <span className="font-black text-white">{msg.scoreFlex.score} PTS</span>
                            </div>
                          )}
                        </div>

                        {!isMe && (
                          <button
                            onClick={() => { audio.playClick(); onChallengeUser(msg.senderName); }}
                            className="mt-1 text-[10px] text-rose-400 hover:text-rose-300 font-black uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Swords size={11} /> Défier en duel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Shouts & Emojis Bar */}
              <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex gap-2 overflow-x-auto shrink-0 items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">RAPIDE :</span>
                {QUICK_EMOJIS.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => { setInputMessage(prev => prev + emoji); audio.playClick(); }}
                    className="p-1 hover:bg-slate-800 rounded-lg text-sm cursor-pointer transition"
                  >
                    {emoji}
                  </button>
                ))}
                <div className="h-4 w-px bg-slate-800 shrink-0" />
                {QUICK_SHOUTS.map((shout, i) => (
                  <button
                    key={i}
                    onClick={() => { setInputMessage(shout); audio.playClick(); }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 rounded-lg shrink-0 whitespace-nowrap cursor-pointer transition"
                  >
                    {shout.slice(0, 26)}...
                  </button>
                ))}
              </div>

              {/* Text Input Area */}
              <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder={`Envoyer un message dans #${activeChannel === 'dm' ? (selectedDmFriend?.username || 'ami') : activeChannel}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer ${
                    inputMessage.trim()
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={14} /> Envoyer
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ArcadeChatModal;
