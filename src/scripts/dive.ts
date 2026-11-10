// The dive: reads the scroll and drives everything that depends on depth. The water colour,
// the lens (position and photo), the gauge, the plankton and the sound. Also wires the checks,
// the score, sharing and the link checker. Without JS the page is a plain, complete article.
import { mountLens } from './lens';
import { mountPlankton } from './plankton';
import { mountSound } from './sound';
import { pressureAtm, tempC, lightPct, formatLight } from './ocean';
import { checkLink } from './linkcheck';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = <T extends Element>(s: string, el: ParentNode = document) => el.querySelector<T>(s);
const $$ = <T extends Element>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];

/* ---------- Progress (this browser only) ---------- */
const KEY = 'the-lure.spotted';
function loadSpotted(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { return new Set(); }
}
const spotted = loadSpotted();
function saveSpotted() {
  try { localStorage.setItem(KEY, JSON.stringify([...spotted])); } catch { /* private mode: progress lasts this visit */ }
}

/* ---------- Stages ---------- */
type Stage = { el: HTMLElement; col: HTMLElement; d0: number; d1: number; ground: number[]; side: string; photo: number; name: string };
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const stages: Stage[] = $$<HTMLElement>('[data-stage]').map((el) => {
  const [d0, d1] = (el.dataset.depth ?? '0,0').split(',').map(Number);
  return { el, col: el.querySelector<HTMLElement>('.col') ?? el, d0, d1, ground: hex(el.dataset.ground ?? '#000000'), side: el.dataset.side ?? 'left', photo: Number(el.dataset.photo ?? -1), name: el.dataset.name ?? '' };
});

const lensCanvas = $<HTMLCanvasElement>('[data-lens]');
const lens = lensCanvas ? mountLens(lensCanvas, JSON.parse(lensCanvas.dataset.photos ?? '[]'), JSON.parse(lensCanvas.dataset.frames ?? '[]'), reduced) : null;
const plankton = (() => { const c = $<HTMLCanvasElement>('[data-plankton]'); return c ? mountPlankton(c, reduced) : null; })();
const soundBtn = $<HTMLButtonElement>('[data-sound]');
const sound = soundBtn ? mountSound(soundBtn) : null;
const g = (k: string) => $<HTMLElement>(`[data-g="${k}"]`);
const gZone = g('zone'), gDepth = g('depth'), gPressure = g('pressure'), gTemp = g('temp'), gLight = g('light');

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const wide = matchMedia('(min-width: 900px)');

let lastDepth = -1;
function update() {
  const mid = window.scrollY + window.innerHeight * 0.5;
  let i = stages.findIndex((s) => { const r = s.el.offsetTop + s.el.offsetHeight; return mid < r; });
  if (i < 0) i = stages.length - 1;
  const s = stages[i], next = stages[i + 1] ?? s;
  const p = Math.min(1, Math.max(0, (mid - s.el.offsetTop) / s.el.offsetHeight));
  const depth = s.d0 + (s.d1 - s.d0) * p;

  // Water: one flat colour at a time, easing into the next zone's colour across the boundary.
  const t = smooth(0.82, 1, p);
  const [r, gg, b] = mix(s.ground, next.ground, t);
  root.style.setProperty('--ground', `rgb(${r} ${gg} ${b})`);

  // Lens: on the side away from the text. Between two stages it shrinks in place, crosses only
  // while it fits in the gap between the texts, then grows on the new side, so it never slides
  // under a paragraph. "home" is the stage whose side the lens is on.
  const size = lensCanvas?.offsetWidth ?? 0;
  const SMALL = 0.26, PAD = 14;
  const edge = (st: Stage, e: 'top' | 'bottom') => { const r = st.col.getBoundingClientRect(); return (e === 'top' ? r.top : r.bottom) + window.scrollY; };
  const spans = stages.slice(0, -1).map((st, k) => {
    const bottom = edge(st, 'bottom'), top = edge(stages[k + 1], 'top');
    const a0 = bottom - size / 2;
    let a1 = bottom + (size * SMALL) / 2 + PAD;
    let b1 = top - (size * SMALL) / 2 - PAD;
    if (b1 < a1) b1 = a1 = (a1 + b1) / 2;
    return { a0, a1, b1, c1: top + size / 2 };
  });
  let home = 0;
  spans.forEach((sp, k) => { if (mid >= sp.c1) home = k + 1; });
  const sp = spans[home];
  let scale = 1, move = 0;
  if (sp && mid > sp.a0) {
    if (mid < sp.a1) scale = 1 - (1 - SMALL) * smooth(sp.a0, sp.a1, mid);
    else if (mid < sp.b1) { scale = SMALL; move = smooth(sp.a1, sp.b1, mid); }
    else { scale = SMALL + (1 - SMALL) * smooth(sp.b1, sp.c1, mid); move = 1; }
  }
  const from = stages[home], to = stages[Math.min(home + 1, stages.length - 1)];
  if (lensCanvas && wide.matches) {
    const vw = window.innerWidth, gauge = parseFloat(getComputedStyle(root).getPropertyValue('--gauge')) * 16 || 0;
    const margin = parseFloat(getComputedStyle(lensCanvas).getPropertyValue('--m')) || 48;
    const a = gauge + margin, z = vw - margin;
    const xFor = (st: Stage) => (st.side === 'left' ? a + (z - a) * 0.75 : a + (z - a) * 0.25) - size / 2;
    const x = xFor(from) + (xFor(to) - xFor(from)) * move;
    const sway = reduced ? 0 : Math.sin(window.scrollY / 380) * 8;
    lensCanvas.style.transform = `translate3d(${x.toFixed(1)}px, calc(-50% + ${sway.toFixed(1)}px), 0) scale(${(scale * 0.96).toFixed(3)})`;
  } else if (lensCanvas) {
    lensCanvas.style.transform = '';
  }
  lens?.show(move > 0.5 ? to.photo : from.photo);
  lens?.setGlow(Math.min(1, depth / 1200));
  plankton?.setIntensity(0.22 + 0.78 * Math.min(1, depth / 900));

  if (Math.round(depth) !== lastDepth) {
    lastDepth = Math.round(depth);
    if (gZone) gZone.textContent = s.name;
    if (gDepth) gDepth.textContent = lastDepth.toLocaleString('en-GB');
    if (gPressure) gPressure.textContent = `${Math.round(pressureAtm(depth)).toLocaleString('en-GB')} atm`;
    if (gTemp) gTemp.textContent = `about ${Math.round(tempC(depth))} °C`;
    if (gLight) gLight.textContent = formatLight(lightPct(depth));
    sound?.setDepth(depth);
  }
}
let ticking = false;
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } };
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
wide.addEventListener('change', onScroll);
update();

/* ---------- Reveals ---------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -12% 0px' });
for (const el of $$<HTMLElement>('[data-reveal]')) {
  [...el.children].forEach((c, k) => (c as HTMLElement).style.setProperty('--i', String(k)));
  io.observe(el);
}

/* ---------- Checks and score ---------- */
const total = $$('[data-check]').length;
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
      ? `You haven't tried the checks yet. There are ${total} on the way down.`
      : n === total
        ? `You spotted all ${total} lures.`
        : `You spotted ${n} of ${total} lures.`;
  }
}
for (const box of $$<HTMLElement>('[data-check]')) {
  const id = box.dataset.check ?? '';
  const fb = $<HTMLElement>('.feedback', box)!;
  for (const btn of $$<HTMLButtonElement>('.part', box)) {
    btn.addEventListener('click', () => {
      if (btn.hasAttribute('data-tell')) {
        btn.classList.add('hit');
        fb.textContent = fb.dataset.right ?? '';
        fb.classList.add('right');
        spotted.add(id);
        saveSpotted();
        paintScore();
      } else {
        btn.classList.add('tried');
        fb.classList.remove('right');
        fb.textContent = btn.dataset.why ?? '';
      }
    });
  }
  if (spotted.has(id)) {
    $<HTMLButtonElement>('.part[data-tell]', box)?.classList.add('hit');
    fb.textContent = fb.dataset.right ?? '';
    fb.classList.add('right');
  }
}
paintScore();

/* ---------- Share ---------- */
const share = $<HTMLButtonElement>('[data-share]');
const shareNote = $<HTMLElement>('[data-share-note]');
share?.addEventListener('click', async () => {
  const data = { title: 'The Lure', text: 'A dive through the deep sea, and the scams that hunt the same way.', url: location.origin + location.pathname };
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
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $<HTMLInputElement>('input', form)!;
  const out = $<HTMLElement>('[data-lc-out]')!;
  const res = checkLink(input.value);
  out.replaceChildren();
  out.dataset.verdict = res.ok ? res.verdict : 'error';
  const p = (text: string, cls?: string) => { const el = document.createElement('p'); el.textContent = text; if (cls) el.className = cls; out.append(el); return el; };
  if (!res.ok) { p(res.error, 'lc-verdict'); return; }
  const head = { clear: 'No obvious warning signs.', careful: 'Be careful with this one.', danger: "Don't open this link." }[res.verdict];
  p(head, 'lc-verdict');
  const where = document.createElement('p');
  where.className = 'lc-where';
  where.append('It really goes to ');
  const b = document.createElement('strong');
  b.textContent = res.site;
  where.append(b, '.');
  out.append(where);
  if (res.signs.length) {
    const ul = document.createElement('ul');
    for (const s of res.signs) { const li = document.createElement('li'); li.textContent = s.text; ul.append(li); }
    out.append(ul);
  }
  p(res.verdict === 'clear'
    ? "A clean address doesn't prove a site is safe. If a message sent you here, go to the company's website yourself instead."
    : 'If a message sent you this, delete it. To check, go to the company’s website or app yourself.', 'lc-note');
});
