---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: []
---

Scope: single-page shop of Terra (scroll story hero + catalogue + cart + checkout). Mode: Persuade.
Audience: homeware buyers on phone/laptop; portfolio reviewers. Action: browse the collection, add to cart, check out (simulated).
Constraints: React + Vite + Tailwind 4, Three.js hero, CSP, WCAG AA, reduced-motion fallback, demo content labeled.

## Direction contract

THESIS: The page is the workshop's process, played back by the scroll: one handmade vase is thrown, glazed and fired in front of the visitor, then set down on the shelf where the shop begins. It refuses the category default of a product grid under a lifestyle photo with a "Shop now" button.

OWN-WORLD: Warm mineral neutrals (bone #F3F0EA, stone, black ink #1B1A17) with stage grounds that own the whole viewport: raw clay, pale wheel slip, sage glaze, kiln black with ember. Geist (variable grotesque) for headlines and UI at a moderate, Apple-like scale with tight tracking; Instrument Serif italic only for the one poetic word per stage. Pill-free, thin-hairline UI: 1px stone rules, square-cornered inputs, black primary buttons. Matte, never glossy: no gradients on UI, no glass.

STORY: The visitor feels the hand behind each piece (clay → wheel → glaze → 1,240 °C → table), picks a glaze they like, and lands in the catalogue already filtered by it. Then they add to the cart and check out.

FIRST VIEWPORT: Full-viewport clay-colored stage. A 3D lump of clay sits centered on a turning wheel. Left-aligned at about a third of the height: "Terra" wordmark in the header, headline "Todo empieza con un puñado de *barro*.", a one-line subhead, the primary action "Ver la colección" (black), and a quiet scroll cue. The header carries the cart, always visible.

FORM: User-pinned direction (Apple-style scroll product storytelling, elegant), recorded in PRODUCT.md brand commitments; no concept-seed roll, because a pinned direction beats the roll. Signature interaction: the scroll scrubs the vase from lump to finished piece (profile morph, wheel spin, glaze color, kiln glow) while the stage background crossfades, and the glaze chosen in stage 3 pre-filters the catalogue. Motion grammar: scrubbed and continuous, never time-triggered loops. CSS scroll-driven reveals for the sections below. Reduced motion shows the finished vase and stacked stage texts.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
