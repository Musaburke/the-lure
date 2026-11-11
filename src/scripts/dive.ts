// The dive: reads the scroll and drives everything that depends on depth: the water colour, the
// glass lens (position and photo), the gauge, landmarks, the living water and the sound. Also wires
// the challenges, the score, sharing and the link checker. Without JS the page is a plain article.
// Layout is measured once (and on resize), so the scroll handler never forces a reflow.
import { mountGlass } from './glass';
import { mountWater } from './water';
import { mountSound } from './sound';
import { mountChallenge } from './challenge';
import { mountLinkChecker } from './linkui';
import { pressureAtm, tempC, lightPct, formatLight } from './ocean';
import { byScam, type Scam } from '../data/questions';
import { landmarks } from '../data/landmarks';
import { markNode } from './ruler';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = <T extends Element>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];

/* ---------- Progress (this browser only) ---------- */
const KEY = 'the-lure.spotted';
const spotted: Set<string> = (() => { try { return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { return new Set(); } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...spotted])); } catch { /* private mode */ } };

/* ---------- Stages and cached layout ---------- */
type Stage = { el: HTMLElement; col: HTMLElement; d0: number; d1: number; ground: number[]; side: string; photo: number; name: string; top: number; h: number; colTop: number; colBottom: number };
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const stages: Stage[] = $$<HTMLElement>('[data-stage]').map((el) => {
  const [d0, d1] = (el.dataset.depth ?? '0,0').split(',').map(Number);
  return { el, col: $<HTMLElement>('.col', el) ?? el, d0, d1, ground: hex(el.dataset.ground ?? '#000000'), side: el.dataset.side ?? 'left', photo: Number(el.dataset.photo ?? -1), name: el.dataset.name ?? '', top: 0, h: 1, colTop: 0, colBottom: 0 };
});

const lensCanvas = $<HTMLCanvasElement>('[data-lens]');
const lens = lensCanvas ? mountGlass(lensCanvas, JSON.parse(lensCanvas.dataset.photos ?? '[]'), JSON.parse(lensCanvas.dataset.frames ?? '[]'), reduced) : null;
const water = (() => { const c = $<HTMLCanvasElement>('[data-water]'); return c ? mountWater(c, reduced) : null; })();
const soundBtn = $<HTMLButtonElement>('[data-sound]');
const sound = soundBtn ? mountSound(soundBtn) : null;
const g = (k: string) => $<HTMLElement>(`[data-g="${k}"]`);
const gZone = g('zone'), gDepth = g('depth'), gPressure = g('pressure'), gTemp = g('temp'), gLight = g('light'), gMark = g('mark');
const ruler = $<HTMLElement>('[data-ruler]');
const wide = matchMedia('(min-width: 900px)');

let vw = 0, vh = 0, gaugePx = 0, marginPx = 48, lensSize = 0;
const absTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

function measure() {
  vw = window.innerWidth;
  vh = window.innerHeight;
  const cs = getComputedStyle(root);
  gaugePx = (parseFloat(cs.getPropertyValue('--gauge')) || 0) * 16;
  marginPx = lensCanvas ? parseFloat(getComputedStyle(lensCanvas).getPropertyValue('--m')) || 48 : 48;
  lensSize = lensCanvas?.offsetWidth ?? 0;
  for (const s of stages) {
    s.top = absTop(s.el);
    s.h = s.el.offsetHeight;
    s.colTop = absTop(s.col);
    s.colBottom = s.colTop + s.col.offsetHeight;
  }
  buildRuler();
  update();
}

// The document position where the middle of the screen sits when the gauge reads `m` metres.
function depthToY(m: number): number {
  for (const s of stages) if (m >= s.d0 && m <= s.d1 && s.d1 > s.d0) return s.top + ((m - s.d0) / (s.d1 - s.d0)) * s.h;
  const last = stages[stages.length - 1];
  return last.top + last.h;
}

/* ---------- Depth ruler (in the page, so it scrolls for free) ---------- */
function buildRuler() {
  if (!ruler) return;
  ruler.replaceChildren();
  ruler.style.height = `${document.documentElement.scrollHeight}px`;
  const ticks: [number, boolean][] = [];
  for (let m = 0; m <= 200; m += 25) ticks.push([m, m % 100 === 0]);
  for (let m = 300; m <= 1000; m += 100) ticks.push([m, m % 500 === 0 || m === 1000]);
  for (let m = 1500; m <= 4500; m += 500) ticks.push([m, m % 1000 === 0]);
  // The story's dive stops in the abyss; deeper landmarks belong to the practice dive.
  const bottom = stages[stages.length - 1].d1;
  const shown = landmarks.filter((l) => l.m <= bottom);
  const marks = shown.map((l) => depthToY(l.m));
  for (const [m, major] of ticks) {
    const t = document.createElement('span');
    t.className = major ? 'tick major' : 'tick';
    const y = depthToY(m);
    t.style.top = `${y}px`;
    // A landmark's own label already gives its depth, so skip a depth label that would sit on it.
    if (major && !marks.some((my) => Math.abs(my - y) < 22)) t.dataset.label = `${m.toLocaleString('en-GB')} m`;
    ruler.append(t);
  }
  shown.forEach((l, k) => ruler.append(markNode(l, marks[k])));
}

/* ---------- The scroll frame ---------- */
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const PAD = 32, FIT_MIN = 0.3;
let lastDepth = -1, lastMark = '', lastGround = '';
const band = $<HTMLElement>('.band');
// The crossing glides after the scroll rather than being tied to it: `eased` chases the scroll's
// target with a time constant, so wheel steps and fast flicks become one smooth swoop.
const GLIDE = 0.32; // seconds
let eased = -1, lastT = 0, lensK = -1, gliding = false;

function update() {
  const mid = window.scrollY + vh * 0.5;
  let i = stages.findIndex((s) => mid < s.top + s.h);
  if (i < 0) i = stages.length - 1;
  const s = stages[i], next = stages[i + 1] ?? s;
  const p = Math.min(1, Math.max(0, (mid - s.top) / s.h));
  const depth = s.d0 + (s.d1 - s.d0) * p;

  // The water colour, written straight to the two things that show it and only when it changes.
  // (Setting an inherited custom property on the root would restyle the whole page every frame.)
  const [r, gg, b] = mix(s.ground, next.ground, smooth(0.82, 1, p));
  const ground = `rgb(${r} ${gg} ${b})`;
  if (ground !== lastGround) {
    lastGround = ground;
    document.body.style.backgroundColor = ground;
    if (band) band.style.backgroundColor = ground;
  }

  // Lens: it sits beside the text, then swoops to the other side through the gap between one
  // stage's text and the next: it dips into the gap as the gap rises, glides across, then rides up
  // under the old text until that text has cleared. It shrinks only as much as the gap needs.
  // Every bound moves continuously with the scroll, so the lens never jumps or covers text.
  const full = (lensSize * 0.96) / 2;
  let atK = 0;
  while (atK < stages.length - 1 && stages[atK].colBottom - window.scrollY + PAD + full <= vh * 0.5 - 8) atK++;
  // Finish one crossing before starting the next, so the lens never snaps between them; a big
  // jump (a link to a section) moves straight there.
  if (lensK < 0 || reduced || Math.abs(atK - lensK) > 1) { lensK = atK; eased = -1; }
  else if (atK > lensK && eased >= 0.999) { lensK = atK; eased = 0; }
  else if (atK < lensK && eased <= 0.001) { lensK = atK; eased = 1; }
  const k = lensK;
  const from = stages[Math.min(k, stages.length - 1)], to = stages[Math.min(k + 1, stages.length - 1)];
  const gapTop = from.colBottom - window.scrollY, gapBottom = to.colTop - window.scrollY;
  const target = to === from ? 0 : 1 - smooth(vh * 0.35, vh * 1.0, (gapTop + gapBottom) / 2);
  const now = performance.now();
  const dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now;
  if (eased < 0) eased = target;
  else eased += (target - eased) * (1 - Math.exp(-dt / GLIDE));
  const move = Math.abs(target - eased) < 0.0005 ? target : eased;
  gliding = move !== target || atK !== lensK;
  const dip = smooth(0, 0.2, move), across = smooth(0.2, 0.8, move), away = smooth(0.8, 1, move);
  if (lensCanvas && wide.matches) {
    const a = gaugePx + marginPx, z = vw - marginPx;
    const xFor = (st: Stage) => (st.side === 'left' ? a + (z - a) * 0.75 : a + (z - a) * 0.25);
    const cx = xFor(from) + (xFor(to) - xFor(from)) * across;
    const fit = Math.min(1, Math.max(FIT_MIN, (gapBottom - gapTop - 2 * PAD) / (lensSize * 0.96)));
    const scale = 1 - (1 - fit) * dip * (1 - away);
    const r = full * scale;
    const sway = reduced ? 0 : Math.sin(window.scrollY / 380) * 8;
    let cy = vh * 0.5 + sway;
    // Below the text it is leaving: eased in while the lens is still on its own side.
    const below = gapTop + PAD + r;
    if (to !== from && cy < below) cy += (below - cy) * dip;
    // Above the text it is heading away from, until it has moved clear of that column.
    const above = gapBottom - PAD - r;
    if (to !== from && cy > above) cy -= (cy - above) * (1 - away);
    lensCanvas.style.transform = `translate3d(calc(${(cx - lensSize / 2).toFixed(1)}px + var(--lx, 0px)), calc(-50% + ${(cy - vh * 0.5).toFixed(1)}px + var(--ly, 0px)), 0) scale(${(scale * 0.96).toFixed(3)})`;
  } else if (lensCanvas) {
    lensCanvas.style.transform = '';
  }
  lens?.show(across > 0.5 ? to.photo : from.photo);
  lens?.setGlow(Math.min(1, depth / 1200));
  water?.setDepth(depth);

  if (Math.round(depth) !== lastDepth) {
    lastDepth = Math.round(depth);
    if (gZone) gZone.textContent = s.name;
    if (gDepth) gDepth.textContent = lastDepth.toLocaleString('en-GB');
    if (gPressure) gPressure.textContent = `${Math.round(pressureAtm(depth)).toLocaleString('en-GB')} atm`;
    if (gTemp) gTemp.textContent = `about ${Math.round(tempC(depth))} °C`;
    if (gLight) gLight.textContent = formatLight(lightPct(depth));
    sound?.setDepth(depth);
    // The most recent landmark you've passed, shown under the gauge.
    const passed = [...landmarks].reverse().find((l) => l.m <= depth + 1);
    const text = passed ? `${passed.m.toLocaleString('en-GB')} m: ${passed.text}` : '';
    if (gMark && text !== lastMark) {
      lastMark = text;
      gMark.textContent = text;
      gMark.classList.remove('pop');
      void gMark.offsetWidth;
      gMark.classList.add('pop');
    }
  }
}

// One frame per scroll event, and more frames while the lens is still gliding to its place.
let ticking = false;
const frame = () => { ticking = false; update(); if (gliding) tick(); };
const tick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
window.addEventListener('scroll', tick, { passive: true });
let rt = 0;
const remeasure = () => { clearTimeout(rt); rt = window.setTimeout(measure, 120); };
window.addEventListener('resize', remeasure);
wide.addEventListener('change', remeasure);
new ResizeObserver(remeasure).observe(document.body);
document.fonts?.ready.then(remeasure);
measure();

/* ---------- Reveals ---------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -12% 0px' });
for (const el of $$<HTMLElement>('[data-reveal]')) {
  [...el.children].forEach((c, k) => (c as HTMLElement).style.setProperty('--i', String(k)));
  io.observe(el);
}

/* ---------- Challenges and score ---------- */
const total = $$('[data-challenge]').length;
function paintScore() {
  for (const li of $$<HTMLElement>('[data-dot]')) {
    const on = spotted.has(li.dataset.dot ?? '');
    li.classList.toggle('on', on);
    const st = $<HTMLElement>('[data-dot-state]', li);
    if (st) st.textContent = on ? 'spotted' : 'not spotted yet';
  }
  const score = $<HTMLElement>('[data-score]');
  if (score) {
    const n = spotted.size;
    score.textContent = n === 0
      ? `You haven't tried the challenges yet. There is one at each depth, with ten questions each.`
      : n === total ? `You spotted a fake at every depth.` : `You spotted a fake at ${n} of ${total} depths.`;
  }
}
for (const box of $$<HTMLElement>('[data-challenge]')) {
  const scam = box.dataset.scam as Scam;
  const zone = box.closest<HTMLElement>('[data-stage]')?.id ?? scam;
  mountChallenge(box, byScam(scam), {
    startId: box.dataset.first,
    onAnswer: ({ correct }) => {
      if (correct) {
        spotted.add(zone); save(); paintScore();
        const r = box.getBoundingClientRect();
        water?.burst(r.left + r.width / 2, r.top + r.height / 2, 18);
        sound?.blip();
      }
      remeasure();
    },
  });
}
paintScore();

/* ---------- Share ---------- */
const share = $<HTMLButtonElement>('[data-share]');
const shareNote = $<HTMLElement>('[data-share-note]');
share?.addEventListener('click', async () => {
  const data = { title: 'The Lure', text: 'A dive through the deep sea, and the scams that hunt the same way.', url: location.origin + '/' };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(data.url);
    if (shareNote) shareNote.textContent = 'Link copied. Paste it into a message to someone.';
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    if (shareNote) shareNote.textContent = `Copy this link: ${data.url}`;
  }
});

/* ---------- Link checker ---------- */
const form = $<HTMLFormElement>('[data-linkcheck]');
if (form) mountLinkChecker(form, $<HTMLElement>('[data-lc-out]')!);
