// Glowing plankton: specks that drift in the water and light up near the cursor or a finger,
// like real bioluminescent plankton when something disturbs them. Fainter in sunlit water.
// Pauses when the tab is hidden. Reduced motion: one still frame, no response to the pointer.

const GLOW = '79, 230, 212';
type Speck = { x: number; y: number; r: number; base: number; vy: number; ph: number; lit: number };

export function mountPlankton(canvas: HTMLCanvasElement, reduced: boolean) {
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0, dpr = 1, specks: Speck[] = [];
  let px = -9999, py = -9999, lastScroll = window.scrollY, raf = 0, running = false;
  let intensity = 0.3;

  function seed() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const n = Math.min(160, Math.round((w * h) / 9000));
    specks = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * Math.random() * 2.2,
      base: 0.12 + Math.random() * 0.3,
      vy: 0.04 + Math.random() * 0.14,
      ph: Math.random() * Math.PI * 2,
      lit: 0,
    }));
    frame(performance.now());
  }

  function frame(now: number) {
    const t = now / 1000;
    const dy = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (const s of specks) {
      if (!reduced) {
        // Sinking diver: the water seems to rise. Nearer (bigger) specks move more with the scroll.
        s.y -= s.vy + dy * (0.12 + s.r * 0.12);
        s.x += Math.sin(t * 0.4 + s.ph) * 0.08;
        if (s.y < -10) { s.y = h + 10; s.x = Math.random() * w; }
        if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
        const d = Math.hypot(s.x - px, s.y - py);
        const target = d < 150 ? (1 - d / 150) ** 2 : 0;
        s.lit += (target > s.lit ? 0.25 : 0.02) * (target - s.lit); // flash on, slow fade, like the real thing
      }
      const a = Math.min(1, s.base * intensity + s.lit);
      ctx.fillStyle = `rgba(${GLOW}, ${a})`;
      if (s.lit > 0.15) {
        ctx.shadowColor = `rgba(${GLOW}, ${s.lit})`;
        ctx.shadowBlur = 14;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * (1 + s.lit * 0.8), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function loop(now: number) { frame(now); raf = requestAnimationFrame(loop); }
  function start() { if (running || reduced) return; running = true; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  if (!reduced) {
    window.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
    window.addEventListener('pointerdown', (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { px = py = -9999; });
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  let resizeTimer = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(seed, 150); });
  seed();
  start();

  return {
    setIntensity(v: number) {
      intensity = v;
      if (reduced) frame(performance.now());
    },
  };
}
