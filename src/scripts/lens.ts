// The porthole: a soft liquid lens drawn on a canvas. The photo sits inside a slowly wobbling
// circle with a bioluminescent rim; it cross-fades when the dive reaches a new animal.
// Pauses when the tab is hidden. Reduced motion: a still circle, swaps without a fade.

const GLOW = '79, 230, 212';

export type Lens = { show: (i: number) => void; setGlow: (g: number) => void };

export type Frame = { x: number; y: number; zoom: number; tint?: string };

export function mountLens(canvas: HTMLCanvasElement, urls: string[], frames: Frame[], reduced: boolean): Lens {
  const ctx = canvas.getContext('2d')!;
  const imgs: (HTMLImageElement | null)[] = urls.map((u) => {
    if (!u) return null;
    const im = new Image();
    im.decoding = 'async';
    im.src = u;
    im.onload = () => draw(performance.now());
    return im;
  });

  let cur = 0, prev = 0, fadeStart = -1, glow = 0.35;
  let raf = 0, running = false, dpr = 1, size = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    size = Math.max(1, Math.round(r.width));
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    draw(performance.now());
  }

  function path(t: number, R: number, c: number) {
    ctx.beginPath();
    const n = 96;
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * Math.PI * 2;
      const w = reduced ? 0 :
        0.011 * Math.sin(3 * a + t * 0.55) + 0.007 * Math.sin(5 * a - t * 0.8) + 0.004 * Math.sin(7 * a + t * 1.2);
      const r = R * (1 + w);
      const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r;
      k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function cover(im: HTMLImageElement | null, fr: Frame | undefined, alpha: number, t: number) {
    const s = size * dpr;
    if (!im || !im.complete || !im.naturalWidth) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#010608';
      ctx.fillRect(0, 0, s, s);
      // The abyss: no photo, only one faint point of living light.
      const pulse = reduced ? 0.6 : 0.5 + 0.3 * Math.sin(t * 1.4);
      ctx.fillStyle = `rgba(${GLOW}, ${pulse * alpha})`;
      ctx.shadowColor = `rgba(${GLOW}, ${alpha})`;
      ctx.shadowBlur = 30 * dpr;
      ctx.beginPath();
      ctx.arc(s * 0.56, s * 0.44, 3.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      return;
    }
    const f = fr ?? { x: 0.5, y: 0.5, zoom: 1 };
    const zoom = f.zoom * (1.02 + (reduced ? 0 : 0.012 * Math.sin(t * 0.3)));
    const k = Math.max(s / im.naturalWidth, s / im.naturalHeight) * zoom;
    const w = im.naturalWidth * k, h = im.naturalHeight * k;
    // Put the focus point at the centre, without letting the photo's edge into the lens.
    const x = Math.min(0, Math.max(s - w, s / 2 - f.x * w));
    const y = Math.min(0, Math.max(s - h, s / 2 - f.y * h));
    ctx.globalAlpha = alpha;
    ctx.drawImage(im, x, y, w, h);
    if (f.tint) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = f.tint;
      ctx.fillRect(0, 0, s, s);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  function draw(now: number) {
    const s = size * dpr;
    if (!s) return;
    const t = now / 1000;
    const R = s * 0.46, c = s / 2;
    ctx.clearRect(0, 0, s, s);

    ctx.save();
    path(t, R, c);
    ctx.clip();
    let f = 1;
    if (fadeStart >= 0) {
      f = Math.min(1, (now - fadeStart) / 900);
      if (f >= 1) fadeStart = -1;
    }
    if (f < 1) cover(imgs[prev] ?? null, frames[prev], 1, t);
    cover(imgs[cur] ?? null, frames[cur], f < 1 ? f * f * (3 - 2 * f) : 1, t);
    // Edge shade: the glass gets darker towards the rim, like looking through thick water.
    const shade = ctx.createRadialGradient(c, c, R * 0.55, c, c, R * 1.05);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,8,12,0.55)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, s, s);
    ctx.restore();

    // Rim: living light.
    path(t, R, c);
    ctx.lineWidth = 1.5 * dpr;
    ctx.strokeStyle = `rgba(${GLOW}, ${0.35 + 0.45 * glow})`;
    ctx.shadowColor = `rgba(${GLOW}, ${0.5 + 0.5 * glow})`;
    ctx.shadowBlur = (8 + 28 * glow) * dpr;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function loop(now: number) {
    draw(now);
    raf = requestAnimationFrame(loop);
  }
  function start() {
    if (running || reduced) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  new ResizeObserver(resize).observe(canvas);
  resize();
  start();

  return {
    show(i: number) {
      if (i === cur) return;
      prev = cur;
      cur = i;
      fadeStart = reduced ? -1 : performance.now();
      draw(performance.now());
    },
    setGlow(g: number) {
      glow = g;
      if (reduced) draw(performance.now());
    },
  };
}
