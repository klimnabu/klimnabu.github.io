# klimnabu.github.io

Personal landing page, served by GitHub Pages at <https://klimnabu.github.io>.

Static site: plain HTML, CSS and JavaScript. No build step required.

## Local preview

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Structure

- `index.html` - markup
- `style.css` - styling
- `script.js` - scroll reveal + footer year

## Deploying

Deploys automatically: every push to `main` updates the live site (GitHub Pages, branch `main`, root `/`).
