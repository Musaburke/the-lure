// Spot the fake: renders a question from the bank as message cards and handles the answer.
// Used by each stage of the dive and by the practice dive. Everything is built with
// textContent, never innerHTML.
import type { Question, Card } from '../data/questions';

export type Answer = { question: Question; correct: boolean };

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const LABEL: Record<Card['kind'], string> = { text: 'Text message', email: 'Email', shop: 'Listing', link: 'Link', profile: 'Profile' };

export function cardNode(c: Card, i: number): HTMLButtonElement {
  const b = el('button', `card k-${c.kind}`);
  b.type = 'button';
  b.dataset.i = String(i);
  b.setAttribute('data-ui', '');
  const head = el('span', 'c-head');
  head.append(el('span', 'visually-hidden', `${LABEL[c.kind]} ${i + 1}: `), el('span', 'c-from', c.from));
  if (c.meta) head.append(el('span', 'c-meta', c.meta));
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

export function mountChallenge(root: HTMLElement, pool: Question[], opts: { onAnswer?: (a: Answer) => void; onShow?: (q: Question) => void; startId?: string; shuffle?: boolean } = {}) {
  const goal = root.querySelector<HTMLElement>('[data-goal]')!;
  const cards = root.querySelector<HTMLElement>('[data-cards]')!;
  const result = root.querySelector<HTMLElement>('[data-result]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const count = root.querySelector<HTMLElement>('[data-count]');

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
    cards.replaceChildren(...q.cards.map(cardNode));
    result.replaceChildren();
    if (next) next.hidden = true;
    if (count) count.textContent = `${pos + 1} of ${pool.length}`;
    opts.onShow?.(q);
  }

  function answer(i: number) {
    if (answered) return;
    answered = true;
    const q = pool[order[pos]];
    const fakeIdx = q.cards.findIndex((c) => c.fake);
    const correct = i === fakeIdx;
    const nodes = [...cards.querySelectorAll<HTMLButtonElement>('.card')];
    nodes.forEach((n, k) => {
      n.setAttribute('aria-disabled', 'true');
      n.classList.add(k === fakeIdx ? 'is-fake' : 'is-real');
      if (k === i) n.classList.add('picked');
    });
    markTell(nodes[fakeIdx], q.cards[fakeIdx].tell ?? '');
    root.dataset.state = correct ? 'right' : 'wrong';
    const verdict = el('p', 'r-verdict', correct ? 'Yes, that one is the fake.' : 'Not that one.');
    const lines = [verdict];
    if (!correct) lines.push(el('p', 'r-real', `That one is real. ${q.cards[i].real ?? ''}`.trim()));
    lines.push(el('p', 'r-why', q.why));
    result.replaceChildren(...lines);
    if (next) { next.hidden = false; next.focus({ preventScroll: true }); }
    opts.onAnswer?.({ question: q, correct });
  }

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
  return { show };
}

export function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
