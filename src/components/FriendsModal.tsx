import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Swords, MessageSquare, Gift, Star, Trash2, Search, Check, X, Shield, Sparkles } from 'lucide-react';
import { Friend, UserProfile } from '../types';
import { audio } from '../utils/audio';

interface FriendsModalProps {
  show: boolean;
  onClose: () => void;
  friends: Friend[];
  profile: UserProfile;
  onAddFriend: (friend: Friend) => void;
  onRemoveFriend: (friendId: string) => void;
  onChallengeFriend: (friend: Friend) => void;
  onOpenChatWithFriend: (friend: Friend) => void;
  onSendGift: (friendId: string) => void;
}

const RECOMMENDED_FRIENDS: Omit<Friend, 'id'>[] = [
  {
    username: 'RexHunter_99 🦖',
    avatarColor: '#f59e0b',
    avatarIcon: 'Flame',
    status: 'online',
    currentGame: 'Jurassic Dino Dash',
    rankPoints: 4800,
    rankTier: 'master',
    totalPixels: 34200,
    duelWins: 42,
    duelLosses: 11
  },
  {
    username: 'CyberRaptor 🦕',
    avatarColor: '#06b6d4',
    avatarIcon: 'Zap',
    status: 'in-game',
    currentGame: 'Jurassic Pinball',
    rankPoints: 6100,
    rankTier: 'celestial',
    totalPixels: 51000,
    duelWins: 68,
    duelLosses: 19
  },
  {
    username: 'AmberQueen 💎',
    avatarColor: '#ec4899',
    avatarIcon: 'Crown',
    status: 'online',
    currentGame: 'Neon 2048 Fusion',
    rankPoints: 3900,
    rankTier: 'diamond',
    totalPixels: 28900,
    duelWins: 31,
    duelLosses: 14
  },
  {
    username: 'VoltMaster_FR ⚡',
    avatarColor: '#10b981',
    avatarIcon: 'Cpu',
    status: 'offline',
    rankPoints: 2100,
    rankTier: 'gold',
    totalPixels: 14200,
    duelWins: 18,
    duelLosses: 12
  }
];

export const FriendsModal: React.FC<FriendsModalProps> = ({
  show,
  onClose,
  friends,
  profile,
  onAddFriend,
  onRemoveFriend,
  onChallengeFriend,
  onOpenChatWithFriend,
  onSendGift
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFriendPseudo, setNewFriendPseudo] = useState('');
  const [selectedFriendPreview, setSelectedFriendPreview] = useState<Friend | null>(null);

  if (!show) return null;

  const filteredFriends = friends.filter(f =>
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCustomFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendPseudo.trim()) return;

    const newF: Friend = {
      id: `friend_${Date.now()}`,
      username: newFriendPseudo.trim(),
      avatarColor: '#06b6d4',
      avatarIcon: 'Zap',
      status: 'online',
      currentGame: 'Jurassic Dino Dash',
      rankPoints: 1200 + Math.floor(Math.random() * 3000),
      rankTier: 'gold',
      totalPixels: 5000 + Math.floor(Math.random() * 15000),
      duelWins: Math.floor(Math.random() * 20),
      duelLosses: Math.floor(Math.random() * 10)
    };

    onAddFriend(newF);
    setNewFriendPseudo('');
    setActiveTab('list');
    audio.playWin();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md font-mono select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border-2 border-cyan-500/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col text-white shadow-[0_0_60px_rgba(6,182,212,0.35)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/50 rounded-2xl text-cyan-400">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2 uppercase">
                  COMMUNAUTÉ & AMIS <span className="text-xs bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">{friends.length} AMIS</span>
                </h2>
                <p className="text-[11px] text-slate-400 font-sans">
                  Discutez, offrez des pixels et défiez vos ami(e)s en duel 1v1 !
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

          {/* Nav Tabs */}
          <div className="px-5 pt-3 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => { audio.playClick(); setActiveTab('list'); }}
                className={`px-4 py-2 font-black text-xs uppercase rounded-t-xl cursor-pointer border-t border-x transition flex items-center gap-1.5 ${
                  activeTab === 'list'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_-5px_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Users size={14} /> Liste d'amis ({friends.length})
              </button>

              <button
                onClick={() => { audio.playClick(); setActiveTab('add'); }}
                className={`px-4 py-2 font-black text-xs uppercase rounded-t-xl cursor-pointer border-t border-x transition flex items-center gap-1.5 ${
                  activeTab === 'add'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_-5px_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <UserPlus size={14} /> Ajouter un ami ➕
              </button>
            </div>

            {activeTab === 'list' && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un ami..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48"
                />
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {activeTab === 'list' ? (
              friends.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <Users size={48} className="text-slate-700 mb-3" />
                  <p className="text-slate-400 font-bold mb-2">Vous n'avez pas encore d'amis ajoutés.</p>
                  <p className="text-xs text-slate-500 font-sans max-w-sm mb-4">
                    Ajoutez des joueurs recommandés ou invitez vos amis par leur pseudo pour lancer des duels 1v1 !
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg hover:bg-cyan-400 transition cursor-pointer"
                  >
                    ➕ Découvrir des joueurs
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-3.5 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 rounded-2xl flex flex-col justify-between gap-3 transition shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg relative border-2 border-white/20 shadow-md"
                            style={{ backgroundColor: friend.avatarColor }}
                          >
                            <span>{friend.username.charAt(0)}</span>
                            {/* Status Indicator */}
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                                friend.status === 'online'
                                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                  : friend.status === 'in-game'
                                  ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                                  : 'bg-slate-600'
                              }`}
                            />
                          </div>

                          <div>
                            <span className="text-sm font-black text-white block">{friend.username}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              {friend.status === 'in-game' ? (
                                <span className="text-purple-400">🎮 En jeu: {friend.currentGame}</span>
                              ) : friend.status === 'online' ? (
                                <span className="text-emerald-400">🟢 En ligne</span>
                              ) : (
                                <span>⚪ Hors ligne</span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-yellow-400">{friend.totalPixels} PX</span>
                          <span className="text-[10px] text-slate-400 block">{friend.duelWins}V / {friend.duelLosses}D</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => { audio.playClick(); onChallengeFriend(friend); }}
                          className="flex-1 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-[11px] uppercase rounded-xl flex items-center justify-center gap-1 transition cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        >
                          <Swords size={13} /> Défier
                        </button>

                        <button
                          onClick={() => { audio.playClick(); onOpenChatWithFriend(friend); }}
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 rounded-xl transition cursor-pointer"
                          title="Envoyer un message"
                        >
                          <MessageSquare size={14} />
                        </button>

                        <button
                          onClick={() => { audio.playWin(); onSendGift(friend.id); }}
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-yellow-400 rounded-xl transition cursor-pointer"
                          title="Offrir +50 PX"
                        >
                          <Gift size={14} />
                        </button>

                        <button
                          onClick={() => { audio.playClick(); onRemoveFriend(friend.id); }}
                          className="p-2 bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-500 text-slate-500 hover:text-rose-400 rounded-xl transition cursor-pointer"
                          title="Retirer l'ami"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Add Friends Tab */
              <div className="space-y-6">
                {/* Custom Username Input */}
                <form onSubmit={handleCreateCustomFriend} className="p-4 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserPlus size={14} /> Ajouter un ami par son pseudo
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Entrez le pseudo du joueur..."
                      value={newFriendPseudo}
                      onChange={(e) => setNewFriendPseudo(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase rounded-xl transition cursor-pointer shadow-md"
                    >
                      Envoyer demande ➕
                    </button>
                  </div>
                </form>

                {/* Recommended Arcade Players */}
                <div>
                  <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} /> Joueurs Recommandés de la Saison 2 Jurassique
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {RECOMMENDED_FRIENDS.map((rec, i) => {
                      const alreadyFriend = friends.some(f => f.username === rec.username);

                      return (
                        <div
                          key={i}
                          className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md"
                              style={{ backgroundColor: rec.avatarColor }}
                            >
                              {rec.username.charAt(0)}
                            </div>
                            <div>
                              <span className="text-xs font-black text-white block">{rec.username}</span>
                              <span className="text-[10px] text-slate-400">
                                {rec.rankPoints} RP • {rec.totalPixels} PX
                              </span>
                            </div>
                          </div>

                          <button
                            disabled={alreadyFriend}
                            onClick={() => {
                              onAddFriend({
                                id: `friend_rec_${i}_${Date.now()}`,
                                ...rec
                              });
                            }}
                            className={`px-3 py-1.5 rounded-xl font-black text-[10px] uppercase transition cursor-pointer ${
                              alreadyFriend
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                            }`}
                          >
                            {alreadyFriend ? '✓ Déjà ami' : '➕ Ajouter'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FriendsModal;
