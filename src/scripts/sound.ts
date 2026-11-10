// Optional underwater ambience, made live in the browser (no audio files): soft brown noise
// through a low-pass filter that closes as you sink, so the water sounds deeper and quieter.
// Off until the visitor turns it on; nothing ever autoplays.

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
    gain = ac.createGain();
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(ac.destination);
    src.start();
  }

  function apply(ramp = 0.6) {
    if (!ac || !filter || !gain) return;
    const now = ac.currentTime;
    filter.frequency.setTargetAtTime(110 + 900 * Math.exp(-depth / 700), now, ramp);
    gain.gain.setTargetAtTime(on ? 0.5 * (1 - Math.min(depth, 4500) / 7000) : 0, now, ramp);
  }

  button.addEventListener('click', async () => {
    if (!ac) build();
    on = !on;
    if (on) await ac!.resume();
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? 'Sound on' : 'Sound off';
    apply(0.3);
  });
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    document.hidden ? ac.suspend() : on && ac.resume();
  });

  return {
    setDepth(m: number) {
      depth = m;
      apply();
    },
  };
}
