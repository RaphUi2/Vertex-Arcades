import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, X, Copy, Check, Sparkles, Bell, BellRing,
  Gamepad2, MessageSquare, Gift, Eye, Trophy, ShieldCheck
} from 'lucide-react';
import { audio } from '../utils/audio';

interface FriendsComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onShowToast: (msg: string) => void;
  language?: 'en' | 'fr' | 'es';
}

export function FriendsComingSoonModal({
  isOpen,
  onClose,
  username,
  onShowToast,
  language = 'fr'
}: FriendsComingSoonModalProps) {
  const [copied, setCopied] = useState(false);
  const [notified, setNotified] = useState(false);

  // Generate deterministic friend code from username
  const friendCode = `VERTEX#${Math.abs(
    username.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) % 9000 + 1000
  )}`;

  const handleCopyCode = () => {
    audio.playClick();
    navigator.clipboard?.writeText(friendCode);
    setCopied(true);
    onShowToast(
      language === 'en'
        ? `Friend code ${friendCode} copied to clipboard!`
        : language === 'es'
        ? `¡Código de amigo ${friendCode} copiado al portapapeles!`
        : `Code ami ${friendCode} copié dans le presse-papier !`
    );
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleNotify = () => {
    audio.playWin();
    const next = !notified;
    setNotified(next);
    if (next) {
      onShowToast(
        language === 'en'
          ? "🔔 You're on the VIP list! You'll be notified as soon as Friends launches."
          : language === 'es'
          ? "🔔 ¡Estás en la lista VIP! Se te notificará en cuanto se lance la función Amigos."
          : "🔔 Vous êtes sur la liste VIP ! Vous serez notifié dès l'activation du menu Amis."
      );
    }
  };

  if (!isOpen) return null;

  const mockUpcomingFriends = [
    {
      name: 'CyberKnight_99',
      status: language === 'en' ? 'In game: Runner' : language === 'es' ? 'En partida: Runner' : 'En partie : Runner',
      online: true,
      color: 'from-cyan-500 to-blue-600',
      avatar: '🛡️',
      level: 14
    },
    {
      name: 'StarPilot_Nova',
      status: language === 'en' ? 'In game: Cosmic' : language === 'es' ? 'En partida: Cosmic' : 'En partie : Cosmic',
      online: true,
      color: 'from-purple-500 to-indigo-600',
      avatar: '🚀',
      level: 22
    },
    {
      name: 'PixelQueen',
      status: language === 'en' ? 'Online in Hub' : language === 'es' ? 'En línea en el Hub' : 'En ligne dans le Hub',
      online: true,
      color: 'from-emerald-500 to-teal-600',
      avatar: '👑',
      level: 18
    },
    {
      name: 'TitanMaster',
      status: language === 'en' ? 'Offline (15m ago)' : language === 'es' ? 'Desconectado (hace 15m)' : 'Hors ligne (il y a 15m)',
      online: false,
      color: 'from-slate-600 to-slate-800',
      avatar: '⚡',
      level: 9
    }
  ];

  const features = [
    {
      icon: <Gamepad2 className="w-5 h-5 text-cyan-400" />,
      title: language === 'en' ? '1v1 Duels & Party' : language === 'es' ? 'Duelos 1v1 y Grupos' : 'Défis 1v1 & Escouades',
      desc:
        language === 'en'
          ? 'Invite your friends to live arcade matches with custom V-Coin stakes.'
          : language === 'es'
          ? 'Invita a tus amigos a partidas arcade en vivo con apuestas de V-Coins.'
          : 'Invitez vos amis en temps réel dans les arènes avec mises de V-Coins.'
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-fuchsia-400" />,
      title: language === 'en' ? 'Squad Chat & Hubs' : language === 'es' ? 'Chat de Grupo y Hubs' : 'Chat d\'Équipe & Salons',
      desc:
        language === 'en'
          ? 'Chat with your crew, share game clips, and create arcade clubs.'
          : language === 'es'
          ? 'Habla con tu escuadrón, comparte clips y crea clubes arcade.'
          : 'Discutez entre coéquipiers, partagez vos scores et fondez votre clan.'
    },
    {
      icon: <Gift className="w-5 h-5 text-amber-400" />,
      title: language === 'en' ? 'V-Coins & Gifts' : language === 'es' ? 'Regalos y V-Coins' : 'Cadeaux & V-Coins',
      desc:
        language === 'en'
          ? 'Send daily bonus V-Coins and trade cosmetics directly with friends.'
          : language === 'es'
          ? 'Envía bonus diarios de V-Coins e intercambia cosméticos con amigos.'
          : 'Offrez des V-Coins quotidiens et échangez des cosmétiques rares.'
    },
    {
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
      title: language === 'en' ? 'Live Spectate' : language === 'es' ? 'Espectador en Vivo' : 'Mode Spectateur',
      desc:
        language === 'en'
          ? 'Watch your friends break high scores in real time.'
          : language === 'es'
          ? 'Mira a tus amigos batir récords en tiempo real.'
          : 'Observez vos amis pulvériser les records en direct.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="liquid-glass-container w-full max-w-2xl max-h-[92dvh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Specular Sheen & Corner Spiderweb */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-14 w-12 h-12 pointer-events-none opacity-60">
            <svg viewBox="0 0 50 50" className="w-full h-full text-orange-400 fill-none stroke-current stroke-[1.2]">
              <path d="M50,0 Q25,0 0,0 M50,0 Q50,25 50,50 M50,0 L0,50" />
            </svg>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-90"
            title="Fermer (Échap)"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-orange-500/20 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/25 to-purple-600/25 border border-orange-400/50 flex items-center justify-center text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              🎃
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-white font-mono tracking-tight uppercase flex items-center gap-1.5">
                  <span>{language === 'en' ? 'Friends & Social' : language === 'es' ? 'Amigos y Social' : 'Amis & Social'}</span>
                  <span className="text-sm">🦇</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase bg-orange-500/25 text-orange-300 border border-orange-400/60 shadow-[0_0_12px_rgba(249,115,22,0.5)] animate-pulse">
                  🎃 Coming Soon!
                </span>
              </div>
              <p className="text-xs text-orange-200/80">
                {language === 'en'
                  ? 'The multiplayer party system and friend lists are coming soon to Vertex Hub.'
                  : language === 'es'
                  ? 'El sistema multijugador y lista de amigos llegará pronto a Vertex Hub.'
                  : 'Le système multijoueur, les défis entre amis et les escouades arrivent bientôt sur le Hub Vertex.'}
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-4 no-scrollbar">
            {/* Friend Code Card */}
            <div className="p-4 rounded-2xl liquid-glass-card border border-fuchsia-400/30 bg-gradient-to-r from-fuchsia-950/20 via-purple-950/30 to-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider text-fuchsia-300 font-bold flex items-center justify-center sm:justify-start gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Your Personal Friend Code' : language === 'es' ? 'Tu Código de Amigo' : 'Votre Code Ami Unique'}
                </div>
                <div className="text-lg font-black font-mono tracking-widest text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{friendCode}</span>
                  <span className="text-[10px] font-sans font-normal text-slate-400">({username})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'liquid-glass-pill hover:border-fuchsia-400 text-fuchsia-300 hover:text-white'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (language === 'en' ? 'Copied!' : 'Copié !') : (language === 'en' ? 'Copy Code' : 'Copier mon Code')}</span>
                </button>

                <button
                  onClick={handleToggleNotify}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md ${
                    notified
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-200 hover:bg-fuchsia-500/35'
                  }`}
                  title="Être averti dès le lancement"
                >
                  {notified ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  <span>{notified ? (language === 'en' ? 'Notification Set' : 'Inscrit !') : (language === 'en' ? 'Notify Me' : 'M\'avertir')}</span>
                </button>
              </div>
            </div>

            {/* Upcoming Features Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-300 px-1">
                {language === 'en' ? 'Upcoming Social Features :' : language === 'es' ? 'Próximas funciones sociales :' : 'Fonctionnalités en cours de développement :'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl liquid-glass-card border border-white/10 hover:border-fuchsia-400/40 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      {f.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white font-mono">{f.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Friend List Preview */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-300">
                  {language === 'en' ? 'Preview of Friends Hub :' : language === 'es' ? 'Vista previa del Hub Amigos :' : 'Aperçu de la future interface Amis :'}
                </span>
                <span className="text-[10px] font-mono text-fuchsia-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 3 en ligne
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mockUpcomingFriends.map((friend, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl liquid-glass-card border border-white/8 flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${friend.color} flex items-center justify-center text-sm shadow-md`}>
                          {friend.avatar}
                        </div>
                        {friend.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-mono text-white">{friend.name}</span>
                          <span className="text-[8px] font-mono px-1 rounded bg-white/10 text-slate-300">
                            Niv.{friend.level}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{friend.status}</div>
                      </div>
                    </div>

                    <button
                      disabled
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono text-slate-400 cursor-not-allowed uppercase"
                    >
                      Défier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono shrink-0">
            <span className="text-slate-400 text-[11px]">
              {language === 'en'
                ? 'Social Hub v1.0 • Deployment in progress'
                : language === 'es'
                ? 'Hub Social v1.0 • Despliegue en curso'
                : 'Hub Social • Déploiement prochain'}
            </span>
            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              {language === 'en' ? 'Got it !' : language === 'es' ? '¡Entendido!' : 'Compris !'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
