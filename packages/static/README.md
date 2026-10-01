# @withicons/static

300 icons x 7 styles as plain SVG: one sprite per style plus standalone files. No JavaScript.

```bash
npm i @withicons/static
```

## Sprite

Serve `node_modules/@withicons/static/dist/sprite-line.svg` from your own origin, then:

```html
<svg width="24" height="24"><use href="sprite-line.svg#with-home"/></svg>
<svg width="24" height="24" style="color:#e11d48"><use href="sprite-solid.svg#with-home"/></svg>
```

- Symbol ids are `with-<name>`. Icons use `currentColor`, so set `color` on the outer `<svg>` (or any parent).
- Browsers block `<use>` of a sprite on another origin, so copy the sprite next to your pages (or inline it in the HTML with `style="display:none"`).
- One sprite per style: `sprite-line.svg` (~100 KB), `sprite-solid.svg` (~340 KB), `sprite-duo.svg` (~163 KB), `sprite-gloss.svg` (~416 KB), `sprite-engrave.svg` (~637 KB), `sprite-blueprint.svg` (~323 KB), `sprite-sketch.svg` (~327 KB).

## Single SVGs (CDN)

```
https://cdn.jsdelivr.net/npm/@withicons/static@0.1.0/dist/svg/<style>/<name>.svg
https://cdn.jsdelivr.net/npm/@withicons/static@0.1.0/dist/svg/line/home.svg
https://cdn.jsdelivr.net/npm/@withicons/static@0.1.0/dist/svg/solid/home.svg
```

```html
<img src="https://cdn.jsdelivr.net/npm/@withicons/static@0.1.0/dist/svg/line/home.svg" width="24" height="24" alt="Home">
```

(An `<img>` cannot inherit `currentColor`; it renders black. Inline the SVG or use the sprite to recolour.)

## Styles

- `line` (universal) — A precise 1.75px outline with round caps and joins. The default for any interface.
- `solid` (universal) — The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap.
- `duo` (universal) — The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo.
- `gloss` (creative) — Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour.
- `engrave` (creative) — Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow.
- `blueprint` (creative) — A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint.
- `sketch` (creative) — Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching.

`dist/icons.json` lists every icon's name, category, description, aliases, tags and styles.

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
