# The Lure

A scroll-down dive through the ocean's real depth zones. At each depth you meet a deep-sea animal that survives by tricking others, then the online scam that uses the same trick, then a quick "spot the lure" check. It's written for everyday adults: the people most likely to get a scam text and least likely to read a security guide.

| Depth | Animal | The trick | The scam |
| --- | --- | --- | --- |
| 0–75 m | Mimic octopus | Disguises itself as more dangerous animals | Impersonation |
| 75–200 m | Giant siphonophore | Many small bodies acting as one | Botnets |
| 200–1,000 m | Hatchetfish | Glows to erase its own shadow | Look-alike web addresses |
| 1,000–4,000 m | Deep-sea anglerfish | A glowing lure in total darkness | Phishing |
| 4,000 m+ | The bottom | | A checklist, a link checker, where to report |

## What's interesting in the code

- **The lens** (`src/scripts/lens.ts`): a canvas "porthole" with a slowly wobbling edge and a glowing rim. It drifts to whichever side the text isn't on, and cross-fades to the next animal. Between stages it shrinks in place, crosses only while it fits in the gap between texts, then grows on the new side, so it never covers a paragraph. A scroll-through test checks this at three screen sizes.
- **The water** (`src/scripts/dive.ts`): the page colour follows real light, from sunlit blue to pure black, using one flat colour at a time.
- **The depth gauge** (`src/scripts/ocean.ts`): live depth, pressure, temperature and sunlight for the scroll position, from NOAA figures.
- **Glowing plankton** (`src/scripts/plankton.ts`): specks light up near your cursor or finger, like real bioluminescent plankton.
- **The link checker** (`src/scripts/linkcheck.ts`): paste a link and see the warning signs: look-alike letters (punycode), shorteners, bare IP addresses, `@` tricks, stacked subdomains and bait words. It shows which website the link *really* goes to. It runs entirely in the browser and never opens or fetches the link. Tested in `tests/linkcheck.test.ts`.
- **Sound** (`src/scripts/sound.ts`): optional underwater ambience made live with the Web Audio API (no audio files). It gets deeper and quieter as you sink. Off by default.

Every effect has a reduced-motion version, pauses when the tab is hidden, and has a no-JavaScript fallback where every fact, photo and answer is still there. The site ships with a strict Content Security Policy (`public/_headers`): no inline scripts and no third-party code.

## Facts and photos

Every animal fact links to its source on `/sources` (NOAA, MBARI, Guinness World Records, university research). The photos are public domain or Creative Commons, credited there. Scam brands in the examples (ParcelPost, Northway Bank, HM Tax Office) are invented.

## Run it

Needs Node 22+.

```sh
npm install
npm run dev      # http://localhost:4321
npm test         # link checker tests
npm run check    # type check + production build
```

Built with Astro 7 and TypeScript. Hosted on Cloudflare Pages.
