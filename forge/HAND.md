# with icons — hand-drawn overrides and skeleton redesigns

Most icons are generated: one skeleton (`forge/icons/<name>.json`) runs through 34 style renderers. When a generated
icon reads badly in one style, draw that icon by hand for that style. When the skeleton itself is wrong (the metaphor
misreads, or it is clumsy in line/solid/duo), redesign the skeleton. Read `forge/CONTRACT.md` first; this file adds to it.

## The bar

World-class icon design, the level of the best commercial sets, in **this library's own voice**:
- **Instantly recognisable** at 24px and 16px. One clear silhouette, one idea. If a stranger would name it something
  else (a toaster for an oven, a bean for an egg), it is wrong no matter how pretty it is.
- **Homogeneous with the style.** Your drawing must sit next to that style's other icons as a sibling: same stroke
  weight or outline weight, same corner radii, same light direction, same palette roles and shading recipe, same
  optical size and ink density, same amount of decoration. Never invent a new look; fix the drawing inside the style.
- **Craft.** Snap to the 24 grid (0.5, control points 0.25), keylines from CONTRACT.md, ≥ 2u clearance between strokes,
  smooth curves (no lumps or kinks), balanced negative space, deliberate overlaps, no accidental tangents or slivers.
- **Original.** Draw it yourself. Never copy path data from Lucide, Feather, Heroicons, Tabler, Phosphor, Material,
  Font Awesome or any other set. Familiar metaphors are fine; their coordinates are not.

## A. Hand-drawn override — `forge/hand/<style>/<icon>.mjs`

```js
// forge/hand/pixel/cloud-off.mjs — one sentence on what this drawing is and why it replaces the generated one
export default function render(icon) {
  return [ ['path', { d: 'M...Z', fill: 'var(--with-pixel-fill, currentColor)', class: 'wm-k' }], ... ]
}
```
- `forge/lib/load.mjs` loads every file in `forge/hand/<style>/` and uses it **instead of** the style's renderer for that
  icon (build, packages, site, previews all pick it up). A file that fails to import is skipped; a render that throws
  falls back to the generated drawing. Files starting with `_` are ignored (use them for nothing; keep one file per icon).
- Return an IconNode array exactly like a renderer: `[tag, attrs]`, plus for rich styles one leading
  `['defs', {}, [gradients]]`. The nodes are placed inside the style's `root` attributes (`hand.mjs dump` prints them):
  e.g. `line`'s root already sets `stroke="currentColor" stroke-width="1.75"` and `fill="none"`, so a line path needs no
  paint; `solid`'s root sets `fill="currentColor"`.
- You may `import` read-only helpers to stay on-style: the kernel (`../../kernel/geom.mjs`, `../../kernel/bool.mjs`) and
  the style's own helpers (`../../styles/_<style>-*.mjs`, e.g. palette constants, shading builders, primitives). Never
  edit those files. Hard-coded path data is the norm and is fine.
- Paint rules by style kind (`hand.mjs dump` tells you the kind and the colour variables the style already uses):
  - **mono** (line solid duo gloss engrave blueprint sketch): `currentColor` / `none` only, plus exactly the variables the
    style already uses (duo's accent). No literal colours, no gradients.
  - **palette / role** (kawaii sticker pixel retro, luxe bauhaus skeuo anime gothic pastel coquette plush): every colour is
    `var(--with-<style>-<role>, #hex)` with the roles the style already uses; main ink stays `currentColor` where the style
    does. No defs or gradients: depth from stacked tonal layers and opacity.
  - **rich** (glass clay bento suite dock liquid chrome soft3d brutal utsav rangoli halloween christmas lunar valentine):
    as palette, plus one leading defs node of linear/radial gradients with ids `wg-<style>-<icon>-<n>` and role-variable
    stop colours. Share gradients across shapes.
  - Everywhere: tags `path circle rect line ellipse` only (plus defs/gradients/stop in rich). No `id` outside gradients,
    no `transform` attribute (bake geometry), no `style`, no masks, clips, filters, text, images. Deterministic (no
    `Math.random`, dates or module state). Round to 2 decimals. Size ceilings: mono 8 KB, palette 10 KB, role 14 KB,
    rich 20 KB (target half that).
- **Motion keeps working.** Tag nodes the way the style tags them: body `wm-k` (or untagged), moving/secondary part
  `wm-a`, badge/modifier `wm-s`, sparkles/ornaments `wm-deco`, cast shadow `wm-shadow`, highlight `wm-shine`. If the
  icon's `forge/motion/<icon>.json` animates `parts.A` / `parts.S`, the matching part must carry `wm-a` / `wm-s`, and keep
  the part near the spec's `origin` so the animation pivots in the right place.
- Must read on white **and** on `#0B0B12` (palette and rich styles).

## B. Skeleton redesign — `forge/icons/<name>.json`

Change only `paths`, `fills`, `cutouts` (and `description` if the drawing's subject changed). Keep `name`, `category`,
`aliases`, `synonyms`, `tags`. **Never rename an icon.** Follow CONTRACT.md's skeleton format and geometry rules: plates
K/A/S, fills for the mass, cutouts so Solid keeps the detail, keylines, badges bottom-right. Then:
- Update `forge/motion/<name>.json` if the geometry moved: `origin`s (pivot points on the 24 grid), `parts` (only plates
  that exist), anything that referenced the old shape. Validate: `node forge/tools/check-motion.mjs <name>`.
- Palettes (`forge/palettes/<name>.json`) set colour roles, not geometry; leave them unless a role no longer makes sense.
- Look at the result in **every** style, not just line: the skeleton feeds all 34.

## Verify (both kinds) — the review is looking at the PNG

```bash
node forge/tools/hand.mjs dump <style> <icon>                 # current markup, root, colour variables, motion classes
node forge/tools/hand.mjs check <style> <icon> [icon...]      # contract gate for overrides (must pass)
node forge/tools/check.mjs <icon> [icon...]                   # skeleton lint + every style renders
node forge/tools/preview.mjs --styles <style> --icons <yours>,<4-6 siblings from the same category> --size 96 --small --out .preview/<agent>-x.png
node forge/tools/preview.mjs ... --dark --out .preview/<agent>-x-dark.png
```
Read the PNGs. Compare your icon against its generated siblings in the same style: it must look like it belongs.
Previews go to `.preview/<agent-name>-*.png`, scratch files to `.tmp/`. Never edit files you were not given.
