# @withicons/classes-plus

CSS icon classes for the 7 newer with icons styles (`clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `brutal`), for all 734 icons.
A companion of [`@withicons/classes`](https://www.npmjs.com/package/@withicons/classes): its loader (`with-loader.js`) and
runtime (`with-icons.js`) find these styles by themselves, so a page needs nothing extra:

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>
<i class="with with-home with-clay"></i>
```

They live in their own package because jsDelivr serves at most 150 MB per package. Without the loader:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes-plus@latest/dist/with-base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes-plus@latest/dist/clay/home.css">
```

With a bundler: `npm i @withicons/classes-plus`, then `import '@withicons/classes-plus/with-clay.css'` (or `with-base.css` + `clay/home.css` per icon).

| file | contents |
|---|---|
| `dist/with-<style>.css` | every icon of one style (base rules included) |
| `dist/<style>/<name>.css` | one icon's rule (what the loader links) |
| `dist/with-base.css`, `dist/with-all.css` | the base rules; an @import of every style here |

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
