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
  for (const [m, major] of ticks) {
    const t = document.createElement('span');
    t.className = major ? 'tick major' : 'tick';
    t.style.top = `${depthToY(m)}px`;
    if (major) t.dataset.label = `${m.toLocaleString('en-GB')} m`;
    ruler.append(t);
  }
  for (const l of landmarks) {
    const d = document.createElement('span');
    d.className = 'mark';
    d.style.top = `${depthToY(l.m)}px`;
    d.title = `${l.text}, ${l.m.toLocaleString('en-GB')} m`;
    ruler.append(d);
  }
}

/* ---------- The scroll frame ---------- */
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const SMALL = 0.26, PAD = 14;
let lastDepth = -1, lastMark = '';

function update() {
  const mid = window.scrollY + vh * 0.5;
  let i = stages.findIndex((s) => mid < s.top + s.h);
  if (i < 0) i = stages.length - 1;
  const s = stages[i], next = stages[i + 1] ?? s;
  const p = Math.min(1, Math.max(0, (mid - s.top) / s.h));
  const depth = s.d0 + (s.d1 - s.d0) * p;

  const [r, gg, b] = mix(s.ground, next.ground, smooth(0.82, 1, p));
  root.style.setProperty('--ground', `rgb(${r} ${gg} ${b})`);

  // Lens: shrink in place, cross only while it fits in the gap between texts, grow on the far side.
  let home = 0, scale = 1, move = 0;
  const spans = stages.slice(0, -1).map((st, k) => {
    const a0 = st.colBottom - lensSize / 2;
    let a1 = st.colBottom + (lensSize * SMALL) / 2 + PAD;
    let b1 = stages[k + 1].colTop - (lensSize * SMALL) / 2 - PAD;
    if (b1 < a1) b1 = a1 = (a1 + b1) / 2;
    return { a0, a1, b1, c1: stages[k + 1].colTop + lensSize / 2 };
  });
  spans.forEach((sp, k) => { if (mid >= sp.c1) home = k + 1; });
  const sp = spans[home];
  if (sp && mid > sp.a0) {
    if (mid < sp.a1) scale = 1 - (1 - SMALL) * smooth(sp.a0, sp.a1, mid);
    else if (mid < sp.b1) { scale = SMALL; move = smooth(sp.a1, sp.b1, mid); }
    else { scale = SMALL + (1 - SMALL) * smooth(sp.b1, sp.c1, mid); move = 1; }
  }
  const from = stages[home], to = stages[Math.min(home + 1, stages.length - 1)];
  if (lensCanvas && wide.matches) {
    const a = gaugePx + marginPx, z = vw - marginPx;
    const xFor = (st: Stage) => (st.side === 'left' ? a + (z - a) * 0.75 : a + (z - a) * 0.25) - lensSize / 2;
    const x = xFor(from) + (xFor(to) - xFor(from)) * move;
    const sway = reduced ? 0 : Math.sin(window.scrollY / 380) * 8;
    lensCanvas.style.transform = `translate3d(calc(${x.toFixed(1)}px + var(--lx, 0px)), calc(-50% + ${sway.toFixed(1)}px + var(--ly, 0px)), 0) scale(${(scale * 0.96).toFixed(3)})`;
  } else if (lensCanvas) {
    lensCanvas.style.transform = '';
  }
  lens?.show(move > 0.5 ? to.photo : from.photo);
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

let ticking = false;
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } }, { passive: true });
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
