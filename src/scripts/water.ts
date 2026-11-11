// The living water behind the page: sunlight shafts near the surface, the glowing lures of
// anglerfish in the deep, glowing plankton that lights up near the pointer, bubbles near the
// surface, and huge out-of-focus glowing forms (the bioluminescent lab look) that grow brighter
// as the light goes. One canvas, one loop. Glow comes from a pre-drawn sprite (no shadowBlur), the pixel
// ratio is capped, and everything pauses when the tab is hidden. Reduced motion: still frames.

const GLOW = '206, 247, 158';

type Speck = { x: number; y: number; r: number; base: number; vy: number; ph: number; lit: number };
type Lure = { d: number; x: number; v: number; ph: number };
type Bubble = { x: number; y: number; r: number; vy: number; life: number };
type Form = { x: number; y: number; s: number; sx: number; rot: number; spin: number; ph: number; ring: boolean };


export function mountWater(canvas: HTMLCanvasElement, reduced: boolean) {
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0, dpr = 1;
  let specks: Speck[] = [];
  const bubbles: Bubble[] = [];
  let px = -9999, py = -9999, lastScroll = window.scrollY, raf = 0, running = false;
  let depth = 0, goal = 0, need = true;

  // A soft lime dot, drawn once and stamped many times.
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  {
    const s = sprite.getContext('2d')!;
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, `rgba(${GLOW}, 1)`);
    g.addColorStop(0.18, `rgba(${GLOW}, 0.85)`);
    g.addColorStop(0.45, `rgba(${GLOW}, 0.18)`);
    g.addColorStop(1, `rgba(${GLOW}, 0)`);
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);
  }

  // Out-of-focus forms: a dark, soft green-black body with a glossy lime rim, each drawn once and
  // then stretched, turned and drifted. Blurry by nature, so upscaling costs nothing.
  const soft = (stops: [number, string][]) => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const s = c.getContext('2d')!;
    const g = s.createRadialGradient(128, 128, 0, 128, 128, 128);
    for (const [o, col] of stops) g.addColorStop(o, col);
    s.fillStyle = g;
    s.fillRect(0, 0, 256, 256);
    return c;
  };
  const body = soft([[0, 'rgba(2, 12, 10, 0.55)'], [0.55, 'rgba(4, 18, 14, 0.3)'], [1, 'rgba(6, 22, 18, 0)']]);
  const rim = soft([[0, `rgba(${GLOW}, 0)`], [0.62, `rgba(${GLOW}, 0)`], [0.8, `rgba(${GLOW}, 0.05)`], [0.86, `rgba(${GLOW}, 0.2)`], [0.9, `rgba(${GLOW}, 0.06)`], [1, `rgba(${GLOW}, 0)`]]);
  const forms: Form[] = [
    { x: 0.78, y: 0.3, s: 1.1, sx: 2.6, rot: -0.5, spin: 0.012, ph: 0, ring: true },
    { x: 0.2, y: 0.75, s: 0.9, sx: 1.4, rot: 0.4, spin: -0.009, ph: 2, ring: false },
    { x: 0.62, y: 0.82, s: 0.8, sx: 3.2, rot: 0.25, spin: 0.007, ph: 4, ring: true },
    { x: 0.95, y: 0.6, s: 0.7, sx: 1.2, rot: 0, spin: 0.01, ph: 1, ring: false },
    { x: 0.08, y: 0.18, s: 0.6, sx: 2.2, rot: 1.1, spin: -0.006, ph: 3, ring: true },
  ];

  // Anglerfish lures live at fixed depths in the midnight zone; you sink past them. The only
  // animals drawn are lights: the real animals are the photos in the lens.
  const lures: Lure[] = Array.from({ length: 5 }, () => ({
    d: 1300 + Math.random() * 2500, x: Math.random(), v: (0.008 + Math.random() * 0.012) * (Math.random() < 0.5 ? -1 : 1), ph: Math.random() * 6.28,
  }));

  function seed() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const n = Math.min(w < 700 ? 55 : 120, Math.round((w * h) / 11000));
    specks = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 0.6 + Math.random() * Math.random() * 2,
      base: 0.12 + Math.random() * 0.3,
      vy: 0.04 + Math.random() * 0.12,
      ph: Math.random() * 6.28, lit: 0,
    }));
    need = true;
  }

  // How many metres fit in one screen height: tight near the surface, wide in the deep.
  const span = (m: number) => Math.min(2600, Math.max(70, m * 0.9));

  function frame(now: number) {
    const t = now / 1000;
    // Glide towards the new depth, so a jump of 100 m in the practice dive reads as sinking.
    depth = reduced ? goal : depth + (goal - depth) * 0.05;
    const dy = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const sun = Math.max(0, 1 - depth / 230);
    const dark = Math.min(1, depth / 900);

    // The forms: faint in sunlit water, then dark masses edged with living light in the deep.
    const lab = 0.25 + 0.75 * Math.min(1, depth / 700);
    const big = Math.max(w, h);
    for (const f of forms) {
      const tt = reduced ? 0 : t;
      const x = f.x * w + Math.sin(tt * 0.05 + f.ph) * w * 0.04;
      const y = f.y * h + Math.cos(tt * 0.04 + f.ph) * h * 0.05 - window.scrollY * 0.015;
      const r = big * f.s * 0.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(f.rot + tt * f.spin);
      ctx.scale(f.sx, 1);
      ctx.globalAlpha = lab;
      ctx.drawImage(body, -r, -r, r * 2, r * 2);
      if (f.ring) { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(rim, -r * 0.9, -r * 0.9, r * 1.8, r * 1.8); ctx.globalCompositeOperation = 'source-over'; }
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // Sunlight shafts, fading out by about 230 m.
    if (sun > 0.01) {
      for (let k = 0; k < 6; k++) {
        const x0 = w * (0.12 + k * 0.17) + Math.sin(t * 0.15 + k * 1.7) * 40;
        const spread = 60 + k * 18;
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, `rgba(210, 240, 255, ${0.09 * sun})`);
        g.addColorStop(1, 'rgba(210, 240, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x0 - 18, -10);
        ctx.lineTo(x0 + 18, -10);
        ctx.lineTo(x0 + spread + 120, h);
        ctx.lineTo(x0 + spread - 40, h);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Anglerfish lures: one light each, bobbing, slowly pulsing.
    const mPerPx = span(depth) / h;
    ctx.globalCompositeOperation = 'lighter';
    for (const c of lures) {
      const y = h * 0.5 + (c.d - depth) / mPerPx;
      if (y < -100 || y > h + 100) continue;
      if (!reduced) c.x += c.v * 0.016;
      if (c.x > 1.1) c.x = -0.1;
      if (c.x < -0.1) c.x = 1.1;
      const bob = reduced ? 0 : Math.sin(t * 0.8 + c.ph) * 6;
      ctx.globalAlpha = (reduced ? 0.8 : 0.6 + 0.4 * Math.sin(t * 1.3 + c.ph)) * dark;
      ctx.drawImage(sprite, c.x * w - 18, y + bob - 18, 36, 36);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // Plankton.
    ctx.globalCompositeOperation = 'lighter';
    const intensity = 0.25 + 0.75 * dark;
    for (const s of specks) {
      if (!reduced) {
        s.y -= s.vy + dy * (0.1 + s.r * 0.1);
        s.x += Math.sin(t * 0.4 + s.ph) * 0.08;
        if (s.y < -10) { s.y = h + 10; s.x = Math.random() * w; }
        if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
        const d = Math.hypot(s.x - px, s.y - py);
        const target = d < 150 ? (1 - d / 150) ** 2 : 0;
        s.lit += (target > s.lit ? 0.25 : 0.025) * (target - s.lit);
      }
      const a = Math.min(1, s.base * intensity + s.lit);
      const size = s.r * (5 + s.lit * 6);
      ctx.globalAlpha = a;
      ctx.drawImage(sprite, s.x - size, s.y - size, size * 2, size * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // Bubbles.
    // Bubbles rise only near the surface, where the diver's own air still reaches.
    if (!reduced && sun > 0.2 && Math.abs(dy) > 40 && bubbles.length < 60) for (let k = 0; k < 2; k++) burst(Math.random() * w, h + 10, 1);
    for (let k = bubbles.length - 1; k >= 0; k--) {
      const b = bubbles[k];
      b.y -= b.vy;
      b.x += Math.sin(b.y / 30) * 0.4;
      b.life -= 0.006;
      if (b.y < -20 || b.life <= 0) { bubbles.splice(k, 1); continue; }
      ctx.strokeStyle = `rgba(220, 245, 255, ${0.45 * b.life})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 6.283);
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * b.life})`;
      ctx.fillRect(b.x - b.r * 0.4, b.y - b.r * 0.5, 1.5, 1.5);
    }
    need = false;
  }

  function burst(x: number, y: number, n: number) {
    for (let k = 0; k < n; k++) bubbles.push({ x: x + (Math.random() - 0.5) * 40, y: y + Math.random() * 20, r: 1.5 + Math.random() * 4, vy: 0.6 + Math.random() * 1.4, life: 1 });
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
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(seed, 150); });
  seed();
  frame(performance.now());
  start();
  if (reduced) { const tick = () => { if (need) frame(performance.now()); requestAnimationFrame(tick); }; requestAnimationFrame(tick); }

  return {
    setDepth(m: number) { if (Math.abs(m - goal) > 0.5) { goal = m; need = true; } },
    burst(x: number, y: number, n = 14) { if (!reduced) burst(x, y, n); },
  };
}
