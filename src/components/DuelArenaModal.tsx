import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Crown, Flame, Shield, Play, RotateCcw, Check, X, Users, Zap, Award } from 'lucide-react';
import { Friend, UserProfile, GameData, DuelChallenge } from '../types';
import { GAMES_LIST } from '../gamesData';
import { audio } from '../utils/audio';

interface DuelArenaModalProps {
  show: boolean;
  onClose: () => void;
  profile: UserProfile;
  friends?: Friend[];
  initialOpponent?: Friend | null;
  onStartDuelGame?: (gameId: string, opponent: Friend, wager: number) => void;
  onClaimDuelWin?: (wager: number, opponentName: string, gameName: string) => void;
  onClaimDuelLoss?: (wager: number, opponentName: string, gameName: string) => void;
  duelHistory?: DuelChallenge[];
}

const WAGER_OPTIONS = [0, 50, 100, 250, 500, 1000];

export const DuelArenaModal: React.FC<DuelArenaModalProps> = ({
  show,
  onClose,
  profile,
  friends = [],
  initialOpponent,
  onStartDuelGame,
  onClaimDuelWin,
  onClaimDuelLoss,
  duelHistory = []
}) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(
    initialOpponent || (friends && friends.length > 0 ? friends[0] : null)
  );
  const [selectedGameId, setSelectedGameId] = useState<string>('dino_dash');
  const [selectedWager, setSelectedWager] = useState<number>(100);
  const [duelStep, setDuelStep] = useState<'setup' | 'simulation' | 'result'>('setup');
  const [simulatedPlayerScore, setSimulatedPlayerScore] = useState<number>(0);
  const [simulatedOpponentScore, setSimulatedOpponentScore] = useState<number>(0);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  if (!show) return null;

  const selectedGame = GAMES_LIST.find(g => g.id === selectedGameId) || GAMES_LIST[0];

  const handleLaunchDuel = () => {
    if (!selectedFriend) return;
    if (selectedWager > profile.totalPixels) {
      alert('Vous n\'avez pas assez de Pixels pour cette mise !');
      return;
    }

    audio.playStart();

    // Launch instant duel simulation or direct game
    setDuelStep('simulation');

    // Simulate match showdown progress
    let pScore = 0;
    let oScore = 0;
    const interval = setInterval(() => {
      pScore += Math.floor(Math.random() * 80 + 30);
      oScore += Math.floor(Math.random() * 75 + 25);
      setSimulatedPlayerScore(pScore);
      setSimulatedOpponentScore(oScore);
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      // Give slight advantage to player if high rank
      const win = pScore >= oScore;
      setIsWinner(win);
      setDuelStep('result');

      if (win) {
        audio.playWin();
        if (typeof onClaimDuelWin === 'function') {
          onClaimDuelWin(selectedWager, selectedFriend.username, selectedGame.frenchName || selectedGame.name);
        }
      } else {
        audio.playGameOver();
        if (typeof onClaimDuelLoss === 'function') {
          onClaimDuelLoss(selectedWager, selectedFriend.username, selectedGame.frenchName || selectedGame.name);
        }
      }
    }, 3200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md font-mono select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col text-white shadow-[0_0_60px_rgba(244,63,94,0.35)] overflow-hidden"
        >
          {/* Top Bar Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-400">
                <Swords size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2 uppercase">
                  ARÈNE DE DUELS 1V1 <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">SAISON 2 JURASSIC</span>
                </h2>
                <p className="text-[11px] text-slate-400 font-sans">
                  Défiez vos ami(e)s, misez des Pixels et prouvez votre suprématie d'arcade !
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

          {/* Navigation Tabs */}
          <div className="px-5 pt-3 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => { audio.playClick(); setActiveTab('create'); setDuelStep('setup'); }}
                className={`px-4 py-2 font-black text-xs uppercase rounded-t-xl cursor-pointer border-t border-x transition flex items-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-[0_-5px_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Swords size={14} /> Nouveau Duel 1v1
              </button>

              <button
                onClick={() => { audio.playClick(); setActiveTab('history'); }}
                className={`px-4 py-2 font-black text-xs uppercase rounded-t-xl cursor-pointer border-t border-x transition flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_-5px_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Trophy size={14} /> Historique des Duels ({duelHistory.length})
              </button>
            </div>

            {/* User Record */}
            <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold flex items-center gap-2">
              <span className="text-emerald-400 font-black">{profile.duelWins || 0}V</span>
              <span>-</span>
              <span className="text-rose-400 font-black">{profile.duelLosses || 0}D</span>
              {(profile.duelWinStreak || 0) > 1 && (
                <span className="text-yellow-400 font-black text-[10px] ml-1 bg-yellow-400/20 px-1.5 py-0.5 rounded">
                  🔥 SÉRIE x{profile.duelWinStreak}
                </span>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1">
            {activeTab === 'history' ? (
              duelHistory.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <Trophy size={48} className="text-slate-700 mb-3" />
                  <p className="text-slate-400 font-bold mb-1">Aucun duel enregistré pour l'instant.</p>
                  <p className="text-xs text-slate-500 font-sans">
                    Lancez votre premier défi 1v1 contre un ami pour remplir votre historique !
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {duelHistory.map((duel) => {
                    const isWin = duel.winnerId === 'user' || duel.winnerId === profile.username;
                    return (
                      <div
                        key={duel.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between ${
                          isWin
                            ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                              isWin ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                            }`}
                          >
                            {isWin ? '👑' : '💀'}
                          </div>
                          <div>
                            <span className="text-xs font-black text-white block">
                              {isWin ? 'VICTOIRE' : 'DÉFAITE'} vs {duel.challengedName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Jeu : {duel.gameName} • Mise : {duel.wagerPx} PX
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-sm font-black ${
                              isWin ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isWin ? `+${duel.wagerPx * 2} PX` : `-${duel.wagerPx} PX`}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {new Date(duel.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : duelStep === 'setup' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Select Friend / Opponent */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Users size={14} /> 1. Choisir l'Adversaire
                    </h3>

                    {friends.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Ajoutez des amis dans l'onglet Amis pour les défier !
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {friends.map(f => (
                          <div
                            key={f.id}
                            onClick={() => { setSelectedFriend(f); audio.playClick(); }}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              selectedFriend?.id === f.id
                                ? 'bg-rose-500/20 border-rose-400 text-white shadow-md'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white"
                                style={{ backgroundColor: f.avatarColor }}
                              >
                                {f.username.charAt(0)}
                              </div>
                              <div>
                                <span className="text-xs font-black block">{f.username}</span>
                                <span className="text-[9px] text-slate-400">{f.duelWins}V / {f.duelLosses}D</span>
                              </div>
                            </div>
                            {selectedFriend?.id === f.id && <Check size={14} className="text-rose-400" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Select Game */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Play size={14} /> 2. Choisir l'Épreuve
                    </h3>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {GAMES_LIST.slice(0, 15).map(game => (
                        <div
                          key={game.id}
                          onClick={() => { setSelectedGameId(game.id); audio.playClick(); }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                            selectedGameId === game.id
                              ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-black block">{game.frenchName || game.name}</span>
                            <span className="text-[9px] text-slate-400 uppercase">{game.category}</span>
                          </div>
                          {selectedGameId === game.id && <Check size={14} className="text-amber-400" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Select Wager & Summary */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Zap size={14} /> 3. Mise en Pixels (PX)
                    </h3>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {WAGER_OPTIONS.map(w => (
                        <button
                          key={w}
                          onClick={() => { setSelectedWager(w); audio.playClick(); }}
                          className={`py-2 rounded-xl text-xs font-black uppercase transition cursor-pointer border ${
                            selectedWager === w
                              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {w === 0 ? 'Honneur' : `${w} PX`}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-[11px] mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gains Victoire:</span>
                        <span className="font-black text-yellow-400">
                          {selectedWager === 0 ? 'Honneur & RP' : `+${selectedWager * 2} PX`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Votre Solde:</span>
                        <span className="font-black text-white">{profile.totalPixels} PX</span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!selectedFriend}
                    onClick={handleLaunchDuel}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 ${
                      selectedFriend
                        ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 hover:from-rose-400 hover:to-yellow-300 text-slate-950 shadow-[0_0_25px_rgba(244,63,94,0.5)] active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Swords size={16} /> LANCER LE DUEL MAINTENANT
                  </button>
                </div>
              </div>
            ) : duelStep === 'simulation' ? (
              /* Live Showdown Simulation Screen */
              <div className="p-8 flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                  <span className="text-xs text-rose-400 font-black tracking-widest uppercase block animate-pulse">
                    DUEL 1V1 EN COURS SUR {selectedGame.frenchName?.toUpperCase()}
                  </span>
                  <h3 className="text-2xl font-black text-white">ÉPREUVE EN DIRECT...</h3>
                </div>

                <div className="w-full max-w-lg grid grid-cols-2 gap-6 items-center">
                  {/* Player Side */}
                  <div className="p-4 bg-slate-950 border-2 border-cyan-500/80 rounded-2xl text-center shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                    <span className="text-xs font-black text-cyan-400 block mb-1">{profile.username}</span>
                    <span className="text-3xl font-black text-white">{simulatedPlayerScore}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">PTS DUEL</span>
                  </div>

                  {/* Opponent Side */}
                  <div className="p-4 bg-slate-950 border-2 border-rose-500/80 rounded-2xl text-center shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                    <span className="text-xs font-black text-rose-400 block mb-1">{selectedFriend?.username}</span>
                    <span className="text-3xl font-black text-white">{simulatedOpponentScore}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">PTS DUEL</span>
                  </div>
                </div>

                <div className="w-full max-w-lg h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500 animate-[pulse_1s_infinite]"
                    style={{
                      width: `${
                        (simulatedPlayerScore / (simulatedPlayerScore + simulatedOpponentScore + 1)) * 100
                      }%`
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Duel Result Screen */
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl ${
                    isWinner
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 border-2 border-yellow-200 shadow-[0_0_35px_rgba(250,204,21,0.6)]'
                      : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                  }`}
                >
                  {isWinner ? '👑' : '💀'}
                </div>

                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-yellow-300 uppercase tracking-wider">
                  {isWinner ? 'VICTOIRE ÉCLATANTE !' : 'DÉFAITE AU DUEL'}
                </h3>

                <p className="text-xs text-slate-300 font-sans max-w-sm">
                  {isWinner
                    ? `Félicitations ! Vous avez battu ${selectedFriend?.username} sur ${selectedGame.frenchName} et remporté la mise !`
                    : `${selectedFriend?.username} a été plus rapide cette fois. Prenez votre revanche !`}
                </p>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block">VOTRE SCORE</span>
                    <span className="text-lg font-black text-cyan-400">{simulatedPlayerScore} PTS</span>
                  </div>
                  <div className="w-px bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">SCORE ADVERSE</span>
                    <span className="text-lg font-black text-rose-400">{simulatedOpponentScore} PTS</span>
                  </div>
                  <div className="w-px bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">GAIN / PERTE</span>
                    <span className={`text-lg font-black ${isWinner ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {isWinner ? `+${selectedWager * 2} PX` : `-${selectedWager} PX`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => { setDuelStep('setup'); audio.playClick(); }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
                  >
                    🔄 REVANCHE IMMÉDIATE
                  </button>

                  <button
                    onClick={() => { onClose(); audio.playClick(); }}
                    className="px-6 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-black text-xs uppercase rounded-xl transition cursor-pointer"
                  >
                    FERMER
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DuelArenaModal;
