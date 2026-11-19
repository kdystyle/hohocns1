import type { PhotoCategory } from '../types/scene';

export class SizzleAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sizzleGain: GainNode | null = null;
  private fireGain: GainNode | null = null;
  private sizzleFilter: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private crackleBuffer: AudioBuffer | null = null;
  private sizzleSource: AudioBufferSourceNode | null = null;
  private fireSource: AudioBufferSourceNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoOsc2: OscillatorNode | null = null;
  private crackleTimer: number | null = null;

  private enabled = false;
  private mode: PhotoCategory = 'cooked';
  private burstBoost = 0; // 0..1

  private initContext(): boolean {
    if (this.ctx) return true;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;

    const ctx = new AudioCtx();
    this.ctx = ctx;

    // Master output with gentle soft limiter dynamics
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.15;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(compressor);
    compressor.connect(ctx.destination);
    this.masterGain = masterGain;

    // Generate 3-second sizzle noise buffer with embedded organic micro-spikes
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * 3.0);
    const noiseBuf = ctx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuf.getChannelData(ch);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.95 * b2 + white * 0.048;
        let sample = (b0 + b1 + b2 + white * 0.25) * 0.35;

        // Occasional hot oil micro-pop spike directly in bed
        if (Math.random() < 0.0022) {
          sample += (Math.random() * 2 - 1) * 0.85;
        }
        data[i] = Math.max(-1, Math.min(1, sample));
      }
    }
    this.noiseBuffer = noiseBuf;

    // Short percussive crackle buffer (45ms)
    const crackleLen = Math.floor(sampleRate * 0.045);
    const crackleBuf = ctx.createBuffer(1, crackleLen, sampleRate);
    const cData = crackleBuf.getChannelData(0);
    for (let i = 0; i < crackleLen; i++) {
      const env = Math.exp((-i / crackleLen) * 7.5);
      cData[i] = (Math.random() * 2 - 1) * env;
    }
    this.crackleBuffer = crackleBuf;

    // Sizzle chain: Noise -> Highpass (1900Hz) -> Peak (5200Hz) -> SizzleGain -> Master
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1850;
    hp.Q.value = 0.7;

    const peak = ctx.createBiquadFilter();
    peak.type = 'peaking';
    peak.frequency.value = 4900;
    peak.Q.value = 1.1;
    peak.gain.value = 5.5;
    this.sizzleFilter = peak;

    const sizzleGain = ctx.createGain();
    sizzleGain.gain.value = 0.26;
    this.sizzleGain = sizzleGain;

    hp.connect(peak);
    peak.connect(sizzleGain);
    sizzleGain.connect(masterGain);

    const sizzleSource = ctx.createBufferSource();
    sizzleSource.buffer = noiseBuf;
    sizzleSource.loop = true;
    sizzleSource.connect(hp);
    sizzleSource.start();
    this.sizzleSource = sizzleSource;

    // Warm fire rumble chain: Noise -> Lowpass (260Hz) -> FireGain -> Master
    const fireLp = ctx.createBiquadFilter();
    fireLp.type = 'lowpass';
    fireLp.frequency.value = 260;
    fireLp.Q.value = 0.8;

    const fireGain = ctx.createGain();
    fireGain.gain.value = 0.14;
    this.fireGain = fireGain;

    fireLp.connect(fireGain);
    fireGain.connect(masterGain);

    const fireSource = ctx.createBufferSource();
    fireSource.buffer = noiseBuf;
    fireSource.loop = true;
    fireSource.playbackRate.value = 0.65;
    fireSource.connect(fireLp);
    fireSource.start();
    this.fireSource = fireSource;

    // Subtle organic sizzle breathing via dual LFOs
    const lfo1 = ctx.createOscillator();
    lfo1.frequency.value = 1.8;
    const lfo1Gain = ctx.createGain();
    lfo1Gain.gain.value = 0.045;
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(sizzleGain.gain);
    lfo1.start();
    this.lfoOsc = lfo1;

    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 4.7;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 0.025;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(sizzleGain.gain);
    lfo2.start();
    this.lfoOsc2 = lfo2;

    // Periodic random oil pops & charcoal fire crackles
    this.crackleTimer = window.setInterval(() => {
      if (!this.enabled || this.mode !== 'cooked' || !this.ctx || !this.masterGain || !this.crackleBuffer) {
        return;
      }
      if (this.ctx.state !== 'running') return;

      const popChance = 0.42 + this.burstBoost * 0.48;
      if (Math.random() < popChance) {
        this.spawnCrackle(Math.random() < 0.72 ? 'sizzlePop' : 'fireSnap');
      }
    }, 65);

    return true;
  }

  private spawnCrackle(kind: 'sizzlePop' | 'fireSnap'): void {
    if (!this.ctx || !this.masterGain || !this.crackleBuffer) return;
    const now = this.ctx.currentTime;

    const src = this.ctx.createBufferSource();
    src.buffer = this.crackleBuffer;
    src.playbackRate.value = kind === 'sizzlePop' ? 0.9 + Math.random() * 0.9 : 0.45 + Math.random() * 0.4;

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value =
      kind === 'sizzlePop'
        ? 2600 + Math.random() * 4400
        : 450 + Math.random() * 750;
    bp.Q.value = kind === 'sizzlePop' ? 2.4 : 1.4;

    const g = this.ctx.createGain();
    const vol =
      (kind === 'sizzlePop' ? 0.07 + Math.random() * 0.14 : 0.06 + Math.random() * 0.1) *
      (1 + this.burstBoost * 0.85);
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + (kind === 'sizzlePop' ? 0.026 : 0.042));

    // Slight stereo pan across the skillet width
    let panNode: StereoPannerNode | null = null;
    if (typeof this.ctx.createStereoPanner === 'function') {
      panNode = this.ctx.createStereoPanner();
      panNode.pan.value = (Math.random() * 2 - 1) * 0.55;
      src.connect(bp);
      bp.connect(g);
      g.connect(panNode);
      panNode.connect(this.masterGain);
    } else {
      src.connect(bp);
      bp.connect(g);
      g.connect(this.masterGain);
    }

    src.start(now);
    src.stop(now + 0.05);
  }

  public async setEnabled(enable: boolean): Promise<boolean> {
    if (enable) {
      const ok = this.initContext();
      if (!ok || !this.ctx) return false;
      if (this.ctx.state === 'suspended') {
        try {
          await this.ctx.resume();
        } catch {
          return false;
        }
      }
      this.enabled = true;
      this.applyMix();
      return true;
    } else {
      this.enabled = false;
      this.applyMix();
      return false;
    }
  }

  public setMode(mode: PhotoCategory): void {
    this.mode = mode;
    this.applyMix();
  }

  public triggerFlameBurst(): void {
    this.burstBoost = 1.0;
    if (!this.enabled || !this.ctx || !this.masterGain || !this.noiseBuffer) {
      window.setTimeout(() => {
        this.burstBoost = 0;
      }, 4200);
      return;
    }

    const now = this.ctx.currentTime;

    // Synthesize authentic gas/wok-hei flame whoosh
    const whooshSrc = this.ctx.createBufferSource();
    whooshSrc.buffer = this.noiseBuffer;

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(160, now);
    lp.frequency.exponentialRampToValueAtTime(980, now + 0.35);
    lp.frequency.exponentialRampToValueAtTime(280, now + 3.6);
    lp.Q.value = 1.1;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.42, now + 0.22);
    g.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

    whooshSrc.connect(lp);
    lp.connect(g);
    g.connect(this.masterGain);
    whooshSrc.start(now);
    whooshSrc.stop(now + 3.9);

    // Surge pan sizzle brightness & gain temporarily
    if (this.sizzleGain && this.sizzleFilter && this.fireGain) {
      this.sizzleGain.gain.cancelScheduledValues(now);
      this.sizzleGain.gain.setValueAtTime(this.sizzleGain.gain.value, now);
      this.sizzleGain.gain.linearRampToValueAtTime(0.46, now + 0.3);
      this.sizzleGain.gain.linearRampToValueAtTime(0.26, now + 4.2);

      this.sizzleFilter.gain.cancelScheduledValues(now);
      this.sizzleFilter.gain.setValueAtTime(this.sizzleFilter.gain.value, now);
      this.sizzleFilter.gain.linearRampToValueAtTime(8.5, now + 0.3);
      this.sizzleFilter.gain.linearRampToValueAtTime(5.5, now + 4.2);

      this.fireGain.gain.cancelScheduledValues(now);
      this.fireGain.gain.setValueAtTime(this.fireGain.gain.value, now);
      this.fireGain.gain.linearRampToValueAtTime(0.32, now + 0.25);
      this.fireGain.gain.linearRampToValueAtTime(0.14, now + 4.0);
    }

    window.setTimeout(() => {
      this.burstBoost = 0;
    }, 4200);
  }

  private applyMix(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const targetMaster = this.enabled && this.mode === 'cooked' ? 0.85 : 0.0;

    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(targetMaster, now + 0.35);
  }

  public dispose(): void {
    if (this.crackleTimer !== null) {
      window.clearInterval(this.crackleTimer);
      this.crackleTimer = null;
    }
    try {
      this.sizzleSource?.stop();
      this.fireSource?.stop();
      this.lfoOsc?.stop();
      this.lfoOsc2?.stop();
    } catch {
      // Ignore already stopped sources
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      void this.ctx.close();
    }
    this.ctx = null;
    this.masterGain = null;
  }
}
