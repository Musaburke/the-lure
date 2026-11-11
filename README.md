# The Lure

A scroll-down dive through the ocean's real depth zones. At each depth you meet a deep-sea animal that survives by tricking others, then the online scam that uses the same trick, then a "spot the fake" challenge. A separate **practice dive** turns it into a game: every fake you spot takes you 100 metres deeper, past real landmarks, all the way to the Challenger Deep. It's written for everyday adults: the people most likely to get a scam text and least likely to read a security guide.

| Depth | Animal | The trick | The scam |
| --- | --- | --- | --- |
| 0–75 m | Mimic octopus | Disguises itself as more dangerous animals | Impersonation |
| 75–200 m | Giant siphonophore | Many small bodies posing as one animal | Fake crowds: reviews, followers, sales counts |
| 200–1,000 m | Hatchetfish | Glows to erase its own shadow | Look-alike web addresses |
| 1,000–4,000 m | Deep-sea anglerfish | A glowing lure in total darkness | Phishing |
| 4,000 m+ | The bottom | | A checklist, a link checker, where to report |

## What's interesting in the code

- **The glass lens** (`src/scripts/glass.ts`): one WebGL fragment shader. The photo refracts through a wobbling liquid lens, with a colour split at the edge, a fresnel rim, moving highlights and a bioluminescent glow. It leans towards the cursor, dents where you hover and ripples like jelly when tapped. It drifts to whichever side the text isn't on and never covers a paragraph (`tools/overlap.cjs` checks this at three screen sizes). Falls back to a 2D canvas lens without WebGL.
- **Spot the fake** (`src/scripts/challenge.ts`, `src/data/questions.ts`): 40 questions, ten per scam, as realistic texts, emails, shop listings, links and profiles. Tap the fake and its giveaway lights up with a one-line reason. Tests check every question has exactly one fake, that its giveaway is really on the card, that no real brand appears, and that every phone number comes from Ofcom's ranges reserved for fiction.
- **The practice dive** (`src/pages/practice.astro`): endless, no timer. Right answers sink you past a ruler of sourced landmarks (deepest scuba dive, the Titanic, the Challenger Deep); your deepest dive is remembered in your browser.
- **The living water** (`src/scripts/water.ts`): sunlight shafts that fade out by 200 m, huge out-of-focus forms with glowing rims that take over as the light goes, fish, jellies, sperm whales and lanternfish drifting past at the depths they live, glowing plankton that lights up near your pointer, and bubbles when you scroll or get one right. Glow comes from a pre-drawn sprite, so it stays at 60 fps even at 4× CPU slowdown (`tools/perf.cjs`).
- **The depth ruler** (`src/data/landmarks.ts`): ticks and landmarks placed in the page itself, so it scrolls for free.
- **The water** (`src/scripts/dive.ts`): the page colour follows real light, from sunlit blue to pure black, using one flat colour at a time.
- **The depth gauge** (`src/scripts/ocean.ts`): live depth, pressure, temperature and sunlight for the scroll position, from NOAA figures.
- **The link checker** (`src/scripts/linkcheck.ts`): paste a link and see the warning signs: look-alike letters (punycode), shorteners, bare IP addresses, `@` tricks, stacked subdomains and bait words. It shows which website the link *really* goes to. It runs entirely in the browser and never opens or fetches the link. Tested in `tests/linkcheck.test.ts`.
- **Sound** (`src/scripts/sound.ts`): optional, quiet underwater ambience made live with the Web Audio API (no audio files). It fades in, gets deeper and quieter as you sink, and chimes softly on a right answer. Off by default.

Every effect has a reduced-motion version, pauses when the tab is hidden, and has a no-JavaScript fallback where every fact, photo and answer is still there. The site ships with a strict Content Security Policy (`public/_headers`): no inline scripts and no third-party code.

## Facts and photos

Every animal fact links to its source on `/sources` (NOAA, MBARI, Guinness World Records, university research). The photos are public domain or Creative Commons, credited there. Scam brands in the examples (ParcelPost, Northway Bank, HM Tax Office) are invented.

## Run it

Needs Node 22+.

```sh
npm install
npm run dev      # http://localhost:4321
npm test         # link checker and question bank tests
npm run check    # type check + production build
```

Built with Astro 7 and TypeScript. Hosted on Cloudflare Pages.
