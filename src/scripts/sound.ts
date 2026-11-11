// Optional underwater ambience, made live in the browser (no audio files): soft brown noise
// through a low-pass filter that closes as you sink, so the water sounds deeper and quieter.
// Off until the visitor turns it on, quiet by default, and it fades in. Nothing autoplays.

const LEVEL = 0.045; // master volume when on: deliberately low

export function mountSound(button: HTMLButtonElement) {
  let ac: AudioContext | null = null;
  let filter: BiquadFilterNode | null = null;
  let gain: GainNode | null = null;
  let on = false;
  let depth = 0;

  function build() {
    ac = new AudioContext();
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; // brown noise: a deep, soft rumble
      data[i] = last * 3.5;
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    gain = ac.createGain();
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(ac.destination);
    src.start();
  }

  function apply(ramp = 0.6) {
    if (!ac || !filter || !gain) return;
    const now = ac.currentTime;
    filter.frequency.setTargetAtTime(90 + 600 * Math.exp(-depth / 700), now, ramp);
    gain.gain.setTargetAtTime(on ? LEVEL * (1 - Math.min(depth, 4500) / 7500) : 0, now, ramp);
  }

  button.addEventListener('click', async () => {
    if (!ac) build();
    on = !on;
    if (on) await ac!.resume();
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? 'Sound on' : 'Sound off';
    apply(on ? 0.7 : 0.25); // about two seconds to fade in
  });
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    document.hidden ? ac.suspend() : on && ac.resume();
  });

  return {
    setDepth(m: number) { depth = m; apply(); },
    // A soft, short chime for a right answer. Only when sound is on.
    blip() {
      if (!ac || !on) return;
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(660, t);
      o.frequency.exponentialRampToValueAtTime(990, t + 0.12);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.55);
    },
  };
}
