// Reads a pasted link and lists the warning signs. Runs only in the browser: the link is
// parsed as text, never opened, fetched or sent anywhere.

export type Sign = { id: string; text: string };
export type Result =
  | { ok: false; error: string }
  | { ok: true; host: string; site: string; signs: Sign[]; verdict: 'clear' | 'careful' | 'danger' };

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

  const has = (id: string) => signs.some((s) => s.id === id);
  const serious = has('ip') || has('at') || has('puny') || (has('tld') && has('bait'));
  const verdict = signs.length === 0 ? 'clear' : signs.length >= 3 || serious ? 'danger' : 'careful';
  return { ok: true, host, site, signs, verdict };
}
