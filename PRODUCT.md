# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + Vite 8 + Tailwind CSS 4 (same versions as the author's portfolio), Three.js for the 3D hero piece. Static SPA on the Vercel free plan. Self-hosted fonts, no third-party scripts at runtime.

## Users

People who buy handmade homeware online, browsing on a phone or a laptop and comparing pieces before buying. The real audience is recruiters and clients viewing Mario Guerra's portfolio, who should see both motion craft and real shop logic.

## Product Purpose

Online shop for «Terra», a fictitious ceramics workshop in Sevilla making modern handmade tableware and vases with matte glazes in earth, stone and sage tones. Success: the visitor understands within seconds that every piece is thrown by hand, enjoys the scroll story, then filters the catalogue, adds to the cart and completes a simulated checkout.

## Positioning

Each piece is thrown on the wheel, glazed and fired at 1,240 °C in the workshop. The scroll story shows that process on a real 3D piece.

## Capabilities and Constraints

- Scroll story at the top: a 3D vase is thrown from a lump of clay, glazed and fired as the visitor scrolls, and the background changes with each stage. It must fall back to a static, readable version under prefers-reduced-motion or without WebGL.
- Catalogue with filters (category, glaze, price order) kept in the URL.
- Product detail with glaze variants and quantity.
- Cart drawer persisted in localStorage (wrapped in try/catch). Prices in cents.
- Three-step checkout (details → shipping → summary) with full validation. Payment is SIMULATED: no card fields of any kind, a visible demo notice, and nothing is sent anywhere.
- Strict CSP via Vercel headers, WCAG 2.2 AA, Lighthouse 100 in a11y, best practices and SEO.
- Zero cost.

## Brand Commitments

- Fictitious brand with a visible "Proyecto de demostración" notice. No impersonation of any real business.
- Interface copy in Spanish.
- User-pinned direction (2026-10-19): Apple-style scroll storytelling (backgrounds that change while scrolling, pieces that move and appear), modern and elegant.
- The user dislikes oversized headlines and loud, clashing colors. Keep the palette restrained (earth, stone, sage, warm neutrals and black) and the type scale moderate.

## Evidence on Hand

- Photos: free Unsplash images, credited in the footer.
- No real reviews, customers, press or stock figures exist. Products and prices are demo content; no invented testimonials, ratings or "bestseller" claims.

## Product Principles

- The process is the story: clay, wheel, glaze, kiln, table.
- Motion serves understanding, never blocks content or the shop.
- The shop works fully on its own, even when every animation is turned off.
- Honest demo: everything simulated says so.

## Accessibility & Inclusion

WCAG 2.2 AA. Respect prefers-reduced-motion with full content. Every control is reachable by keyboard; the cart and product dialogs trap focus natively (`<dialog>`). Glaze variants carry text names, not just swatches.
