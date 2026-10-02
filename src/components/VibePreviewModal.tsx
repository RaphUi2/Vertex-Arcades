import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio, X, Sparkles, Volume2, VolumeX, Music,
  Play, Pause, Disc, Users, Mic, Flame, ArrowLeft,
  BellRing, Bell, Check, Headphones, Sliders
} from 'lucide-react';
import { audio, BGMTrack, BGM_TRACKS } from '../utils/audio';
import { Language } from '../utils/i18n';

interface VibePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

export function VibePreviewModal({
  isOpen,
  onClose,
  onShowToast,
  language = 'fr'
}: VibePreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<BGMTrack>('chill');
  const [notified, setNotified] = useState(false);
  const [bars, setBars] = useState<number[]>([40, 65, 85, 30, 95, 60, 45, 80, 55, 90, 70, 50]);

  // Animated visualizer equalizer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 75) + 25));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const handleTogglePlay = (trackId?: BGMTrack) => {
    audio.playClick();
    const trackToPlay = trackId || currentTrack;
    if (trackId && trackId !== currentTrack) {
      setCurrentTrack(trackId);
      audio.startBGM(trackId);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      audio.stopBGM();
      setIsPlaying(false);
    } else {
      audio.startBGM(trackToPlay);
      setIsPlaying(true);
    }
  };

  const handleNotify = () => {
    audio.playWin();
    const next = !notified;
    setNotified(next);
    if (next) {
      onShowToast(
        language === 'en'
          ? "✨ You're on the VIP Guestlist for VIBE! Access granted upon launch."
          : language === 'es'
          ? "✨ ¡Estás en la lista VIP de VIBE! Acceso garantizado en el lanzamiento."
          : "✨ Vous êtes inscrit sur la liste VIP de VIBE ! Vous serez invité dès l'ouverture."
      );
    }
  };

  const features = [
    {
      icon: <Headphones className="w-5 h-5 text-fuchsia-400" />,
      title: language === 'en' ? 'Synced Lo-Fi Lounges' : language === 'es' ? 'Salas Lo-Fi Sincronizadas' : 'Salons d\'Écoute Synchronisés',
      desc:
        language === 'en'
          ? 'Listen to beats, synthwave streams and DJ sets in perfect sync with your friends.'
          : language === 'es'
          ? 'Escucha beats, synthwave y sets de DJ en perfecta sincronía con amigos.'
          : 'Écoutez des beats synthwave, radios lo-fi et sets DJ en parfaite synchronisation avec vos amis.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      title: language === 'en' ? '3D Soundwave Avatars' : language === 'es' ? 'Avatares 3D Reactivos' : 'Avatars 3D Réactifs au Son',
      desc:
        language === 'en'
          ? 'Hang out in neon spatial rooms where lights and visualizers react to the audio pulse.'
          : language === 'es'
          ? 'Disfruta en salas espaciales neón donde las luces reaccionan al pulso de la música.'
          : 'Installez votre avatar dans des lounges spatiaux aux néons dynamiques pulsant au rythme des basses.'
    },
    {
      icon: <Mic className="w-5 h-5 text-cyan-400" />,
      title: language === 'en' ? 'Spatial Voice Chat' : language === 'es' ? 'Chat de Voz Espacial' : 'Vocal Spatialisant 3D',
      desc:
        language === 'en'
          ? 'Move closer to friends to hear them clearer with realistic binaural proximity audio.'
          : language === 'es'
          ? 'Acércate a tus amigos para escucharlos con audio espacial binaural de proximidad.'
          : 'Rapprochez-vous de votre escouade pour discuter avec un son directionnel immersif de proximité.'
    },
    {
      icon: <Sliders className="w-5 h-5 text-amber-400" />,
      title: language === 'en' ? 'Live Synth Engine' : language === 'es' ? 'Sintetizador en Vivo' : 'Moteur Synthé & Live Beat',
      desc:
        language === 'en'
          ? 'Create your own procedural synthwave loops and broadcast them directly to the metaverse.'
          : language === 'es'
          ? 'Crea tus propios bucles de sintetizador y transmítelos directamente al metaverso.'
          : 'Composez vos propres boucles rétro et diffusez vos créations sonores dans les salons.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="liquid-glass-container w-full max-w-3xl max-h-[92dvh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-fuchsia-400/30 text-slate-100"
        >
          {/* Top Sheen & Corner Spiderweb */}
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/30 to-purple-600/30 border border-orange-400/60 flex items-center justify-center text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              🎃
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-white font-mono tracking-tight uppercase flex items-center gap-1.5">
                  <span>VIBE</span>
                  <span className="text-sm">🕯️</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase bg-orange-500/25 text-orange-300 border border-orange-400/60 shadow-[0_0_12px_rgba(249,115,22,0.5)] animate-pulse">
                  🎃 Halloween Vibe
                </span>
              </div>
              <p className="text-xs text-orange-200/80">
                {language === 'en'
                  ? 'The chill music lounge, spatial 3D hangout and social radio station of Vertex.'
                  : language === 'es'
                  ? 'El salón de música chill, espacio 3D y estación de radio social de Vertex.'
                  : 'Le salon chill, la radio lo-fi spatiale et l\'espace de détente 3D de l\'écosystème Vertex.'}
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 no-scrollbar">
            {/* Interactive Procedural Lo-Fi Radio Teaser */}
            <div className="p-4 sm:p-5 rounded-3xl liquid-glass-card border border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-950/30 via-purple-950/40 to-slate-900/60 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
                    <Disc className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-fuchsia-300 flex items-center gap-1 justify-center sm:justify-start">
                      <Sparkles className="w-3 h-3" /> Radio Synthwave Vibe (Live Test)
                    </span>
                    <h3 className="text-sm font-black font-mono text-white">
                      {BGM_TRACKS.find(t => t.id === currentTrack)?.name || 'Cyber Lounge Chillout'}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {BGM_TRACKS.find(t => t.id === currentTrack)?.genre} • {BGM_TRACKS.find(t => t.id === currentTrack)?.bpm} BPM
                    </span>
                  </div>
                </div>

                {/* Play / Stop Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePlay()}
                    className="px-5 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(217,70,239,0.5)] flex items-center gap-2 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Écouter'}</span>
                  </button>
                </div>
              </div>

              {/* Bouncing Equalizer Bars */}
              <div className="flex items-end justify-center gap-1.5 h-10 pt-2 px-2 bg-slate-950/40 rounded-xl border border-white/5">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: isPlaying ? `${h}%` : '15%' }}
                    className="flex-1 bg-gradient-to-t from-fuchsia-500 via-purple-400 to-cyan-300 rounded-t transition-all duration-100 min-h-[4px]"
                  />
                ))}
              </div>

              {/* Quick Track Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {BGM_TRACKS.map(trk => {
                  const isCurrent = currentTrack === trk.id;
                  return (
                    <button
                      key={trk.id}
                      onClick={() => handleTogglePlay(trk.id)}
                      className={`p-2 rounded-xl text-left border text-[11px] font-mono transition-all cursor-pointer ${
                        isCurrent
                          ? 'liquid-glass-pill-active border-fuchsia-400 text-fuchsia-200 font-bold'
                          : 'liquid-glass-pill text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold truncate">{trk.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{trk.genre}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features Showcase */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-300 px-1">
                {language === 'en' ? 'Upcoming Vibe Experiences :' : language === 'es' ? 'Próximas experiencias en Vibe :' : 'Expériences prévues dans l\'espace Vibe :'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((f, idx) => (
                  <div
                    key={idx}
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
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono shrink-0">
            <button
              onClick={handleNotify}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md ${
                notified
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-fuchsia-500/20 border border-fuchsia-400/50 text-fuchsia-200 hover:bg-fuchsia-500/35'
              }`}
            >
              {notified ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              <span>{notified ? (language === 'en' ? 'VIP Guestlist Confirmed' : 'Inscrit sur la Liste VIP !') : (language === 'en' ? 'Join VIP Guestlist' : 'Rejoindre la Liste VIP')}</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono font-bold text-xs uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Return to Portal' : language === 'es' ? 'Volver al Portal' : 'Retour au Portail'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
