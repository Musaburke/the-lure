// The link checker's form and result. Output is built with textContent only.
import { checkLink } from './linkcheck';

export function mountLinkChecker(form: HTMLFormElement, out: HTMLElement) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector<HTMLInputElement>('input')!;
    const res = checkLink(input.value);
    out.replaceChildren();
    out.dataset.verdict = res.ok ? res.verdict : 'error';
    const p = (text: string, cls?: string) => { const el = document.createElement('p'); el.textContent = text; if (cls) el.className = cls; out.append(el); return el; };
    if (!res.ok) { p(res.error, 'lc-verdict'); return; }
    p(res.verdict === 'clear' && res.known
      ? `This is ${res.known}'s real address.`
      : { clear: 'No warning signs found.', careful: 'Be careful with this one.', danger: "Don't open this link." }[res.verdict], 'lc-verdict');
    const where = document.createElement('p');
    where.className = 'lc-where';
    const b = document.createElement('strong');
    b.textContent = res.site;
    where.append('It really goes to ', b, '.');
    out.append(where);
    if (res.signs.length) {
      const ul = document.createElement('ul');
      for (const s of res.signs) { const li = document.createElement('li'); li.textContent = s.text; ul.append(li); }
      out.append(ul);
    }
    p(res.verdict === 'clear'
      ? res.known
        ? "Even so, if a message sent you this link, go to the website or app yourself rather than tapping it."
        : "This checker spots known tricks; it can't promise a website is safe. If a message sent you here, go to the company's website yourself instead."
      : "If a message sent you this, delete it. To check, go to the company's website or app yourself.", 'lc-note');
  });
}
