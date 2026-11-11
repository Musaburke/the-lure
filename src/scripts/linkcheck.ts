// Reads a pasted link and lists the warning signs. Runs only in the browser: the link is
// parsed as text, never opened, fetched or sent anywhere. It compares the address against the real
// addresses of brands scammers copy most (brands.ts), so it can name a look-alike. It can only
// spot known tricks, so it never calls a link safe.
import { BRANDS, GENERIC, PUBLIC } from './brands.ts';

export type Sign = { id: string; text: string };
export type Result =
  | { ok: false; error: string }
  | { ok: true; host: string; site: string; signs: Sign[]; verdict: 'clear' | 'careful' | 'danger'; known?: string };

// Second-level suffixes where the name people recognise sits one label further left.
const SECOND_LEVEL = new Set([
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'nhs.uk', 'ltd.uk', 'plc.uk', 'me.uk', 'net.uk', 'police.uk',
  'com.au', 'net.au', 'org.au', 'co.nz', 'co.za', 'com.br', 'co.jp', 'co.in', 'com.cn', 'com.sg',
]);
const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'rebrand.ly',
  'shorturl.at', 'tiny.cc', 'rb.gy', 't.ly', 'shorte.st', 'bl.ink', 'lnkd.in',
]);
// Endings that are cheap to register and turn up often in scam links. Not proof on their own.
const RISKY_TLDS = new Set(['zip', 'mov', 'top', 'xyz', 'click', 'link', 'rest', 'cam', 'icu', 'buzz', 'cfd', 'sbs', 'quest', 'monster', 'help']);
const BAIT_WORDS = ['login', 'log-in', 'signin', 'verify', 'secure', 'account', 'update', 'refund', 'claim', 'redeliver', 'redelivery', 'unlock', 'suspend', 'wallet', 'billing', 'confirm', 'prize', 'reward'];

export function siteOf(host: string): string {
  const labels = host.replace(/^www\./, '').split('.');
  if (labels.length <= 2) return labels.join('.');
  const lastTwo = labels.slice(-2).join('.');
  return SECOND_LEVEL.has(lastTwo) ? labels.slice(-3).join('.') : lastTwo;
}

// How many single-letter edits turn one word into the other.
function edits(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, k) => k);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = keep;
    }
  }
  return row[b.length];
}
// Undo the usual letter swaps: 0 for o, 1 for l, rn for m, vv for w and so on.
const unswap = (w: string) => w.replace(/rn/g, 'm').replace(/vv/g, 'w').replace(/0/g, 'o').replace(/[1!|]/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/4/g, 'a').replace(/-/g, '');

// Which real brand, if any, owns this site; and which one a look-alike is copying.
function brandOf(site: string) {
  if (PUBLIC.some((p) => site === p || site.endsWith(`.${p}`))) return { name: 'the UK government or NHS', key: '' };
  for (const [key, b] of Object.entries(BRANDS)) if (b.sites.includes(site)) return { name: b.name, key };
  return null;
}
function lookalike(name: string, labels: string[]): { key: string; how: 'ending' | 'typo' | 'inside' | 'front' } | null {
  const plain = unswap(name);
  for (const key of Object.keys(BRANDS)) {
    if (name === key) return { key, how: 'ending' };
    if (GENERIC.has(key)) continue;
    if (plain === key) return { key, how: 'typo' };
    const near = key.length >= 8 ? 2 : key.length >= 5 ? 1 : 0;
    if (near && Math.abs(plain.length - key.length) <= near && edits(plain, key) <= near) return { key, how: 'typo' };
    // A brand name plus extra words: amazon-support, paypalsecure. Short names only as a whole word.
    const words = name.split('-');
    if (key.length >= 5 ? plain.includes(key) : words.includes(key)) return { key, how: 'inside' };
  }
  // A brand name stacked in front of a different site: paypal.com.secure-login.top
  for (const l of labels) {
    const key = unswap(l);
    if (key in BRANDS && !GENERIC.has(key)) return { key, how: 'front' };
  }
  return null;
}

export function checkLink(raw: string): Result {
  const input = raw.trim();
  if (!input) return { ok: false, error: 'Paste a link first.' };
  if (input.length > 2000) return { ok: false, error: 'That is too long to be a normal link.' };
  if (/\s/.test(input)) return { ok: false, error: 'A link has no spaces in it. Paste just the link.' };

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(input);
  let url: URL;
  try {
    url = new URL(hasScheme ? input : `https://${input}`);
  } catch {
    return { ok: false, error: "That doesn't look like a web link." };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'That is not a web link (it should start with http or https).' };
  }

  // URL() turns non-Latin letters into "xn--" punycode, so look at the raw text for those too.
  const rawHost = (input.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').split(/[/?#]/)[0] ?? '').replace(/^.*@/, '').split(':')[0] ?? '';
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  const signs: Sign[] = [];
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
  const site = isIp ? host : siteOf(host);
  const tld = host.split('.').pop() ?? '';
  const name = site.split('.')[0] ?? '';

  if (url.protocol === 'http:') signs.push({ id: 'http', text: "It isn't secure (http, not https). Anything you type can be read on the way." });
  if (isIp) signs.push({ id: 'ip', text: 'It goes to a bare number instead of a name. Real companies use their name.' });
  if (url.username || /@/.test(input.split(/[/?#]/).slice(0, 3).join('/'))) {
    signs.push({ id: 'at', text: 'It has an @ in the address. Everything before the @ is ignored, which hides where it really goes.' });
  }
  if (host.includes('xn--') || /[^\x00-\x7f]/.test(rawHost)) {
    signs.push({ id: 'puny', text: 'It uses letters from another alphabet that can look identical to normal ones.' });
  }
  if (SHORTENERS.has(host)) signs.push({ id: 'short', text: "It's a shortened link, so you can't see where it ends up." });
  if (!isIp && RISKY_TLDS.has(tld)) signs.push({ id: 'tld', text: `It ends in .${tld}, an ending scam sites use a lot. Not proof on its own.` });
  if (!isIp && host.split('.').length - site.split('.').length >= 2) {
    signs.push({ id: 'deep', text: 'It has lots of parts before the real name. Scammers stack familiar words there to look official.' });
  }
  const bait = BAIT_WORDS.find((w) => host.includes(w));
  if (bait) signs.push({ id: 'bait', text: `The address itself says "${bait}". Real companies rarely put that in their web address.` });
  if (!isIp && !name.startsWith('xn--') && (name.match(/-/g) ?? []).length >= 2) signs.push({ id: 'hyphen', text: 'The name is several words joined by hyphens, a common way to make a look-alike.' });
  if (!isIp && /[a-z][01][a-z]|[a-z][01]$|^[01][a-z]/.test(name)) {
    signs.push({ id: 'digits', text: 'It mixes numbers into the name, like a 0 for an o or a 1 for an l.' });
  }
  if (input.length > 120) signs.push({ id: 'long', text: 'It is very long, which can push the real address out of sight.' });

  // Is it a real brand's own address, or a copy of one?
  const owner = isIp ? null : brandOf(site);
  if (!isIp && !owner) {
    const front = host.slice(0, Math.max(0, host.length - site.length - 1)).split('.').filter(Boolean);
    const copy = lookalike(name, front);
    if (copy) {
      const b = BRANDS[copy.key];
      const real = b.sites[0];
      signs.push({ id: 'brand', text: {
        ending: `It uses the name ${copy.key}, but ${b.name}'s real address is ${real}. Same name, different website.`,
        typo: `It looks like ${real} with letters changed ("${name}"). A near-copy of a famous name is a classic trick.`,
        inside: `It puts ${b.name}'s name inside a different website. ${b.name}'s real address is ${real}.`,
        front: `It starts with ${copy.key}, but the website it really goes to is ${site}, not ${b.name}.`,
      }[copy.how] });
    }
  }

  const has = (id: string) => signs.some((s) => s.id === id);
  const serious = has('ip') || has('at') || has('puny') || has('brand') || (has('tld') && has('bait'));
  const verdict = signs.length === 0 ? 'clear' : signs.length >= 3 || serious ? 'danger' : 'careful';
  return { ok: true, host, site, signs, verdict, known: owner?.name };
}
