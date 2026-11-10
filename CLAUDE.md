@AGENTS.md

# The Lure

A scroll-down dive through the ocean's real depth zones. At each zone: a real deep-sea animal, the scam that uses the same trick, and an optional spot-the-scam check. For everyday adults. Musa Burke's project; it will get a case study and Journey node on his portfolio (`~/Projects/portfolio`).

**The full, approved plan is `docs/plan.md`. Read it before any work and build inside it. Do not redraw the direction.**

## Stack
Astro 7, TypeScript (strict), plain CSS tokens in `src/styles/global.css`. Three.js only for the plankton and lens wobble, loaded with dynamic `import()`. Cloudflare Pages. Node 22+.

## Content rules
- Every animal fact has a real source (NOAA, MBARI, Natural History Museum), listed on the sources page. Unknown means `TODO(musa): ...`, never a guess.
- Photos are real (NOAA Ocean Exploration, public domain) and credited. No AI images.
- Scam examples use invented brands (ParcelPost, Northway Bank, HM Tax Office). No real company names or logos.
- Every image gets alt text written for that picture.

## Design guardrails
- One sans, one weight (400), sentence case. Tracking tightens as size grows. Headlines two lines or fewer at every width. One `h1`; every section has a heading.
- Ground colour follows real light: sea blue to teal-tinted navy, pure black only in the abyss. Flat steps per zone, no gradient bands.
- One accent, bioluminescent blue-green, rationed to living light, the gauge, progress dots, check feedback and the scam giveaway. Buttons are light pills.
- Glow only as bioluminescence. No shadows, gradients, glass, hairline dividers, monospace labels, eyebrows or 01/02 counters.
- The lens never covers a headline.
- Every heavy effect: reduced-motion path, pause offscreen and when the tab is hidden, a no-JS state where every zone and fact is readable.
- Animate transform and opacity only. Every control has hover, focus-visible and active states.

## Skills
`design-taste-frontend` before UI, `emil-design-eng` for motion, `copywriting` for words, `vibesec-skill` for the link checker and CSP, `find-docs` for Astro/Three.js questions, then `impeccable` and `web-design-guidelines` after each section.

## Look at what you made
After any visual change, screenshot at 1440 and 390 and judge the pictures, two rounds minimum. `npm run build` must pass before calling work done.
