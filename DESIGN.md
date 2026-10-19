---
name: Terra
description: Cerámica torneada a mano en Sevilla. A scroll-played workshop process that ends on the shop shelf.
colors:
  ink: "#1b1a17"
  ink-hover: "#34312c"
  ink-soft: "#4f4a44"
  bone: "#f3f0ea"
  paper: "#fbfaf7"
  stone: "#a7a196"
  line: "#d9d3c8"
  kiln: "#16110e"
  clay: "#9b6a4d"
  sage: "#6f7f62"
  error: "#9b3b2a"
  stage-clay: "#decbba"
  stage-slip: "#e8e1d6"
  stage-glaze: "#cfd6c6"
  glaze-hueso: "#e7e1d4"
  glaze-piedra: "#a7a196"
  glaze-salvia: "#8d9d7f"
  glaze-arcilla: "#b27a56"
  glaze-carbon: "#2f2c29"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
    fontFeature: "\"ss01\", \"cv11\""
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline-section:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  accent:
    fontFamily: "Instrument Serif, ui-serif, Georgia, serif"
    fontWeight: 400
    letterSpacing: "0"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    letterSpacing: "-0.025em"
  body-lead:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.556
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
rounded:
  field: "0.6rem"
  panel: "0.75rem"
  card: "1rem"
  media: "1.25rem"
  pill: "999px"
spacing:
  gutter: "1.25rem"
  gutter-sm: "2.5rem"
  section: "6rem"
  section-lg: "8rem"
  container: "80rem"
  control-height: "2.875rem"
  target: "2.75rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1.4rem"
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1.4rem"
    height: "{spacing.control-height}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.6rem 0.85rem"
    height: "{spacing.control-height}"
  chip:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.5rem"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
  product-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
  modal:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.media}"
    width: "min(60rem, calc(100vw - 2rem))"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "min(28rem, 100vw)"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
---

# Design System: Terra

## Overview

**Creative North Star: "The Workshop Played Back"**

Terra is a ceramics workshop's process, run forward by the scroll. One handmade vase is thrown, glazed and fired in front of the visitor on a sticky Three.js stage, while each phase of the process owns the whole viewport with its own solid ground: raw clay, pale wheel slip, sage glaze, kiln black with ember, and finally the bone-colored table where the shop begins. Below the story, the shop is calm, Apple-like UI: warm mineral neutrals, black pill buttons, hairline rules and generous air.

The system is matte, never glossy. Color comes from the material world (clay, stone, sage, glaze, fire) and is kept restrained; the type scale is moderate and tightly tracked, with one Instrument Serif italic accent per headline carrying the poetic word. Motion is scrubbed and continuous: the scroll drives it, nothing loops on a timer, and everything reads fully when motion is reduced or WebGL is missing.

**Key Characteristics:**
- Full-viewport stage grounds per story phase, joined by a short 6svh feathered seam.
- Warm mineral neutrals with black ink as the only strong UI color.
- Geist Variable, semibold and tightly tracked, with one serif italic accent per headline.
- Pills for every action and choice; softly rounded fields; 1px hairline rules.
- Scroll-scrubbed 3D vase and CSS scroll-driven reveals, all with static fallbacks.

## Colors

A restrained, earth-mineral palette: bone and paper grounds, black ink, stone and hairline neutrals, with clay, sage and kiln living in the story's stage grounds and the 3D piece rather than in the UI.

### Primary
- **Workshop Ink** (ink): primary buttons, selected chips, toasts, the footer ground, focus outlines, text selection. Its hover is **Warm Charcoal** (ink-hover). Ink at 5% is the quiet hover wash for icon buttons and nav links; ink at 10–15% is the ring on swatches and the cart pill.

### Secondary
- **Wet Clay** (clay): the raw-clay color of the unthrown vase in the 3D scene and the text caret. Not a UI fill.
- **Kiln Black** (kiln): the firing stage ground, under two ember radials (deep `rgb(150 58 18 / 0.55)` and bright `rgb(232 120 48 / 0.35)`, anchored low right on desktop, centered on mobile).

### Tertiary
- **Stage grounds**: Raw Clay (stage-clay) for the first viewport, Wheel Slip (stage-slip) for throwing, Sage Glaze (stage-glaze) for glazing, then kiln, then bone.
- **Glazes** (glaze-hueso, glaze-piedra, glaze-salvia, glaze-arcilla, glaze-carbon): the five product glazes. The same values tint the 3D vase and fill the round swatches; always shown with their text name.

### Neutral
- **Bone** (bone): page background, story table stage, inset info panels (cart free-shipping note, checkout summary).
- **Paper** (paper): raised surfaces: the workshop section, product card wells, fields, the cart sheet and modals, the cart pill.
- **Soft Ink** (ink-soft): secondary copy, subheads, metadata. Holds at least 5.5:1 on every light stage ground.
- **Stone** (stone): hover rings on chips and fields, scrollbar thumb. Never body text (2.3:1 on bone).
- **Hairline** (line): 1px rules, dividers, resting chip and field borders, the solid header's bottom edge.
- **Fired Red** (error): invalid field border and error message text.
- **Sage** (sage): defined in the theme as the palette's sage, but the shipped UI does not use it; the sage stage uses stage-glaze.

### Named Rules
**The Ground Owns the Viewport Rule.** Each story phase is one solid ground filling the whole screen at rest. Blending happens only in a 6svh seam straddling the boundary (3svh above, 3svh below), so contrast is decided per panel and holds without JavaScript.

**The Matte Rule.** UI surfaces are flat fills: no gradients on buttons, cards, fields or dialogs, no glass, no gloss. The kiln's ember radials are a stage ground, part of the world's fire, and are the one sanctioned gradient.

**The Glaze Is Data Rule.** Glaze colors come from the catalogue and are shared by the 3D vase and the swatches; a glaze is never shown as color alone, always with its name.

## Typography

**Display Font:** Geist Variable (with ui-sans-serif, system-ui)
**Accent Font:** Instrument Serif italic 400 (with ui-serif, Georgia)

**Character:** A crisp variable grotesque set semibold and tight, like product copy, warmed by a single hand-drawn serif italic word that carries the poetry of each step.

### Hierarchy
- **Display** (600, clamp(2.5rem, 6vw, 4.75rem), 1.02, -0.035em): the first-viewport headline only.
- **Headline** (600, clamp(2rem, 4.6vw, 3.5rem), 1.05, -0.03em): story stage headlines. Section headlines (taller, colección) step down to clamp(2rem, 4.4vw, 3.25rem).
- **Title** (600, 1.875rem, -0.025em): product name in the product dialog. Dialog and sheet headers use 1.125rem semibold.
- **Body lead** (400, 1.125rem): stage subheads and section intros, capped at 30–46ch.
- **Body** (400, 1rem, 1.5): product descriptions and general copy.
- **Control** (500, 0.9375rem, -0.005em): buttons and chips.
- **Label** (500 or 400, 0.875rem): field labels, legends, metadata, footer copy.

Body runs with `font-feature-settings: "ss01", "cv11"`. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`. Prices, counts and quantities use tabular numerals. The wordmark is lowercase "terra", semibold, -0.03em.

### Named Rules
**The One Poetic Word Rule.** Every h1 and h2 headline carries exactly one Instrument Serif italic accent (an `em`, weight 400, no tracking): one word, or at most a two-word noun phrase. Never two accents in a headline, never the serif in body or UI.

**The Moderate Scale Rule.** Nothing exceeds 4.75rem. Size is not the drama; the stage grounds and the vase are.

## Layout

Single page: a sticky full-viewport 3D layer sits over five stage panels (`min-height: 100svh`), followed by the workshop section, the catalogue, a service strip and the footer. Content is contained to 80rem with 1.25rem gutters (2.5rem from 640px). Sections breathe at 6rem vertical padding, 8rem from 1024px.

Story panels: on desktop (from 64rem) the copy column (max 36rem) sits left, vertically centered, with the vase offset right; below 64rem the vase rises and shrinks to the top half (zoom 0.55) and copy sits at the bottom (top padding 52svh, bottom 9svh). The workshop section uses a 12-column grid with staggered image figures. The catalogue grid is 2 columns, 3 from 1024px, 4 from 1280px, with 1rem–1.5rem column gaps and 2.5rem row gaps. Filters sit between two hairlines in a legend/chips two-column grid from 768px.

Touch targets are at least 2.75rem (44px); buttons and fields are 2.875rem tall.

## Elevation & Depth

Flat by default; depth comes from tonal layering (bone page, paper surfaces, bone inset panels) and from the real 3D scene. Shadows are rare, soft and functional, never decorative.

### Shadow Vocabulary
- **Header hairline** (`box-shadow: 0 1px 0 var(--color-line)`): the solid header's bottom edge once the story is passed.
- **Float** (`box-shadow: 0 2px 10px rgb(27 26 23 / 0.12)`): the round add-to-cart button sitting on a product photo.
- **Toast** (`box-shadow: 0 8px 24px rgb(27 26 23 / 0.2)`): the floating confirmation pill.
- **Ghost ring** (`box-shadow: inset 0 0 0 1px currentColor`): the ghost button's outline, which follows text color on any ground.
- **Dialog backdrop** (`rgb(27 26 23 / 0.45)`): behind the cart sheet and modals.

### Named Rules
**The Tonal Lift Rule.** Raise a surface by moving it from bone to paper, not by adding a shadow. Shadows are reserved for elements that float over imagery or the page (add button, toast).

## Shapes

Soft and rounded, never sharp. Every action and choice is a full pill (999px): buttons, chips, the stepper, the cart pill, icon buttons, toasts. Fields are gently rounded (0.6rem); inset panels and shipping options 0.75rem; product cards and summary asides 1rem; photographs and modals 1.25rem. Swatches are circles with a 1px inset ink/15 ring. Borders are 1px hairlines in the line color, drawn as rings on pills. Icons are custom inline SVG, 24px grid, 1.5px round-capped stroke, in currentColor.

## Components

### Buttons
Tactile, quiet pills.
- **Shape:** full pill (999px), 2.875rem tall, 1.4rem side padding, 0.5rem gap to an 18px icon.
- **Primary:** ink fill, bone text; the one black action per view ("Ver la colección", "Añadir al carrito", "Tramitar pedido").
- **Hover / Active:** primary darkens to ink-hover over 180ms; every button presses to scale(0.98) on the expo ease. Disabled is 45% opacity.
- **Ghost:** transparent with a 1px inset currentColor ring, 6% ink wash on hover. Used for secondary steps ("Atrás", "Ver piezas en…").
- **Text:** the bare pill without fill or ring, soft ink turning ink on hover, for the scroll cue.
- **Icon buttons:** 2.75rem circles, ink/5 wash on hover (close, stepper); the add-to-cart circle is paper/90 with the float shadow and turns ink on hover.

### Chips
- **Style:** pill, 2.5rem tall (2.75rem in the product dialog and glaze picker), 1px hairline ring, control type. Glaze chips lead with a round swatch.
- **State:** hover ring to stone; selected fills ink with bone text and an ink ring. Built on visually hidden native radios, with the focus outline drawn on the chip. The story glaze picker sits on paper/70 with an ink/10 ring.

### Cards / Containers
- **Corner Style:** 1rem for product cards and summary asides; 0.75rem for inset panels.
- **Background:** product images sit in a paper well; info panels use bone on paper.
- **Shadow Strategy:** none at rest (see Elevation).
- **Border:** none on cards; ring-1 line on notices and shipping options, which take a 2px ink ring when checked.
- **Product card:** 4:5 photo, slow 700ms scale to 1.03 on hover, name in medium weight, glaze swatch plus name, tabular price.

### Inputs / Fields
- **Style:** paper fill, 1px hairline border, 0.6rem radius, 2.875rem tall, 0.6rem 0.85rem padding, inherited type. Selects use the same field.
- **Hover / Focus:** border to stone on hover; focus shows a 2px ink outline at 1px offset and an ink border.
- **Error:** `aria-invalid` turns the border fired red, with a 0.875rem fired-red message 0.35rem below, linked by `aria-describedby`.

### Navigation
- **Header:** fixed, 3.5rem tall, transparent over the story; lowercase semibold "terra" wordmark left; text links (0.875rem, pill hover wash ink/5, hidden below 640px) and a paper cart pill with bag icon and tabular count right.
- **States:** `chrome-solid` gives the header a bone ground and hairline once the story is scrolled past; `chrome-dark` flips header text to bone (the cart pill keeps ink text) while the kiln ground, including its seams, is under the header. Focus outlines turn bone on dark grounds (`on-dark`).

### Dialogs
Both are native `<dialog>` with focus trap, Escape and backdrop-click close.
- **Cart sheet:** right-anchored paper drawer, full dynamic height, min(28rem, 100vw), hairline-divided header, list and footer; slides in 2rem from the right over 420ms on the expo ease.
- **Modal:** centered paper panel, 1.25rem radius, min(60rem, 100vw − 2rem); rises 1rem from scale 0.985 over 380ms. Hosts the product sheet (two-column photo/detail from 768px) and the checkout, whose step bar is three 4px pill segments (ink done, line pending).

### Stage Story (signature)
A sticky full-viewport WebGL canvas (pointer-events none, aria-hidden) above five stage panels. A lathe-turned vase is scrubbed by scroll progress: a hand-kneaded lump (noise fading out by 30% of the throw) morphs into walls and then a bellied, necked vase; the wheel spins with the scroll, fast while throwing and slower after; throwing-line bump texture fades under the glaze; the raw clay color lerps to the chosen glaze; the wheel drops away; an orange emissive kiln glow rises and falls around the kiln stage; and the vase settles onto a pale stone plinth before the shop. Materials are matte (roughness 0.8–0.92, no metalness on the vase) under warm key, cool rim and hemisphere light with ACES tone mapping and a soft canvas contact shadow. Rendering happens only on scroll, only while visible.

### Motion
- **Ease:** `--ease-out-expo` (cubic-bezier(0.16, 1, 0.3, 1)) for presses and dialog entrances.
- **Reveal:** sections and catalogue items rise 2.5rem from transparent across `entry 5% → cover 28%` of a CSS view timeline.
- **Reveal image:** photographs open from an inset clip (12% / 8%, 1.25rem round) and settle from scale 1.08 across `entry 0% → cover 40%`.
- **Panel copy:** each stage's copy fades out as it nears the header (desktop) or the vase (mobile) via a view timeline, so it never sits half-covered.
- **Reduced motion:** the vase renders finished and still; reveals and dialog animations are off; smooth scrolling is off; without view-timeline support, content is simply visible. Without WebGL, a static vase photograph replaces the canvas.

## Do's and Don'ts

### Do:
- **Do** give each story phase one solid ground that fills the viewport, feathered into the next only through the 6svh seam.
- **Do** use ink for the single primary action in a view, as a pill 2.875rem tall.
- **Do** put exactly one Instrument Serif italic word (or short noun phrase) in each headline.
- **Do** raise surfaces by moving from bone to paper, and divide with 1px hairlines.
- **Do** drive motion from scroll position, and ship a finished, still, fully readable state for reduced motion and no WebGL.
- **Do** show every glaze with its name next to the swatch.
- **Do** use tabular numerals for prices, counts and quantities.

### Don't:
- **Don't** put gradients, glass or gloss on UI surfaces; the kiln ember radial belongs to the stage ground only.
- **Don't** set headlines above 4.75rem or use loud, clashing color; the palette stays earth, stone, sage, warm neutrals and black.
- **Don't** use the serif italic in body copy, UI or more than once per headline.
- **Don't** use stone for text; it is a ring and hover color only.
- **Don't** run time-triggered looping animation; motion is scrubbed by the scroll.
- **Don't** use square corners on actions or choices; they are pills.
