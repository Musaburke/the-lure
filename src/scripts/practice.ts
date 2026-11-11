// The practice dive: an endless spot-the-fake game. Every right answer sinks you 100 m past real
// landmarks; a wrong one shows the giveaway and you stay put. Your deepest dive is remembered in
// this browser only. No timer.
import { mountChallenge } from './challenge';
import { mountGlass } from './glass';
import { mountWater } from './water';
import { mountSound } from './sound';
import { questions, hard, scams, type Scam } from '../data/questions';
import { landmarks } from '../data/landmarks';
import { markNode } from './ruler';
import { lenis } from './smooth';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = <T extends Element>(s: string) => document.querySelector<T>(s);

const KEY = 'the-lure.practice';
type Saved = { best: number; right: number };
const saved: Saved = (() => { try { return { best: 0, right: 0, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; } catch { return { best: 0, right: 0 }; } })();
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* private mode */ } };

let depth = 0, streak = 0, rightThisDive = 0;
const STEP = 100;

// Water colour by depth. Light dies fast (about 1% is left at 200 m), so every right answer in the
// first kilometre visibly darkens the water, through the green-black of the deep to near black.
const stops: [number, string][] = [
  [0, '#0d5274'], [100, '#0c4a5f'], [200, '#0f4048'], [300, '#11373a'], [500, '#112e2d'], [800, '#0f2524'],
  [1200, '#0c1c1b'], [2000, '#081312'], [3500, '#040a09'], [6000, '#020403'], [11000, '#000000'],
];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function groundAt(m: number) {
  for (let k = 0; k < stops.length - 1; k++) {
    const [a, ca] = stops[k], [b, cb] = stops[k + 1];
    if (m <= b) { const t = (m - a) / (b - a); const x = hex(ca), y = hex(cb); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(' ')})`; }
  }
  return '#000000';
}

const water = (() => { const c = $<HTMLCanvasElement>('[data-water]'); return c ? mountWater(c, reduced) : null; })();
const lensCanvas = $<HTMLCanvasElement>('[data-lens]');
const lens = lensCanvas ? mountGlass(lensCanvas, JSON.parse(lensCanvas.dataset.photos ?? '[]'), JSON.parse(lensCanvas.dataset.frames ?? '[]'), reduced) : null;
const soundBtn = $<HTMLButtonElement>('[data-sound]');
const sound = soundBtn ? mountSound(soundBtn) : null;
const lensIndex = Object.fromEntries(Object.keys(scams).map((k, i) => [k, i])) as Record<Scam, number>;

const out = {
  depth: $<HTMLElement>('[data-h="depth"]'), right: $<HTMLElement>('[data-h="right"]'),
  streak: $<HTMLElement>('[data-h="streak"]'), best: $<HTMLElement>('[data-h="best"]'),
  mark: $<HTMLElement>('[data-mark]'), strip: $<HTMLElement>('[data-strip]'),
};

// The ruler: a tall strip of ticks that slides up as you sink.
const PX_PER_M = 0.6;
if (out.strip) {
  for (let m = 0; m <= 11000; m += 100) {
    const t = document.createElement('span');
    const major = m % 1000 === 0;
    t.className = major ? 'tick major' : 'tick';
    t.style.top = `${m * PX_PER_M}px`;
    // A landmark's own label already gives its depth, so skip a depth label that would sit on it.
    if (major && !landmarks.some((l) => Math.abs(l.m - m) * PX_PER_M < 22)) t.dataset.label = `${m.toLocaleString('en-GB')} m`;
    out.strip.append(t);
  }
  for (const l of landmarks) out.strip.append(markNode(l, l.m * PX_PER_M));
}

function paint(prev: number) {
  root.style.setProperty('--ground', groundAt(depth));
  water?.setDepth(depth);
  lens?.setGlow(Math.min(1, depth / 1200));
  sound?.setDepth(depth);
  if (out.strip) out.strip.style.transform = `translateY(calc(50vh - ${depth * PX_PER_M}px))`;
  if (out.depth) out.depth.textContent = `${depth.toLocaleString('en-GB')} m`;
  if (out.right) out.right.textContent = String(rightThisDive);
  if (out.streak) out.streak.textContent = String(streak);
  if (out.best) out.best.textContent = `${saved.best.toLocaleString('en-GB')} m`;
  const passed = landmarks.filter((l) => l.m > prev && l.m <= depth).pop();
  if (passed && out.mark) {
    out.mark.textContent = `${passed.m.toLocaleString('en-GB')} m: ${passed.text}`;
    out.mark.classList.remove('pop');
    void out.mark.offsetWidth;
    out.mark.classList.add('pop');
  }
}

const box = $<HTMLElement>('[data-challenge]');
// Level and scam filter. Hard mode draws on the real-world attacks; the choice is remembered in
// this browser only.
const setup = $<HTMLFormElement>('[data-setup]');
const note = $<HTMLElement>('[data-setup-note]');
const LEVEL = 'the-lure.level';
const read = () => { try { return localStorage.getItem(LEVEL); } catch { return null; } };
// The address carries the choice too (?level=hard&scam=voice), so a link opens the same set.
const query = new URLSearchParams(location.search);
const field = (n: string) => setup?.elements.namedItem(n) as RadioNodeList | null;
const level0 = query.get('level') ?? read();
if (level0 === 'hard' || level0 === 'normal') { const f = field('level'); if (f) f.value = level0; }
const scam0 = query.get('scam');
if (scam0 && scam0 in scams) { const f = field('scam'); if (f) f.value = scam0; }
function pool() {
  const level = setup ? (setup.elements.namedItem('level') as RadioNodeList).value : 'normal';
  const scam = setup ? (setup.elements.namedItem('scam') as RadioNodeList).value : 'all';
  const set = (level === 'hard' ? hard : questions).filter((q) => scam === 'all' || q.scam === scam);
  if (note) note.textContent = level === 'hard'
    ? `${set.length} questions on named attacks, four cards each. Some have no fake at all.`
    : '';
  return set;
}

if (box) {
  const game = mountChallenge(box, pool(), {
    shuffle: true,
    // Keep the lens on the animal that matches the current question.
    onShow: (q) => lens?.show(lensIndex[q.scam]),
    onAnswer: ({ correct }) => {
      const prev = depth;
      if (correct) {
        depth += STEP; streak += 1; rightThisDive += 1; saved.right += 1;
        if (depth > saved.best) saved.best = depth;
        persist();
        const r = box.getBoundingClientRect();
        water?.burst(r.left + r.width / 2, r.top + r.height * 0.4, 22);
        sound?.blip();
      } else {
        streak = 0;
      }
      paint(prev);
    },
  });
  setup?.addEventListener('change', () => {
    const level = field('level')?.value ?? 'normal', scam = field('scam')?.value ?? 'all';
    try { localStorage.setItem(LEVEL, level); } catch { /* private mode */ }
    const q = new URLSearchParams();
    if (level !== 'normal') q.set('level', level);
    if (scam !== 'all') q.set('scam', scam);
    history.replaceState(null, '', q.size ? `?${q}` : location.pathname);
    game.setPool(pool());
  });
}

$<HTMLButtonElement>('[data-restart]')?.addEventListener('click', () => {
  const prev = depth;
  depth = 0; streak = 0; rightThisDive = 0;
  paint(prev);
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: 'auto' });
});

paint(0);

// Parts of the page rise in once on arrival.
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
});
document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
  [...el.children].forEach((c, k) => (c as HTMLElement).style.setProperty('--i', String(k)));
  io.observe(el);
});
