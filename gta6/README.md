# GTA VI — concept landing page

A fan-made concept landing page for *Grand Theft Auto VI*, living at
`/gta6/` alongside the personal site. Plain HTML, CSS and JavaScript — no
build step, no dependencies, no framework.

**Not affiliated with Rockstar Games or Take-Two Interactive.** All artwork in
`img/` is AI-generated for this concept; no official assets, screenshots or
logos are used.

## Preview

```sh
python3 -m http.server 8000
# → http://localhost:8000/gta6/
```

## What's on the page

- **Boot curtain** — a short `Loading Leonida…` intro that lifts itself (and
  hides entirely without JS or with reduced motion).
- **Hero** — full-bleed Vice City art with slow drift + scroll parallax, a
  chromatic-split `VI` wordmark, "out now" status, platform badges and a live
  **"out for"** uptime counter since the 19 Nov 2026 release.
- **Vice City clock** in the nav (UTC−5, updates every 15s).
- **Marquee** of Leonida place names.
- **Story** — Lucia & Jason, with a parallax poster frame.
- **Leonida** — a place grid (Vice City, the Keys, Grassrivers, the coast) whose
  captions open on hover.
- **Features** — four cards for the state, dual protagonists, RAGE, vehicles.
- **Media** — trailer card opening a lightbox player (Play button, or press `T`).
- **Editions** — Standard / Ultimate cards; choosing one raises a toast making
  clear it's a concept.
- **Footer** with a repeated disclaimer.

Behaviour is layered on top of a fully static page: scroll reveal, scroll spy,
sticky nav, pointer glow, mobile sheet menu, modal focus handling, and
`prefers-reduced-motion` support throughout.

## Fact-check

Release date (19 November 2026), platforms (PS5, Xbox Series X|S), setting
(Leonida / Vice City) and the "no PC version announced" note reflect public
reporting as of November 2026. Prices and edition contents are illustrative
only.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | markup |
| `style.css` | neon-noir design system, layout, motion |
| `script.js` | clock, uptime, reveal, spy, modal, toast |
| `img/*.jpg` | generated artwork (hero, poster, city, keys) |
