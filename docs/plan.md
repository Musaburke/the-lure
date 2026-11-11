# The Lure — design plan

## Context
Musa wants a nature-based passion project that is genuinely useful and whose features look good on his portfolio and GitHub. It builds on his Google Cybersecurity Certificate (Nov 2026). The site: scroll down through real ocean depth zones; at each zone a real deep-sea animal, then the scam that uses the same trick, then an optional spot-the-scam check. Earlier decisions are in memory `the-descent-plan.md` (update it: name is now The Lure). New repo, separate from the portfolio.

## Decided
**Product**
- Name: **The Lure** (anglerfish lure = scammer's bait). Repo `~/Projects/the-lure`, public on GitHub, Cloudflare Pages.
- Audience: everyday adults (family, non-tech). Plain words, real scam patterns they meet.
- Free scroll. Checks optional; passing one lights that zone on the depth gauge. Progress stored in `localStorage` only (try/catch, works without it). No accounts.
- v1: 5 zones — Sunlight 0–200 m mimic octopus (impersonation) · Twilight 200–1,000 m hatchetfish (look-alike domains) · Midnight 1,000–4,000 m anglerfish (phishing links) · Midnight siphonophore (botnets) · Abyss 4,000 m+ the ending.
- Ending: score ("You spotted 4 of 5 lures"), "How to never take the bait" checklist, link checker, "Send this to someone" share (Web Share API, copy-link fallback).
- Scam examples use invented look-alike brands (ParcelPost, Northway Bank, HM Tax Office). No real names or logos.
- Every animal fact sourced (NOAA, MBARI, NHM), sources listed on a page.

**Look**
- Ground colour follows real light: sunlit sea blue at the top, darkening per zone through deep navy to pure black by the midnight zone. Each zone is a flat field step (no gradient bands).
- One accent: real bioluminescent blue-green (~470–490 nm, a cyan-teal). Used for creature glow, plankton, the gauge and the scam giveaway highlight; buttons are light pills (see "Taken from the references"). No second accent.
- Glow is allowed here, only as bioluminescence (plankton, lens rim, accent) — the concept, not decoration. No shadows, gradients or glass elsewhere.
- Type: one family, big calm sans in sentence case (General Sans or Satoshi, Fontshare). Huge headlines, readable body at 16px+.
- Images: real NOAA Ocean Exploration photos (public domain), credited in the footer and sources page. No AI images.

**Signature features (each becomes a case-study clip)**
1. Porthole bubble: a soft liquid lens with a slowly wobbling edge, photo inside slightly magnified at the rim. Starts large beside the title, then drifts side to side as it sinks, always opposite the text; photo cross-fades at each zone. Phone: smaller, pinned near the top, facts scroll underneath.
2. Live depth gauge: real depth, pressure, temperature and light level for the scroll position.
3. Plankton cursor: WebGL particles light up near cursor/finger; pauses offscreen and when the tab is hidden.
4. Spot-the-scam check per zone: a realistic fake text/email; tap the giveaway.
5. Link checker: paste a link, see warning signs (look-alike domain, punycode, shortener, odd TLD, IP host). Runs in the browser only, nothing sent.
- Sound: off by default, optional toggle. Underwater ambience that deepens as you sink (NOAA hydrophone recordings or CC0). Never autoplays.

**First screen**
- h1 "The Lure". Under it: "Dive 4,000 metres. Meet the animals that hunt by tricking their prey, and the scams that work the same way." Button "Start the dive". Bubble shows sunlit water.

## Taken from the references
We borrow principles, not their colours, fonts, logos or layouts.

**From Integrated Biosciences**
- One weight for the whole site (400). Hierarchy comes only from size and tracking, with tracking tightening as size grows: about -0.001em at body size, -0.006em at 36–42px, -0.02em at 90–110px, -0.03em at the hero.
- The darks carry the accent's hue. Our deep navies and the near-black carry a faint teal tint instead of being neutral. Pure `#000` is used only in the abyss, mirroring how they keep true black for the very end of the page.
- The accent is rationed. Teal appears only on living light (plankton, the lens rim, creature highlights), the depth-gauge marker, the zone progress dots, check feedback and the scam giveaway highlight. It never fills a large surface or sits behind body text.
- Buttons use the opposite surface: a light pill on the dark water for "Start the dive", not a teal one. (This changes the earlier plan, which put the teal on the main button.)
- Hero composition: headline in the upper left, the promise line in the lower left with generous space between, and the bubble filling the right side.
- Photos are graded so their highlights echo the teal, and they always sit inside the lens, never as loose rectangles.

**From ThoughtLab**
- Two text brightnesses: display type in the brightest white, running text a slightly softer teal-tinted off-white to cut glare on the dark water. Both still pass AA comfortably, and running text stays at 16px or larger.
- An extreme jump in scale between display and body: one huge headline per screen, everything else small and calm.
- One primary action per view, as a full pill. Everything else is plain text links.
- Zero elevation: no card fills, no boxes, no shadows. Facts and checks float directly on the water.
- The liquid WebGL sphere sitting next to the headline is the model for our lens. Under the house rule, the lens may touch the headline's edge but never covers the text.
- The footer is one quiet line: photo credits, sources link, repo link.

**Left out on purpose**
- Monospace labels, 01/02 section counters, hairline dividers and borders, uppercase eyebrows, light sections, lime and crimson, monumental uppercase headlines, 126px side margins.

## Build approach
- Astro + TypeScript (strict), Tailwind 4 or plain CSS tokens. Zone content in `src/data/zones.ts` (animal, facts + sources, scam, check, depth range, ground colour, photo + credit).
- Three.js only for plankton + lens wobble, dynamic `import()`, shared renderer pattern copied from portfolio `src/scripts/three/stage.ts` (pauses offscreen/hidden, still frame on reduced motion).
- Reveal pattern from portfolio `src/scripts/motion.ts`.
- Every heavy effect: reduced-motion path, offscreen pause, no-JS state where all zones and facts are readable.
- Skills while building: `design-taste-frontend`, `emil-design-eng`, `copywriting`, `vibesec-skill` (link checker input, CSP), then `impeccable` and `web-design-guidelines`.
- Afterwards in portfolio: case study (`workflows/add-project.md`) + Journey node (`workflows/add-journey-node.md`).

## Verification
- `npm run check` (astro check + build) 0 errors.
- Screenshots at 1440 and 390 for every zone, two look rounds; `inspect.mjs` 0 FAIL.
- Reduced motion, no-JS and keyboard-only passes; link checker tested against a list of real phishing-pattern URLs and safe URLs.
- Cloudflare preview deploy with CSP enforced and console open.

## Changes made during the build (10 Nov 2026)
- Stage order follows the animals' real depths: mimic octopus 0–75 m, giant siphonophore 75–200 m (Guinness gives its core habitat as about 75–127 m), hatchetfish 200–1,000 m, anglerfish 1,000–4,000 m.
- The lens and plankton use Canvas 2D instead of Three.js. Same effect, no 600 KB dependency.
- Sound is synthesised with Web Audio rather than recorded, so there is nothing to license.
- Photos come from Wikimedia Commons and Flickr (public domain and CC). Only the hatchetfish is a NOAA photo; NOAA had no usable shots of the others. The two studio photos get a deep-water tint in the lens.
- The abyss lens has no photo: it goes dark, with one point of living light.
- UK reporting uses Report Fraud, which replaced Action Fraud in December 2025.

## Round 2 (11 Nov 2026), after Musa tried v1
Inspired by Krillion (krillion.io): you earn depth by answering, a ruler of real landmarks, ambient life. Not copied: its pixel art, boat or monospace type.
- Every stage now tells one story in three beats: the animal's trick, the same trick online, then a "spot the fake" challenge with a plain goal.
- The siphonophore teaches fake crowds (reviews, followers, sales counters) instead of botnets.
- 40-question bank (`src/data/questions.ts`), "Try another" on each stage, and an endless practice dive (`/practice`).
- The lens is real glass now: a WebGL shader with refraction, gloss and highlights that leans, dents and ripples when you touch it.
- Sunlight shafts, creature silhouettes, bubbles and a depth ruler with sourced landmarks (`src/data/landmarks.ts`).
- Lag fixed: layout measured once, no reflow in the scroll handler, plankton glow from a sprite. Measured 60 fps at 4× CPU slowdown.
- Full-resolution photos (2,700 to 3,100 px originals), lens textures at 2,048 px; a 3,000 px CC0 sunlit-water photo for the surface.
- Sound about 9% of its old level, fading in, with a soft chime on right answers.

## Round 4 (11 Nov 2026): grown-up, deeper, harder
Musa: the site feels childish, small and too easy; it must impress an employer, not look like slop. Decided in a grill:
- Tone: same everyday reader, written like a quality news interactive (BBC, NYT), not a quiz.
- Visuals: no cartoon creature silhouettes in the water. Keep the out-of-focus forms, marine snow and light shafts; bubbles near the surface only. The only animals on screen are the real photos.
- Depth: every zone adds "How it plays out" (one realistic scam, step by step, with the moment to stop) and "The real numbers" (one or two sourced UK figures: UK Finance, Ofcom, Report Fraud).
- New zone: the beluga whale (NOC, the Navy beluga that copied human speech), 200–1,000 m band shared with the twilight zone; teaches voice and phone impersonation (bank calls, number spoofing, AI voice clones). Ten normal questions, new `call` card style.
- Story checks: 3 cards. Practice: Normal / Hard switch and a filter by scam type.
- Hard mode: 4 cards, subtle giveaways, and some questions where every card is real ("None of these is fake"). Ten named real-world attacks, two questions each: ClickFix fake CAPTCHA, quishing, invoice redirection, MFA fatigue, WhatsApp takeover, browser-in-the-browser, malvertising, callback phishing, fake recruiter, SIM swap. The result names the attack. New unbranded card styles: browser pop-up, QR sticker, phone notification, search result.
- End: "If you've been scammed" section with sourced UK steps, before the link checker.
- Link preview image (`og:image`).
- Not shipping yet.

## Round 5 (11 Nov 2026): the ThoughtLab float
Musa: the swoop wasn't fluid; he wants the lens to move exactly like the sphere on thoughtlab.com. From his screen recording: one bubble stays on screen the whole page at about the same size, drifts between positions with a lag, and text slides over it. Built: Lenis smooth page scrolling (`src/scripts/smooth.ts`), and the lens follows a scroll-set goal on a critically damped spring (`OMEGA` in `dive.ts`), sinking slightly mid-crossing. Text may pass over it mid-glide; at rest it sits clear.
