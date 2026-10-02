import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BookOpen, Star, Trophy, Coins, Shield, Zap, Sparkles,
  Flame, Swords, CheckCircle2, ChevronRight, Award, Skull, RotateCcw
} from 'lucide-react';
import { StoryChapter, StoryModeState } from '../types';
import { audio } from '../utils/audio';
import { Language, getTranslation } from '../utils/i18n';

interface StoryModeModalProps {
  storyState: StoryModeState;
  onUpdateStory: (updated: StoryModeState) => void;
  onEarnVCoins: (coins: number) => void;
  onEarnTrophies: (trophies: number) => void;
  onClose: () => void;
  language?: Language;
}

export function StoryModeModal({
  storyState,
  onUpdateStory,
  onEarnVCoins,
  onEarnTrophies,
  onClose,
  language = 'en'
}: StoryModeModalProps) {
  const t = getTranslation(language);
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [battleState, setBattleState] = useState<{
    inBattle: boolean;
    playerHp: number;
    playerMaxHp: number;
    playerShield: number;
    bossHp: number;
    bossMaxHp: number;
    turn: 'player' | 'boss';
    combatLog: string[];
    isVictory: boolean;
    isDefeat: boolean;
  } | null>(null);

  const startChapter = (chapter: StoryChapter) => {
    if (!chapter.isUnlocked) return;
    audio.playClick();
    setSelectedChapter(chapter);
    setBattleState({
      inBattle: true,
      playerHp: chapter.playerMaxHp,
      playerMaxHp: chapter.playerMaxHp,
      playerShield: 0,
      bossHp: chapter.enemyMaxHp,
      bossMaxHp: chapter.enemyMaxHp,
      turn: 'player',
      combatLog: [`Rencontre engagée contre ${chapter.enemyName} !`],
      isVictory: false,
      isDefeat: false
    });
  };

  const executeAction = (action: 'attack' | 'shield' | 'critical' | 'heal') => {
    if (!battleState || battleState.turn !== 'player' || battleState.isVictory || battleState.isDefeat || !selectedChapter) return;

    let pDamage = 0;
    let pShieldGain = 0;
    let pHeal = 0;
    let logMsg = '';

    if (action === 'attack') {
      audio.playLaser();
      pDamage = Math.floor(25 + Math.random() * 15);
      logMsg = `Vous tirez une salve plasma infligeant ${pDamage} dégâts !`;
    } else if (action === 'shield') {
      audio.playClick();
      pShieldGain = 35;
      logMsg = `Vous activez le blindage magnétique (+35 armure) !`;
    } else if (action === 'critical') {
      audio.playWin();
      const isHit = Math.random() > 0.3;
      pDamage = isHit ? Math.floor(55 + Math.random() * 30) : 0;
      logMsg = isHit
        ? `⚡ COUP CRITIQUE FOUDROYANT ! ${pDamage} dégâts massifs !`
        : `L'attaque chargée a manqué sa cible !`;
    } else if (action === 'heal') {
      audio.playLevelUp();
      pHeal = 40;
      logMsg = `Soin quantique activé (+40 PV restaurés) !`;
    }

    const nextBossHp = Math.max(0, battleState.bossHp - pDamage);
    const nextPlayerHp = Math.min(battleState.playerMaxHp, battleState.playerHp + pHeal);
    const nextPlayerShield = battleState.playerShield + pShieldGain;

    if (nextBossHp <= 0) {
      // Victory!
      audio.playWin();
      const starsEarned = nextPlayerHp > battleState.playerMaxHp * 0.7 ? 3 : nextPlayerHp > battleState.playerMaxHp * 0.3 ? 2 : 1;
      
      const updatedChapters = storyState.chapters.map(c => {
        if (c.id === selectedChapter.id) {
          return { ...c, isCompleted: true, stars: Math.max(c.stars, starsEarned) };
        }
        // Unlock next chapter
        if (c.id === selectedChapter.id + 1) {
          return { ...c, isUnlocked: true };
        }
        return c;
      });

      const totalStars = updatedChapters.reduce((acc, c) => acc + c.stars, 0);
      onUpdateStory({
        ...storyState,
        chapters: updatedChapters,
        totalStars,
        currentChapterId: Math.max(storyState.currentChapterId, selectedChapter.id + 1)
      });

      onEarnVCoins(selectedChapter.rewardVCoins);
      onEarnTrophies(100);

      setBattleState({
        ...battleState,
        bossHp: 0,
        playerHp: nextPlayerHp,
        playerShield: nextPlayerShield,
        combatLog: [logMsg, `🎉 Victoire retentissante ! ${selectedChapter.enemyName} est vaincu !`],
        isVictory: true,
        turn: 'player'
      });
      return;
    }

    // Boss Counter-attack
    setBattleState({
      ...battleState,
      bossHp: nextBossHp,
      playerHp: nextPlayerHp,
      playerShield: nextPlayerShield,
      combatLog: [logMsg, `${selectedChapter.enemyName} prépare sa contre-offensive...`],
      turn: 'boss'
    });

    setTimeout(() => {
      audio.playDamage();
      const bossAttack = Math.floor(20 + Math.random() * 20);
      let absorbed = Math.min(nextPlayerShield, bossAttack);
      let remainingDamage = bossAttack - absorbed;
      let afterShield = Math.max(0, nextPlayerShield - absorbed);
      let afterHp = Math.max(0, nextPlayerHp - remainingDamage);

      const bossLog = `${selectedChapter.enemyName} riposte férocement : ${bossAttack} dégâts (${absorbed} absorbés) !`;

      if (afterHp <= 0) {
        audio.playGameOver();
        setBattleState(prev => prev ? {
          ...prev,
          playerHp: 0,
          playerShield: 0,
          combatLog: [bossLog, `💀 Défaite... Vos systèmes critiques ont lâché.`],
          isDefeat: true,
          turn: 'player'
        } : null);
      } else {
        setBattleState(prev => prev ? {
          ...prev,
          playerHp: afterHp,
          playerShield: afterShield,
          combatLog: [bossLog, `À vous d'attaquer !`],
          turn: 'player'
        } : null);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15"
      >
        {/* Top Glint & Corner Spiderweb */}
        <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-12 w-12 h-12 pointer-events-none opacity-60">
          <svg viewBox="0 0 50 50" className="w-full h-full text-orange-400 fill-none stroke-current stroke-[1.2]">
            <path d="M50,0 Q25,0 0,0 M50,0 Q50,25 50,50 M50,0 L0,50" />
          </svg>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-mono tracking-tight uppercase flex items-center gap-1.5">
                  <span>{t.storyMode}</span>
                  <span className="text-sm">🎃</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-400/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {storyState.totalStars} / 18 ★
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-purple-500/25 text-purple-300 border border-purple-400/40">
                  👻 QUÊTE SPECTRE
                </span>
              </div>
              <p className="text-xs text-orange-200/80">{t.storySubtitle} • Chapitres ensorcelés</p>
            </div>
          </div>

          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Chapter List OR Battle Arena */}
        <div className="flex-1 my-4 overflow-y-auto no-scrollbar">
          {battleState && selectedChapter ? (
            /* Combat Arena Screen */
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Top Chapter Lore Banner */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-black">
                    {t.chapter} {selectedChapter.id} : {selectedChapter.title}
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">{selectedChapter.lore}</p>
                </div>
                <button
                  onClick={() => setBattleState(null)}
                  className="px-3 py-1.5 rounded-xl liquid-glass-pill text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
                >
                  {language === 'en' ? 'Abandon' : language === 'es' ? 'Abandonar' : 'Abandonner'}
                </button>
              </div>

              {/* Combat Field with Player and Boss */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-3xl bg-slate-900/60 border border-white/10 relative overflow-hidden">
                {/* Player Pod */}
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                  <div className="text-4xl mb-2">🧑‍🚀</div>
                  <h4 className="text-sm font-black text-white font-mono">AVATAR APEX</h4>
                  <div className="w-full mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold">PV</span>
                      <span>{battleState.playerHp} / {battleState.playerMaxHp}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${(battleState.playerHp / battleState.playerMaxHp) * 100}%` }}
                      />
                    </div>
                    {battleState.playerShield > 0 && (
                      <span className="text-[10px] text-cyan-300 font-mono flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" /> Blindage : +{battleState.playerShield}
                      </span>
                    )}
                  </div>
                </div>

                {/* Boss Pod */}
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                  <div className="text-4xl mb-2">{selectedChapter.bossEmoji}</div>
                  <h4 className="text-sm font-black text-rose-300 font-mono">{selectedChapter.enemyName}</h4>
                  <div className="w-full mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-rose-400 font-bold">BOSS HP</span>
                      <span>{battleState.bossHp} / {battleState.bossMaxHp}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-300"
                        style={{ width: `${(battleState.bossHp / battleState.bossMaxHp) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {battleState.turn === 'boss' ? '⚡ Action du Boss en cours...' : 'Cible verrouillée'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Combat Log */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs text-slate-300 space-y-1">
                {battleState.combatLog.map((log, i) => (
                  <p key={i} className={i === battleState.combatLog.length - 1 ? 'text-cyan-300 font-bold' : ''}>
                    › {log}
                  </p>
                ))}
              </div>

              {/* Tactical Actions Grid */}
              {!battleState.isVictory && !battleState.isDefeat ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => executeAction('attack')}
                    disabled={battleState.turn !== 'player'}
                    className="p-3 rounded-2xl liquid-glass-pill hover:border-cyan-400 flex flex-col items-center gap-1 font-mono text-xs font-black cursor-pointer active:scale-95 disabled:opacity-40"
                  >
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span>{language === 'en' ? 'PLASMA BLAST' : language === 'es' ? 'DISPARO PLASMA' : 'TIR PLASMA'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">25-40 {language === 'en' ? 'dmg' : language === 'es' ? 'daño' : 'dégâts'}</span>
                  </button>

                  <button
                    onClick={() => executeAction('critical')}
                    disabled={battleState.turn !== 'player'}
                    className="p-3 rounded-2xl liquid-glass-pill hover:border-amber-400 flex flex-col items-center gap-1 font-mono text-xs font-black cursor-pointer active:scale-95 disabled:opacity-40"
                  >
                    <Swords className="w-5 h-5 text-amber-400" />
                    <span>{language === 'en' ? 'HEAVY CRIT' : language === 'es' ? 'GOLPE PESADO' : 'FRAPPE LOURDE'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">70% {language === 'en' ? 'chance 55-85 dmg' : language === 'es' ? 'prob 55-85 daño' : 'chance 55-85 dégâts'}</span>
                  </button>

                  <button
                    onClick={() => executeAction('shield')}
                    disabled={battleState.turn !== 'player'}
                    className="p-3 rounded-2xl liquid-glass-pill hover:border-blue-400 flex flex-col items-center gap-1 font-mono text-xs font-black cursor-pointer active:scale-95 disabled:opacity-40"
                  >
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>{language === 'en' ? 'HOLO SHIELD' : language === 'es' ? 'ESCUDO HOLO' : 'BOUCLIER HOLO'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">+35 {language === 'en' ? 'absorption' : language === 'es' ? 'absorción' : 'absorption'}</span>
                  </button>

                  <button
                    onClick={() => executeAction('heal')}
                    disabled={battleState.turn !== 'player'}
                    className="p-3 rounded-2xl liquid-glass-pill hover:border-emerald-400 flex flex-col items-center gap-1 font-mono text-xs font-black cursor-pointer active:scale-95 disabled:opacity-40"
                  >
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>{language === 'en' ? 'NANO HEAL' : language === 'es' ? 'CURACIÓN NANO' : 'SOIN NANO'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">+40 {language === 'en' ? 'HP restored' : language === 'es' ? 'PV recuperados' : 'PV restaurés'}</span>
                  </button>
                </div>
              ) : battleState.isVictory ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-center flex flex-col items-center gap-2">
                  <Trophy className="w-10 h-10 text-yellow-400 animate-bounce" />
                  <h3 className="text-lg font-black text-white font-mono">
                    {language === 'en' ? 'CHAPTER COMPLETED SUCCESSFULLY!' : language === 'es' ? '¡CAPÍTULO COMPLETADO CON ÉXITO!' : 'CHAPITRE COMPLÉTÉ AVEC SUCCÈS !'}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-yellow-400 font-black">+{selectedChapter.rewardVCoins} V-Coins</span>
                    <span className="text-cyan-300 font-black">+100 {t.trophies}</span>
                    {selectedChapter.rewardTitle && (
                      <span className="text-purple-300 font-black">{language === 'en' ? 'Title' : language === 'es' ? 'Título' : 'Titre'} : {selectedChapter.rewardTitle}</span>
                    )}
                  </div>
                  <button
                    onClick={() => setBattleState(null)}
                    className="mt-2 px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black font-mono cursor-pointer hover:bg-emerald-400"
                  >
                    {language === 'en' ? 'CONTINUE ADVENTURE' : language === 'es' ? 'CONTINUAR AVENTURA' : 'CONTINUER L\'AVENTURE'}
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-400/50 text-center flex flex-col items-center gap-2">
                  <Skull className="w-10 h-10 text-rose-500 animate-bounce" />
                  <h3 className="text-lg font-black text-white font-mono">
                    {language === 'en' ? 'DEFEATED BY THE BOSS' : language === 'es' ? 'DERROTA ANTE EL JEFE' : 'DÉFAITE FACE AU BOSS'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {language === 'en' ? 'Adjust your tactics and try again!' : language === 'es' ? '¡Ajusta tu estrategia y vuelve a intentarlo!' : 'Ajustez votre stratégie tactique et retentez votre chance !'}
                  </p>
                  <button
                    onClick={() => startChapter(selectedChapter)}
                    className="mt-2 px-6 py-2 rounded-xl bg-rose-500 text-white font-black font-mono cursor-pointer hover:bg-rose-400 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> {language === 'en' ? 'RETRY THIS BOSS' : language === 'es' ? 'REINTENTAR ESTE JEFE' : 'RECOMBATTRE CE BOSS'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Chapters Selection View */
            <div className="space-y-3">
              {storyState.chapters.map((chap) => {
                return (
                  <div
                    key={chap.id}
                    className={`p-4 rounded-3xl transition-all border ${
                      chap.isUnlocked
                        ? 'liquid-glass-card hover:border-cyan-400/70 cursor-pointer'
                        : 'bg-slate-950/40 border-white/5 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => chap.isUnlocked && startChapter(chap)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10">
                          {chap.bossEmoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                              {t.chapter} {chap.id}
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-[10px] font-mono text-slate-400">{t.boss} : {chap.enemyName}</span>
                          </div>
                          <h4 className="text-base font-black text-white font-mono tracking-tight mt-0.5">
                            {chap.title}
                          </h4>
                          <p className="text-xs text-slate-300/80 line-clamp-1 mt-0.5">
                            {chap.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Star Rating */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= chap.stars
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Reward tag */}
                        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          <Coins className="w-3.5 h-3.5 fill-current" /> +{chap.rewardVCoins} VC
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-300" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>
            {language === 'en' ? '6 Narrative Chapters • 18 Stars to Conquer' :
             language === 'es' ? '6 Capítulos Narrativos • 18 Estrellas por Conquistar' :
             '6 Chapitres Narratifs • 18 Étoiles à conquérir'}
          </span>
          <span className="text-cyan-400 font-bold">
            {language === 'en' ? 'Stackable rewards & Legendary Titles' :
             language === 'es' ? 'Recompensas acumulativas y Títulos Legendarios' :
             'Récompenses cumulables & Titres Légendaires'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
