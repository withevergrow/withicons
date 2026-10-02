# Contributing to with icons

Thanks for helping! with icons is 500 icons x 12 styles, all generated from one hand-drawn skeleton
per icon, plus an optional animation spec per icon. Most contributions are one of these:

| you want to... | do this |
|---|---|
| request an icon | open an [icon request](https://github.com/withevergrow/withicons/issues/new?template=icon-request.yml) |
| make search find an icon | open an [alias suggestion](https://github.com/withevergrow/withicons/issues/new?template=alias-request.yml) or edit `aliases`/`synonyms` in `forge/icons/<name>.json` |
| draw a new icon | add `forge/icons/<name>.json` (see below) |
| fix how an icon looks | edit its skeleton; never hand-edit generated SVGs |
| animate an icon | add or edit `forge/motion/<name>.json` (see [`forge/MOTION.md`](forge/MOTION.md)), then `node forge/tools/check-motion.mjs <name>` |
| fix a package or the site | see "Code" below |

## Setup

```bash
git clone https://github.com/withevergrow/withicons && cd withicons
npm ci                       # Node 22+
node forge/build.mjs         # renders every icon x style, emits packages/*/dist and site data
node forge/tools/check.mjs   # lint every skeleton + render through every style
npm test --workspaces --if-present
```

Open `site/index.html` directly in a browser, or `node forge/tools/serve.mjs`.

## Drawing an icon

Read [`forge/CONTRACT.md`](forge/CONTRACT.md) (grid, keylines, plates, fills, cutouts) and
[`forge/PARTS.md`](forge/PARTS.md) first. The short version:

- 24 x 24 grid, live area 2..22, endpoints snapped to 0.5, stroked at 2u with round caps and joins.
- `paths` carry a plate: `K` main object, `A` secondary part, `S` badge/modifier.
- `fills` give the solid mass, `cutouts` keep detail in the Solid style.
- `aliases`: the words people (and AI agents) would guess instead of the name. No alias may be another icon's name.
- **Draw it yourself.** Never copy coordinates from Lucide, Feather, Heroicons, Tabler, Phosphor, Material,
  Font Awesome or any other set. PRs with traced or copied paths are closed.

Check it in every style and at small sizes, then look at the PNG:

```bash
node forge/tools/check.mjs my-icon
node forge/tools/preview.mjs --icons my-icon,home,search --size 56 --small --out .preview/my-icon.png
node forge/tools/preview.mjs --icons my-icon --dark --out .preview/my-icon-dark.png
```

Attach the preview PNG to your pull request. Check the palette styles on a dark background too (`--dark`).

## Code

- `forge/styles/*.mjs`: style renderers. They must be deterministic, must not throw on any skeleton, and must
  paint with `currentColor` only; the palette styles (glass, kawaii, sticker, pixel, retro) may add colours, but only as
  `var(--with-<style>-<role>, #hex)` (see CONTRACT.md).
- `forge/motion/*.json` + `forge/MOTION.md`: per-icon animation specs (closed preset vocabulary), packaged as `@withicons/motion`.
- `forge/lib/emit-*.mjs`: one emitter per package. `packages/*/dist` is generated, so do not edit or commit it.
- `site/`: the zero-build website (vanilla HTML/CSS/JS). Generated pages come from `forge/tools/site-seo.mjs`.
- `infra/`, `scripts/`, `.github/`: deployment and release (maintainers).

Keep pull requests focused: one icon, one fix, or one feature. Run the build, `check.mjs` and the tests
before pushing; CI runs the same commands.

## Commit and PR style

- Short imperative subject: `Add shopping-bag icon`, `Fix solid knockout for lock`.
- Describe what changed visually and include before/after previews for drawing or style changes.
- User-facing changes get a line in `CHANGELOG.md` under "Unreleased".

## Licensing

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE)
and that it is your own original work.

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Be kind.
