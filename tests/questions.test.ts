// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, type Scam } from '../src/data/questions.ts';

const text = (c: { from: string; meta?: string; subject?: string; body: string[] }) => [c.from, c.meta ?? '', c.subject ?? '', ...c.body].join(' ');

test('every question has one fake, and its giveaway is on that card', () => {
  for (const q of questions) {
    const fakes = q.cards.filter((c) => c.fake);
    assert.equal(fakes.length, 1, `${q.id}: expected exactly one fake`);
    assert.ok(fakes[0].tell, `${q.id}: fake card needs a tell`);
    assert.ok(text(fakes[0]).includes(fakes[0].tell!), `${q.id}: tell not found on the fake card`);
    assert.ok(q.cards.length >= 2 && q.cards.length <= 4, `${q.id}: 2 to 4 cards`);
    for (const c of q.cards) if (!c.fake) assert.ok(c.real, `${q.id}: real card needs a reason`);
  }
});

test('ten questions per scam, ids unique', () => {
  const count: Record<string, number> = {};
  for (const q of questions) count[q.scam] = (count[q.scam] ?? 0) + 1;
  for (const s of ['disguise', 'crowd', 'lookalike', 'bait'] as Scam[]) assert.equal(count[s], 10, s);
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
});

test('no real brands in the examples', () => {
  const real = /\b(hmrc|royal mail|evri|dpd|barclays|lloyds|natwest|hsbc|santander|amazon|paypal|netflix|apple|microsoft|google|tesco|sainsbury|vodafone|o2|ee\b|tv licensing|british gas|octopus energy)\b/i;
  for (const q of questions) for (const c of q.cards) assert.ok(!real.test(text(c)), `${q.id}: real brand in "${text(c)}"`);
});

test('phone numbers come from the ranges Ofcom reserves for drama', () => {
  for (const q of questions) for (const c of q.cards) {
    for (const n of text(c).match(/(?:\+44 ?|\b0)\d{2,4}(?: ?\d){6,8}\b/g) ?? []) {
      assert.match(n.replace(/\s/g, ''), /^(07700900\d{3}|\+447700900\d{3}|02079460\d{3})$/, `${q.id}: ${n}`);
    }
  }
});
