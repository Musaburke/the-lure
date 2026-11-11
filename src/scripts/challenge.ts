// Spot the fake: renders a question from the bank as message cards and handles the answer.
// Used by each stage of the dive and by the practice dive. Everything is built with
// textContent, never innerHTML.
import { scams, type Question, type Card } from '../data/questions';

export type Answer = { question: Question; correct: boolean };

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

export const LABEL: Record<Card['kind'], string> = {
  text: 'Text message', email: 'Email', shop: 'Listing', link: 'Link', profile: 'Profile',
  call: 'Phone call', popup: 'Browser window', qr: 'QR code', notify: 'Notification', search: 'Search result',
};

const SVG = 'http://www.w3.org/2000/svg';
// A QR-like glyph, seeded by the address so each code looks different. Decorative: the address it
// opens is written next to it.
export function qrGlyph(seed: string): SVGSVGElement {
  const n = 21, svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${n} ${n}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('c-qr');
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const finder = (x: number, y: number) => x >= 0 && x < 7 && y >= 0 && y < 7;
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const corner = finder(x, y) || finder(x - 14, y) || finder(x, y - 14);
    if (corner) continue;
    h = Math.imul(h ^ (x * 31 + y), 2654435761) >>> 0;
    if (h % 7 < 3) d += `M${x} ${y}h1v1h-1z`;
  }
  for (const [x, y] of [[0, 0], [14, 0], [0, 14]]) d += `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  const path = document.createElementNS(SVG, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill-rule', 'evenodd');
  svg.append(path);
  return svg;
}

export function cardNode(c: Card, i: number): HTMLButtonElement {
  const b = el('button', `card k-${c.kind}`);
  b.type = 'button';
  b.dataset.i = String(i);
  b.setAttribute('data-ui', '');
  const head = el('span', 'c-head');
  head.append(el('span', 'visually-hidden', `${LABEL[c.kind]} ${i + 1}: `), el('span', 'c-from', c.from));
  // A QR code shows where it leads under the code, the way a phone camera does.
  if (c.meta) head.append(el('span', 'c-meta', c.kind === 'qr' ? `Opens ${c.meta}` : c.meta));
  if (c.kind === 'qr') b.append(qrGlyph(c.meta ?? c.from));
  b.append(head);
  if (c.subject) b.append(el('span', 'c-subject', c.subject));
  for (const line of c.body) b.append(el('span', 'c-line', line));
  return b;
}

// Wrap the giveaway phrase in <mark> inside the card, wherever it appears.
function markTell(card: HTMLElement, tell: string) {
  const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.nodeValue ?? '';
    const at = t.indexOf(tell);
    if (at < 0) continue;
    const range = document.createRange();
    range.setStart(n, at);
    range.setEnd(n, at + tell.length);
    const mark = el('mark', 'tell');
    range.surroundContents(mark);
    return;
  }
}

export function mountChallenge(root: HTMLElement, startPool: Question[], opts: { onAnswer?: (a: Answer) => void; onShow?: (q: Question) => void; startId?: string; shuffle?: boolean } = {}) {
  const goal = root.querySelector<HTMLElement>('[data-goal]')!;
  const cards = root.querySelector<HTMLElement>('[data-cards]')!;
  const result = root.querySelector<HTMLElement>('[data-result]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const noneRow = root.querySelector<HTMLElement>('[data-none]');

  let pool = startPool;
  let order = pool.map((_, k) => k);
  if (opts.shuffle) order = shuffle(order);
  if (opts.startId) {
    const k = pool.findIndex((q) => q.id === opts.startId);
    if (k >= 0) order = [k, ...order.filter((x) => x !== k)];
  }
  let pos = 0;
  let answered = false;

  function show() {
    const q = pool[order[pos]];
    answered = false;
    root.dataset.state = 'asking';
    goal.textContent = q.goal;
    // Shuffle the cards every time, so the fake's position is never a clue. data-i keeps the
    // card's index in the question bank.
    cards.replaceChildren(...shuffle(q.cards.map((_, k) => k)).map((k, pos) => {
      const n = cardNode(q.cards[k], pos);
      n.dataset.i = String(k);
      return n;
    }));
    result.replaceChildren();
    // Hard questions can all be real, so they always offer "none", whichever kind they are.
    if (noneRow) {
      noneRow.hidden = !q.attack;
      noneRow.querySelector('button')?.removeAttribute('aria-disabled');
      noneRow.querySelector('button')?.classList.remove('lit');
    }
    if (next) next.hidden = true;
    if (count) count.textContent = `${pos + 1} of ${pool.length}`;
    opts.onShow?.(q);
  }

  function answer(i: number) {
    if (answered) return;
    answered = true;
    const q = pool[order[pos]];
    const fakeIdx = q.cards.findIndex((c) => c.fake); // -1 when none is fake
    const correct = i === fakeIdx;
    noneRow?.querySelector('button')?.setAttribute('aria-disabled', 'true');
    if (q.none) noneRow?.querySelector('button')?.classList.add('lit');
    const nodes = [...cards.querySelectorAll<HTMLButtonElement>('.card')];
    nodes.forEach((n) => {
      const k = Number(n.dataset.i);
      n.setAttribute('aria-disabled', 'true');
      n.classList.add(k === fakeIdx ? 'is-fake' : 'is-real');
      if (k === i) n.classList.add('picked');
    });
    const fakeNode = nodes.find((n) => Number(n.dataset.i) === fakeIdx);
    if (fakeNode) markTell(fakeNode, q.cards[fakeIdx].tell ?? '');
    root.dataset.state = correct ? 'right' : 'wrong';
    const verdict = el('p', 'r-verdict', correct
      ? (q.none ? 'Right: none of these is fake.' : 'Yes, that one is the fake.')
      : (q.none ? 'None of these was fake.' : i < 0 ? 'One of them was fake.' : 'Not that one.'));
    // Name the trick once the answer is in, so the kind of scam sticks. Hard questions name the
    // real attack.
    const kind = scams[q.scam];
    const type = el('p', 'r-type');
    type.append(
      el('span', 'r-type-name', q.attack ?? kind.type),
      el('span', 'r-type-about', q.attack ? `A ${kind.type.toLowerCase()}, the trick of the ${kind.animal}.` : `The trick of the ${kind.animal}: ${kind.about}`),
    );
    const lines = [verdict, type];
    if (!correct && i >= 0) lines.push(el('p', 'r-real', `That one is real. ${q.cards[i].real ?? ''}`.trim()));
    lines.push(el('p', 'r-why', q.why));
    result.replaceChildren(...lines);
    if (next) { next.hidden = false; next.focus({ preventScroll: true }); }
    opts.onAnswer?.({ question: q, correct });
  }

  noneRow?.querySelector('button')?.addEventListener('click', () => answer(-1));
  cards.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.card');
    if (b) answer(Number(b.dataset.i));
  });
  next?.addEventListener('click', () => {
    pos += 1;
    if (pos >= order.length) { pos = 0; if (opts.shuffle) order = shuffle(order); }
    show();
    cards.querySelector<HTMLButtonElement>('.card')?.focus({ preventScroll: true });
  });

  root.dataset.live = '';
  show();
  return {
    show,
    // Swap in a new set of questions (the practice dive's level and filter), starting afresh.
    setPool(next: Question[]) {
      pool = next;
      order = pool.map((_, k) => k);
      if (opts.shuffle) order = shuffle(order);
      pos = 0;
      show();
    },
  };
}

export function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
