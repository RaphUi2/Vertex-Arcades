// Web Audio API Retro & Modern Stylized Synthesizer & Procedural BGM Engine

export type BGMTrack = 'halloween' | 'portal' | 'chill' | 'synthwave' | 'hyper' | 'neon';

export interface BGMTrackInfo {
  id: BGMTrack;
  name: string;
  genre: string;
  bpm: number;
}

export const BGM_TRACKS: BGMTrackInfo[] = [
  { id: 'halloween', name: '🎃 Spooky Midnight Masquerade', genre: 'Gothic Halloween Synth', bpm: 88 },
  { id: 'portal', name: 'Nexus Portal Ambient', genre: 'Ethereal Cosmic Lounge', bpm: 72 },
  { id: 'chill', name: 'Cyber Lounge Chillout', genre: 'Lo-Fi Cyber Lounge', bpm: 84 },
  { id: 'synthwave', name: 'Horizon 2099', genre: 'Synthwave Arp', bpm: 120 },
  { id: 'hyper', name: 'Cyber Arena Hype', genre: 'Arcade Funk & Electro', bpm: 128 },
  { id: 'neon', name: 'Cybernetic Pulse', genre: 'Electro Wave', bpm: 110 }
];

class AudioManager {
  private ctx: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private sfxVolume: number = 0.7; // 0 to 1
  private musicVolume: number = 0.45; // 0 to 1
  private bgmInterval: any = null;
  private currentTrack: BGMTrack = 'halloween';
  private isBgmPlaying: boolean = false;
  private bgmGainNode: GainNode | null = null;
  private stepCount: number = 0;

  init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.bgmGainNode.connect(this.ctx.destination);
      } catch (e) {
        console.warn("Web Audio API not supported", e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.isBgmPlaying) {
      this.stopBGM();
    } else if (enabled && !this.isBgmPlaying) {
      this.startBGM(this.currentTrack);
    }
  }

  setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  getSfxEnabled() { return this.sfxEnabled; }
  getMusicEnabled() { return this.musicEnabled; }
  getSfxVolume() { return this.sfxVolume; }
  getMusicVolume() { return this.musicVolume; }
  getCurrentTrack() { return this.currentTrack; }
  getIsBgmPlaying() { return this.isBgmPlaying; }

  // Sound synthesis helper
  private playTone(
    freqs: number[],
    durations: number[],
    type: OscillatorType = 'sine',
    sweepFreq?: number,
    baseGain: number = 0.15
  ) {
    if (!this.sfxEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const actualGain = baseGain * this.sfxVolume;
      gainNode.gain.setValueAtTime(actualGain, now);

      let timeOffset = 0;
      freqs.forEach((freq, idx) => {
        const dur = durations[idx] || 0.1;
        osc.frequency.setValueAtTime(freq, now + timeOffset);
        timeOffset += dur;
      });

      if (sweepFreq !== undefined && sweepFreq > 0) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, sweepFreq), now + timeOffset);
      }

      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset);
      osc.start(now);
      osc.stop(now + timeOffset + 0.04);
    } catch (e) {
      // Graceful fallback
    }
  }

  // --- STYLIZED SFX ---

  // Classic Bloop / Pop button click
  playClick() {
    this.playTone([480, 720], [0.03, 0.05], 'sine', undefined, 0.2);
  }

  // Stylized retro arcade hit sound
  playOof() {
    this.playTone([240, 160, 110], [0.08, 0.1, 0.14], 'triangle', 60, 0.35);
  }
  playImpact() {
    this.playOof();
  }

  // Shiny Coin / VC Ding
  playCoin() {
    this.playTone([1046.5, 1318.51, 1567.98], [0.06, 0.06, 0.2], 'square', undefined, 0.18);
  }

  // Level Up / Victory fanfare
  playLevelUp() {
    this.playTone([523.25, 659.25, 783.99, 1046.5], [0.08, 0.08, 0.08, 0.25], 'sine', undefined, 0.25);
  }

  // Laser beam
  playLaser() {
    this.playTone([900], [0.12], 'sawtooth', 120, 0.16);
  }

  // Physical hit / impact
  playHit() {
    this.playTone([180], [0.08], 'triangle', 45, 0.25);
  }

  // Damage sound
  playDamage() {
    this.playTone([220, 140, 80], [0.06, 0.08, 0.12], 'triangle', 40, 0.3);
  }

  // Attack / Slash sound
  playAttack() {
    this.playTone([440, 660, 880], [0.04, 0.04, 0.08], 'sawtooth', 300, 0.22);
  }

  // Sword swing
  playSwordSwing() {
    this.playTone([320, 580], [0.05, 0.08], 'sine', 180, 0.2);
  }

  // Bow arrow shoot
  playBowShoot() {
    this.playTone([400, 800], [0.03, 0.08], 'sine', 250, 0.2);
  }

  // Voxel Block break/place
  playBlockBreak() {
    this.playTone([240, 180], [0.04, 0.06], 'square', undefined, 0.18);
  }

  // Explosive blast
  playExplosion() {
    this.playTone([260, 180, 90, 40], [0.05, 0.06, 0.08, 0.2], 'sawtooth', 25, 0.35);
  }

  // Powerup chime
  playPowerup() {
    this.playTone([392, 523.25, 659.25, 783.99, 1046.5], [0.04, 0.04, 0.04, 0.05, 0.18], 'triangle', undefined, 0.22);
  }

  // Jump swoosh
  playJump() {
    this.playTone([200], [0.12], 'sine', 550, 0.2);
  }

  // Victory Fanfare
  playWin() {
    this.playTone([523.25, 659.25, 783.99, 1046.5, 1318.5], [0.08, 0.08, 0.08, 0.12, 0.35], 'triangle', undefined, 0.25);
  }

  // Game over sorrow
  playGameOver() {
    this.playTone([440, 415.3, 392, 349.2, 293.6], [0.12, 0.12, 0.12, 0.14, 0.3], 'sawtooth', 80, 0.2);
  }

  playLose() {
    this.playGameOver();
  }

  playFrequency(freq: number, dur = 0.1) {
    this.playTone([freq], [dur], 'sine', undefined, 0.15);
  }

  playPixelScore() {
    this.playCoin();
  }

  // Start game fanfare
  playStart() {
    this.playTone([523.25, 783.99, 1046.5], [0.06, 0.06, 0.2], 'triangle', undefined, 0.2);
  }

  // UI Swoosh / slide
  playSwoosh() {
    this.playTone([320, 200, 140], [0.03, 0.04, 0.05], 'sine', 70, 0.15);
  }

  // Heart like pop
  playHeartPop() {
    this.playTone([659.25, 987.77], [0.05, 0.15], 'sine', undefined, 0.22);
  }

  // Sparkling like chime sound effect
  playLike() {
    this.playTone([587.33, 880, 1174.66, 1760], [0.04, 0.05, 0.06, 0.22], 'sine', undefined, 0.26);
  }

  // RNG Rolling tick
  playRngTick() {
    this.playTone([800 + Math.random() * 400], [0.03], 'square', undefined, 0.1);
  }

  // Rare / Mythic jackpot reveal
  playMythicReveal() {
    this.playTone([440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760], [0.06, 0.06, 0.06, 0.08, 0.08, 0.1, 0.45], 'square', undefined, 0.3);
  }

  // 🎃 Halloween Spooky Chime & Ghost Cackle
  playHalloweenSpook() {
    this.playTone([622.25, 587.33, 466.16, 440, 311.13, 293.66], [0.08, 0.08, 0.08, 0.1, 0.12, 0.35], 'sawtooth', 75, 0.28);
  }

  // Rank Level-Up Fanfare
  playRankUp() {
    this.playTone([440, 659.25, 880, 1318.51], [0.08, 0.08, 0.1, 0.35], 'triangle', undefined, 0.28);
  }

  // --- PROCEDURAL BACKGROUND MUSIC SYNTHESIZER ---

  startBGM(trackId: BGMTrack = 'chill') {
    this.currentTrack = trackId;
    if (!this.musicEnabled) return;
    this.init();
    if (this.isBgmPlaying) this.stopBGM();
    this.isBgmPlaying = true;
    this.stepCount = 0;

    const track = BGM_TRACKS.find(t => t.id === trackId) || BGM_TRACKS[0];
    const stepIntervalMs = (60000 / track.bpm) / 2; // 8th note steps

    this.bgmInterval = setInterval(() => {
      this.playBGMStep(trackId);
    }, stepIntervalMs);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.isBgmPlaying = false;
  }

  switchTrack(trackId: BGMTrack) {
    this.startBGM(trackId);
  }

  private playBGMStep(track: BGMTrack) {
    if (!this.musicEnabled || !this.ctx || !this.bgmGainNode) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const step = this.stepCount % 16;
    this.stepCount++;

    // Track musical scales (frequencies)
    // Scale: C Pentatonic / A Minor / D Dorian
    const bassC = [65.41, 73.42, 82.41, 98.0, 110.0, 130.81]; // C2 - C3
    const leadNotes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

    try {
      // 🎃 HALLOWEEN SPECIAL RETRO GOTHIC SYNTH ENGINE
      if (track === 'halloween') {
        // A. Deep Gothic Church Organ Sub-Chords every 8 steps
        if (step % 8 === 0) {
          const chordProgression = [
            [73.42, 110.0, 174.61],  // D minor (D2, A2, F3)
            [58.27, 116.54, 146.83], // Bb major (Bb1, Bb2, D3)
            [49.00, 98.00, 146.83],  // G minor (G1, G2, D3)
            [69.30, 110.0, 164.81]   // A7 / C# dim (C#2, A2, E3)
          ];
          const chordIndex = Math.floor(this.stepCount / 8) % chordProgression.length;
          const currentChord = chordProgression[chordIndex];

          currentChord.forEach((freq, i) => {
            const orgOsc = ctx.createOscillator();
            const orgGain = ctx.createGain();
            orgOsc.type = i === 0 ? 'triangle' : 'sawtooth';
            orgOsc.frequency.setValueAtTime(freq, now);

            const vol = (i === 0 ? 0.15 : 0.04) * this.musicVolume;
            orgGain.gain.setValueAtTime(0.001, now);
            orgGain.gain.linearRampToValueAtTime(vol, now + 0.15);
            orgGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

            orgOsc.connect(orgGain);
            orgGain.connect(this.bgmGainNode);
            orgOsc.start(now);
            orgOsc.stop(now + 1.65);
          });
        }

        // B. Spooky Halloween Fast Arpeggio (Classic Halloween Theme / Stranger Chills Vibe)
        const spookyArpNotes = [
          587.33, 440.0, 466.16, 440.0, 587.33, 440.0, 466.16, 440.0,
          622.25, 440.0, 587.33, 440.0, 466.16, 440.0, 392.00, 440.0
        ];
        const currentNote = spookyArpNotes[step % spookyArpNotes.length];

        const bellOsc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(currentNote, now);
        bellGain.gain.setValueAtTime(0.08 * this.musicVolume, now);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        bellOsc.connect(bellGain);
        bellGain.connect(this.bgmGainNode);
        bellOsc.start(now);
        bellOsc.stop(now + 0.24);

        // C. Ghostly Theremin / Spectral Whistle on selected eerie steps (3, 7, 11, 15)
        if ([3, 7, 11, 15].includes(step)) {
          const thOsc = ctx.createOscillator();
          const thGain = ctx.createGain();
          thOsc.type = 'sine';
          const baseGhostFreq = step === 3 ? 880.0 : step === 7 ? 932.33 : step === 11 ? 1046.5 : 783.99;
          thOsc.frequency.setValueAtTime(baseGhostFreq, now);
          thOsc.frequency.exponentialRampToValueAtTime(baseGhostFreq * 1.08, now + 0.35);

          thGain.gain.setValueAtTime(0.001, now);
          thGain.gain.linearRampToValueAtTime(0.045 * this.musicVolume, now + 0.1);
          thGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

          thOsc.connect(thGain);
          thGain.connect(this.bgmGainNode);
          thOsc.start(now);
          thOsc.stop(now + 0.48);
        }

        // D. Gothic Deep Heartbeat / Clock Pulse on beat 0, 4, 8, 12
        if (step % 4 === 0) {
          const heartOsc = ctx.createOscillator();
          const heartGain = ctx.createGain();
          heartOsc.type = 'sine';
          heartOsc.frequency.setValueAtTime(55, now);
          heartOsc.frequency.exponentialRampToValueAtTime(28, now + 0.18);
          heartGain.gain.setValueAtTime(0.22 * this.musicVolume, now);
          heartGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          heartOsc.connect(heartGain);
          heartGain.connect(this.bgmGainNode);
          heartOsc.start(now);
          heartOsc.stop(now + 0.22);
        }

        return;
      }

      // 0. PORTAL SPECIAL CELESTIAL AMBIENT SYNTH
      if (track === 'portal') {
        // Deep sub-pad resonance every 8 steps
        if (step % 8 === 0) {
          const padOsc = ctx.createOscillator();
          const padGain = ctx.createGain();
          padOsc.type = 'sine';
          const rootNote = step === 0 ? 130.81 : 164.81; // C3 or E3
          padOsc.frequency.setValueAtTime(rootNote, now);
          padGain.gain.setValueAtTime(0.001, now);
          padGain.gain.linearRampToValueAtTime(0.12 * this.musicVolume, now + 0.4);
          padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

          padOsc.connect(padGain);
          padGain.connect(this.bgmGainNode);
          padOsc.start(now);
          padOsc.stop(now + 1.25);
        }

        // Sparkling ethereal bell arpeggios on steps 0, 3, 7, 11, 14
        if ([0, 3, 7, 11, 14].includes(step)) {
          const celestialNotes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
          const cFreq = celestialNotes[(step * 2 + Math.floor(this.stepCount / 12)) % celestialNotes.length];

          const bellOsc = ctx.createOscillator();
          const bellGain = ctx.createGain();
          bellOsc.type = 'sine';
          bellOsc.frequency.setValueAtTime(cFreq, now);
          bellGain.gain.setValueAtTime(0.06 * this.musicVolume, now);
          bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

          bellOsc.connect(bellGain);
          bellGain.connect(this.bgmGainNode);
          bellOsc.start(now);
          bellOsc.stop(now + 0.65);
        }
        return;
      }

      // 1. Kick / Bass Pulse on beats 0, 4, 8, 12
      if (step % 4 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = track === 'synthwave' ? 'sawtooth' : 'triangle';
        const bassNote = track === 'synthwave' ? (step < 8 ? 65.41 : 73.42) : (step === 0 ? 65.41 : 82.41);
        bassOsc.frequency.setValueAtTime(bassNote, now);
        bassOsc.frequency.exponentialRampToValueAtTime(35, now + 0.15);
        bassGain.gain.setValueAtTime(0.2 * this.musicVolume, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGainNode);
        bassOsc.start(now);
        bassOsc.stop(now + 0.18);
      }

      // 2. Hi-hat / Shaker rhythm on every odd step
      if (step % 2 === 1 && (track === 'hyper' || track === 'synthwave' || track === 'neon')) {
        const hatOsc = ctx.createOscillator();
        const hatGain = ctx.createGain();
        hatOsc.type = 'sawtooth';
        hatOsc.frequency.setValueAtTime(1800 + Math.random() * 400, now);
        hatGain.gain.setValueAtTime(0.04 * this.musicVolume, now);
        hatGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        hatOsc.connect(hatGain);
        hatGain.connect(this.bgmGainNode);
        hatOsc.start(now);
        hatOsc.stop(now + 0.05);
      }

      // 3. Melodic synth arp note on selected steps
      const melodicSteps = track === 'chill' ? [0, 3, 6, 10, 14] : [2, 5, 8, 11, 13, 15];
      if (melodicSteps.includes(step)) {
        const noteIndex = (step * 3 + Math.floor(this.stepCount / 16)) % leadNotes.length;
        const freq = leadNotes[noteIndex];

        const melOsc = ctx.createOscillator();
        const melGain = ctx.createGain();
        melOsc.type = track === 'chill' ? 'sine' : 'square';
        melOsc.frequency.setValueAtTime(freq, now);

        const melVol = (track === 'chill' ? 0.08 : 0.05) * this.musicVolume;
        melGain.gain.setValueAtTime(melVol, now);
        melGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        melOsc.connect(melGain);
        melGain.connect(this.bgmGainNode);
        melOsc.start(now);
        melOsc.stop(now + 0.24);
      }
    } catch (e) {
      // Ignore audio glitches
    }
  }
}

export const audio = new AudioManager();
