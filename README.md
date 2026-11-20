# klimnabu.github.io

Personal site, served by GitHub Pages at <https://klimnabu.github.io>.

Static site: plain HTML, CSS and JavaScript. No build step, no dependencies.

## Local preview

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Structure

- `index.html` — markup: hero, work, stack, approach, contact
- `style.css` — design tokens, layout, responsive rules, motion
- `script.js` — progressive enhancements (see below)
- `logo.svg` / `og.png` — brand mark and social card

## Behaviour

Everything on the page works without JavaScript; `script.js` only adds polish:

- scroll reveal (`IntersectionObserver`, disabled for `prefers-reduced-motion`)
- sticky nav state, reading progress bar, scroll-spy active link
- pointer spotlight, subtle card tilt (pointer devices only)
- mobile menu toggle
- copy-to-clipboard for the contact address

## Deploying

Deploys automatically: every push to `main` updates the live site
(GitHub Pages, branch `main`, root `/`).
