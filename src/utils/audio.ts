// Web Audio API Retro Sound Effects Synthesizer

class AudioManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
      } catch (e) {
        console.warn("Web Audio API not supported", e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.soundEnabled = !muted;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  playFrequency(freq: number, duration: number = 0.2) {
    this.playTone([freq], [duration], 'sine', undefined, 0.15);
  }

  private playTone(
    freqs: number[],
    durations: number[],
    type: OscillatorType = 'sine',
    sweepFreq?: number,
    gainStart: number = 0.1
  ) {
    if (!this.soundEnabled) return;
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

      gainNode.gain.setValueAtTime(gainStart, now);

      let timeOffset = 0;
      freqs.forEach((freq, idx) => {
        const dur = durations[idx] || 0.1;
        osc.frequency.setValueAtTime(freq, now + timeOffset);
        timeOffset += dur;
      });

      if (sweepFreq !== undefined && sweepFreq > 0) {
        osc.frequency.linearRampToValueAtTime(sweepFreq, now + timeOffset);
      }

      gainNode.gain.linearRampToValueAtTime(0.0001, now + timeOffset);
      osc.start(now);
      osc.stop(now + timeOffset + 0.05);
    } catch (e) {
      console.warn("Audio synthesis failed gracefully:", e);
    }
  }

  playClick() {
    this.playTone([600], [0.05], 'sine', undefined, 0.15);
  }

  playCoin() {
    this.playTone([987.77, 1318.51], [0.08, 0.25], 'square', undefined, 0.08);
  }

  playLaser() {
    this.playTone([880], [0.15], 'sawtooth', 110, 0.06);
  }

  playHit() {
    this.playTone([150], [0.12], 'triangle', 40, 0.2);
  }

  playWin() {
    this.playTone([523.25, 659.25, 783.99, 1046.50], [0.08, 0.08, 0.08, 0.25], 'square', undefined, 0.07);
  }

  playGameOver() {
    this.playTone([440, 392, 349.23, 293.66, 220], [0.12, 0.12, 0.12, 0.12, 0.35], 'sawtooth', 80, 0.08);
  }
}

export const audio = new AudioManager();
