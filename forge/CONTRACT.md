# with icons — authoring contract

> ## Run 4 (2026-10-02): 200 new icons, 5 new styles, motion
> - New icons are claimed in `forge/.claims/new-<NN>.json` (`batch`, `icons`). Only the named batch's author creates those skeletons;
>   the author writes `forge/.claims/new-<NN>.done` when finished. Style polishers: never edit a skeleton.
> - Per-icon animation specs live in `forge/motion/<name>.json` — see `forge/MOTION.md`. Motion authors own only their icons' files.
> - New style renderers: `glass`, `kawaii`, `sticker`, `pixel`, `retro` (see the table and **Palette styles** below).

One **skeleton** per icon. Seven **style renderers** turn every skeleton into a finished icon.
500 icons × 12 styles = 6,000 icons, all generated from 500 hand-authored JSON files.

## Styles

| style | kind | owner file |
|---|---|---|
| `line` | universal | `forge/styles/line.mjs` (done) |
| `duo` | universal | `forge/styles/duo.mjs` (done) |
| `solid` | universal | `forge/styles/solid.mjs` |
| `gloss` | creative | `forge/styles/gloss.mjs` |
| `engrave` | creative | `forge/styles/engrave.mjs` |
| `blueprint` | creative | `forge/styles/blueprint.mjs` |
| `sketch` | creative | `forge/styles/sketch.mjs` |
| `glass` | creative | `forge/styles/glass.mjs` — multi-layer frosted glass (glassmorphism) |
| `kawaii` | creative | `forge/styles/kawaii.mjs` — chubby, soft, with a tiny face and blush |
| `sticker` | creative | `forge/styles/sticker.mjs` — Y2K die-cut sticker with puffy border and sparkles |
| `pixel` | creative | `forge/styles/pixel.mjs` — crisp pixel art on a 16×16 grid |
| `retro` | creative | `forge/styles/retro.mjs` — 70s sunset stripes and chunky outline |

| `luxe` | creative | `forge/styles/luxe.mjs` — premium, luxurious, multi-layered 3D |
| `bauhaus` | creative | `forge/styles/bauhaus.mjs` — Bauhaus: primary colours, pure geometry, bold composition |
| `skeuo` | creative | `forge/styles/skeuo.mjs` — skeuomorphic: real materials, depth, light and texture |

| `anime` | creative | `forge/styles/anime.mjs` — anime/cel: crisp ink line, cel-shaded colour, sparkle highlights |
| `gothic` | creative | `forge/styles/gothic.mjs` — gothic architecture: pointed arches, tracery, rose windows, stonework |
| `pastel` | creative | `forge/styles/pastel.mjs` — soft pastel colour fields with gentle tonal depth |
| `coquette` | creative | `forge/styles/coquette.mjs` — bows, pearls, lace, soft pinks (feminine, Gen Z) |
| `plush` | creative | `forge/styles/plush.mjs` — stuffed-toy: felt, stitched seams, buttons, squishy forms (kids) |

Style order everywhere: `line solid duo gloss engrave blueprint sketch glass kawaii sticker pixel retro luxe bauhaus skeuo anime gothic pastel coquette plush`.
The run 11 styles (anime, gothic, pastel, coquette, plush) follow the "Run 7 styles" rules below (role-named variables, no defs,
layered geometry, motion part classes wm-k/wm-a/wm-s/wm-deco/wm-shadow/wm-shine on every node per forge/MOTION.md).

### Run 7 styles (luxe, bauhaus, skeuo)
Palette styles too, with **role-named variables**: `--with-<style>-<role>` where role is one of the palette roles
`ink c1 c2 c3 c4 tint accent shadow shine edge` (e.g. `fill="var(--with-luxe-c1, #1E2A5A)"`), so per-icon palettes and the
editor's colour pickers work automatically (forge/lib/palette-map.mjs). Same ban on defs/ids/gradients/filters/masks: smooth
3D shading and material comes from stacked tonal layers (4–8 inset/offset contours with stepped colour/opacity read as a
smooth ramp at icon sizes), specular shapes and cast shadows built from real geometry. Size: target < 6 KB, ceiling 14 KB.


### Palette styles (glass, kawaii, sticker, pixel, retro)
These five may use a **default palette**, but every colour must be a CSS custom property with a literal fallback,
named `--with-<style>-<role>` (e.g. `fill="var(--with-kawaii-blush, #FF9EB8)"`), and the main ink (outline/body) stays
`currentColor` so `color` still recolours the icon. They must read well on white **and** on `#0B0B12`.
Same ban on `<defs>`, ids, gradients, filters, masks, `<text>`, `<image>`: depth, frost and gloss come from layered
geometry and `fill-opacity`/`opacity`. Per-icon tuning (e.g. where kawaii puts the face) lives in the style's own helper
file (`forge/styles/_<style>-tune.mjs`), never in skeletons. Size: target < 4 KB, ceiling 10 KB per icon.

## Skeleton format — `forge/icons/<name>.json`

```json
{
  "name": "home",
  "category": "navigation",
  "description": "House with a pitched roof and a door",
  "aliases": ["house", "homepage", "main", "start"],
  "tags": ["building", "dashboard", "residence"],
  "paths": [
    { "d": "M2.5 11 L12 3.5 L21.5 11", "plate": "K" },
    { "d": "M5 9.5 V19 A2 2 0 0 0 7 21 H17 A2 2 0 0 0 19 19 V9.5", "plate": "K" },
    { "d": "M9.5 21 V16 A1.5 1.5 0 0 1 11 14.5 H13 A1.5 1.5 0 0 1 14.5 16 V21", "plate": "A" }
  ],
  "fills":   ["M5 9.6 L12 4.1 L19 9.6 V19 A2 2 0 0 1 17 21 H7 A2 2 0 0 1 5 19 Z"],
  "cutouts": ["M9.5 21 V16 A1.5 1.5 0 0 1 11 14.5 H13 A1.5 1.5 0 0 1 14.5 16 V21 Z"]
}
```

- **`name`** must equal the filename and the manifest name. **`category`** comes from `forge/manifest.json`.
- **`aliases`** 3–8 words a developer or AI agent would *guess* instead of the name (`trash` → `delete`, `bin`, `remove`, `garbage`). Seed them from the manifest, improve them. No alias may equal another icon's canonical name.
- **`tags`** 3–8 descriptive search words.
- **`paths`** — the line drawing. Standard SVG path data (`M L H V C S Q T A Z`, absolute or relative). Designed to be stroked at **2u, round caps, round joins**. Each path gets a **plate**:
  - `K` — the primary object / container (house walls, lock body, document outline)
  - `A` — secondary part / payload / moving part (door, shackle, keyhole, magnifier handle, inner detail)
  - `S` — signal / badge / modifier overlay (the `+` in `user-plus`, the slash in `bell-off`, a check badge)
  Split an icon into several paths so plates are meaningful. Close shapes with `Z`.
- **`fills`** — the object's **mass**: closed regions the Solid style fills and Duo/Engrave tint. Usually the silhouette of the K parts. Every subpath must end with `Z`. Holes via even-odd nesting (e.g. a ring = two circles). Omit only for pure-line glyphs (arrows, chevrons, menu, minus, x).
- **`cutouts`** — what the Solid style knocks *out of* the fills so detail survives (the door, the keyhole, a document's text lines, a screen inside a laptop). A closed subpath (`Z`) is knocked out as an area; an open subpath is knocked out as a 1.5u line.

## Geometry rules (these are what make 300 icons look like one family)

- **24 × 24 grid.** All geometry inside the live area **x,y ∈ [2, 22]**. Round forms may touch 2 / 22; square forms usually live in **[3, 21]**.
- **Keylines** — pick the one your silhouette fits: circle Ø20 (centre 12,12), square 18×18 (3→21), landscape 20×16 (2→22, 4→20), portrait 16×20 (4→20, 2→22). Similar concepts use the same keyline.
- **Snap** endpoints and corners to **0.5**. Curve control points may use 0.25.
- **Corners**: rectangles and containers use **radius 2** (radius 1–1.5 for small parts). Use `A` arcs.
- **Clearance**: at least **2u of white** between parallel strokes, i.e. centrelines ≥ 4u apart. Details inside a container sit ≥ 2u from its wall.
- **Density**: 1–6 paths is typical; never more than 4 parallel tracks. Simplify before adding detail.
- **Visual weight**: match the seeds. Compare your icon beside `home`, `search`, `lock`, `settings` in a preview — similar optical size and ink density.
- **Badges** (plate S) sit in the bottom-right quadrant, a ~6–7u circle centred near (17.5, 17.5), and the base icon is trimmed to leave ≥ 1.5u clearance around it.
- **Originality**: draw every icon yourself. Never copy path data from Lucide, Feather, Heroicons, Tabler, Phosphor, Material, Font Awesome or any other set. Familiar metaphors are fine; their coordinates are not.

## Renderer contract — `forge/styles/<name>.mjs`

```js
export default {
  name: 'gloss', title: 'Gloss', kind: 'creative',      // or 'universal'
  description: 'one sentence for the website',
  strokeWidth: false,         // number if a strokeWidth prop is meaningful (live strokes), else false
  root: { fill: 'currentColor' },   // attributes for the <svg> element
  render(icon) { return [['path', { d: '...' }], ...] }   // IconNode array
}
```

`render` receives the prepared icon (see `forge/lib/load.mjs → prepare`):
`icon.paths[] {id, d, plate, subs[{pts, closed}]}`, `icon.lines[] {pts, closed, plate}` (every centreline flattened),
`icon.fills[] {d, subs, set}`, `icon.fillSet` (union of all fills as a region set), `icon.cutouts[] {d, subs}`.

Rules for renderers:
- **Deterministic.** Same input → byte-identical output. For "randomness" use `rng(icon.name + ...)` from the kernel.
- **currentColor first.** Must render correctly as a single `currentColor` on any background, light or dark. Extra colours only through CSS custom properties with a `currentColor` fallback, e.g. `fill="var(--with-accent, currentColor)"`.
- **No** `<mask>`, `<clipPath>`, `<filter>`, `<defs>`, ids, gradients, `<text>`, `<image>`. Only `path` (plus `circle`/`rect`/`line` if you must). Knockouts are real geometry (boolean difference), never background-coloured paint.
- **Small output.** Round to 2 decimals (`fmt`, `polyD`, `setD` in the kernel already do). Simplify polygons (`setD` runs RDP). Target < 3 KB per icon; hard ceiling 8 KB.
- **Must not throw** on any skeleton. Degrade: an icon with no fills, a 1-path icon, a dense icon, a closed ring, a self-crossing path.
- **Fast.** < 150 ms per icon.

Kernel: `forge/kernel/geom.mjs` (parsePath, resample, ribbon, circle, rect, transform, distToPolyline, pointInRing, pointInSet, splitRuns, simplify, rng, polyD, setD, bbox, tangents, arclen) and `forge/kernel/bool.mjs` (normalize, setOf, unionSets, differenceSets, intersectSets, xorSets, solid, strokeSet, roundStrokeSet, dilate, erode, translateSet). Region **sets** are lists of rings with even-odd nesting — always pass whole sets to booleans.

## Tools

```bash
node forge/tools/check.mjs home lock                       # lint + render through every style
node forge/tools/check.mjs --styles line,duo home lock     # only these styles
node forge/tools/preview.mjs --styles line,duo,solid --icons home,lock,heart --size 56 --out .preview/x.png
node forge/tools/preview.mjs --styles gloss --icons all --size 40 --small --out .preview/gloss.png
```

Then **Read the PNG and look at it.** That is the review. `--dark` renders on a dark ground. `--small` adds real 24px and 16px rows.

## Ownership (parallel work — never edit files you do not own)

- Skeleton authors own only their batch's `forge/icons/<name>.json`.
- Style authors own only `forge/styles/<their-style>.mjs` (+ optional `forge/styles/_<their-style>-*.mjs` helpers).
- Packages owner owns `forge/build.mjs`, `forge/lib/emit-*.mjs`, `packages/**`.
- Site owners own their listed files under `site/**`.
- Nobody edits `forge/kernel/**`, `forge/lib/load.mjs`, `forge/tools/**`, `forge/manifest.json`, or this file. If you need a kernel helper, put it in your own file.
- Write previews only under `.preview/<your-agent-name>-*.png`.

## Lead review notes — renderer bugs reported by icon authors (polishers: fix these first)

**solid**
- `F.union(cutNear, F.region([s.pts], 0.3))` (~line 165) caps the far value of the cutNear field at 0.3, so any icon with a closed cutout marks every A part "authored" and skips trimming/carving. Visible: calendar-days vs calendar-plus render their rings differently. Use a reach ≥ 1.0.
- A-part occlusion gap makes the seed `lock` read as an open padlock at small sizes; A parts touching a K stroke float off as dashes (key teeth). Gap must never sever an A part from the K it attaches to.
- tv: plain filled screen while laptop/monitor knock out the screen — check the auto rule.

**gloss**
- Merges every stroke and fill into one mass; parts only separate where cutouts exist → megaphone handle fuses into the box, printer/bug become blobs, QR modules on a diagonal join. Separate A parts from K (a parting gap) by default.
- 2.7u tubes + inner-corner filling: short open S-curves become beans (coffee steam), zigzags get webbed (cloud-lightning), narrow V-notches fill, arrowheads become rounded blobs (history, rotate-ccw). Keep open strokes thinner/shorter-rounded and keep arrowheads crisp.
- At small sizes Gloss is nearly indistinguishable from Solid — the highlight must read clearly at 24–36px (larger/brighter carve).

**engrave**
- Cast-shadow ticks on very short strokes/dots make tadpoles (cloud-snow dots, sun rays, alert-triangle dot) — skip shadow for parts under ~2u.
- Shadow hatching joins diagonally adjacent small shapes (QR modules → beads on a string).
- Hatch fragments in narrow strips (fingerprint, battery ring cutout) — drop fragments shorter than ~0.8u.
- Fill extending beyond its centreline detaches the shade band (second arc appears).

**sketch**
- Small circles (user heads, anchor ring r2.5) become lumpy or teardrop blobs; small dots (drag-handle, more-*) shrink and go irregular — scale jitter amplitude with feature size.
- Hachure inside small lenses (zoom-in/out, search) is muddy at 16px — skip hachure for small fills.

**blueprint**
- 0.5u dot segments render as squares (cloud-snow) — use round caps for dot-length segments.
- **solid**: calendar family — the ring inlay carve merges with the header knockout, leaving a free-floating ink island between the rings; drop islands smaller than ~3x5u or stop the carve short of an adjacent cutout.
- **line/preview**: tiny closed circles (r ≤ 1) under a 1.75 stroke render as rings with a speck — authors used short dashes instead; fine.
- **aliases (QA)**: qr-code lists `barcode` (a canonical name) — remove; run a collision check across all icons.

## Names, aliases and synonyms (search vocabulary) — added 2026-10-01

- `aliases` (3–15): strong alternative NAMES a person or AI would type instead of the canonical name
  (`trash` → `delete`, `bin`, `garbage`, `remove`, `rubbish`). Used by `resolve()` in every package:
  an alias that maps to exactly one icon resolves; one shared by several icons is ambiguous and errors with candidates.
  Never equal to another icon's canonical name.
- `synonyms` (0–40): broader SEARCH vocabulary — related words, actions, use cases, objects, moods, UK/US spellings,
  plurals, common misspellings, short phrases a non-technical user would type ("throw away", "recycle bin", "discard").
  Used only for ranking search results, never for resolve(). Lowercase, singular-or-natural form, no duplicates of aliases.
- Total `aliases + synonyms` is 10–50 per icon, scaled to how broadly the icon is used
  (a common icon like `trash`, `home`, `user`, `search`, `settings` gets 35–50; a niche one like `git-merge` ~12–20).
