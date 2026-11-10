// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLink, siteOf } from '../src/scripts/linkcheck.ts';

const verdict = (u: string) => { const r = checkLink(u); return r.ok ? r.verdict : 'error'; };

test('real addresses come back clear', () => {
  assert.equal(verdict('https://www.gov.uk/claim-tax-refund'), 'clear');
  assert.equal(verdict('parcelpost.co.uk/track'), 'clear');
});

test('the real site is the name before the ending', () => {
  assert.equal(siteOf('www.gov.uk'), 'gov.uk');
  assert.equal(siteOf('track.parcelpost.co.uk'), 'parcelpost.co.uk');
  assert.equal(siteOf('northwaybank.co.uk.secure-login.top'), 'secure-login.top');
});

test('scam patterns are flagged', () => {
  assert.equal(verdict('https://northwaybank.co.uk.secure-login.top/verify'), 'danger');
  assert.equal(verdict('http://192.168.4.20/login'), 'danger');
  assert.equal(verdict('https://user@evil.com'), 'danger');
  assert.equal(verdict('https://раураl.com'), 'danger'); // Cyrillic look-alike letters
  assert.equal(verdict('https://hm-tax-refund.claim-now.xyz'), 'danger');
  assert.equal(verdict('bit.ly/3xYz'), 'careful');
  assert.equal(verdict('https://www.goog1e.com'), 'careful');
});

test('things that are not web links are refused', () => {
  assert.equal(verdict('javascript:alert(1)'), 'error');
  assert.equal(verdict('not a link'), 'error');
  assert.equal(verdict(''), 'error');
});
