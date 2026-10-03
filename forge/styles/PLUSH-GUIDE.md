# Plush: the design system for redrawers

This guide is for the agents who hand-draw Plush icons in `_plush-redraw-1..5.mjs`.
The engine is **frozen**: `plush.mjs`, `_plush-field.mjs`, `_plush-prim.mjs`, `_plush-kit.mjs`,
`_plush-compose.mjs`, `_plush-auto.mjs`, `_plush-tune.mjs`, `_plush-render.mjs`, `_plush-redraws.mjs`
and `_plush-exemplars.mjs` belong to the art director. Build with what is listed here. If something
is missing, ask instead of drawing around it.

Previews (gitignored; regenerate with the commands in section 9):
- `.preview/plush-ad-ex1.png` / `-ex1-dark.png`: the 20 exemplars at 130px, with true 24 and 16px renders
- `.preview/plush-ad-auto-1..5.png` (+ `-dark`): all 500 icons through the automatic path. This is your baseline.
- `.preview/plush-ad-live1.png`: Live icons, which always use the automatic path.

## 1. What world class means here

A Plush icon is a **stuffed toy you could pick up**. A child should want to hug it, and a designer
should still read it at 16px.

1. **Fabric, not plastic.** Every object is sewn from felt panels. Each panel is puffy: dark piping
   all round, a seam pinch just inside the edge, a soft shade on the lower right, a fleece highlight on
   the upper left, and a running stitch. The compose step paints all of this for you. You only
   choose the panels.
2. **Inflated silhouettes.** Corners are round (radius 1.5u or more on bodies), bars are fat tubes
   (2.4-3.4u), and nothing is spiky. Acute tips (stars, arrowheads, roofs) take a fillet of 1-1.5u.
   Oversize the shape a little to make up for what the fillet takes.
3. **Few panels, big ones.** Use 2-5 felt panels. Every panel is a real sewn piece: a roof, a door, a
   lid, a flap. Don't make a panel smaller than about 3x3u. Below that, use a knot, a button or a
   thread.
4. **Fabric details are the charm.** Sewn-on buttons, French knots, embroidered lines, a heart patch,
   a little label. Pick **one or two** per icon (see the ornament budget in section 5).
5. **Faces are rare.** This is not kawaii. An embroidered `smile` only goes on objects that are
   characters already (an animal, a bot, a smiley, a baby). Never put one on a house, a lock or a file.
6. **Silhouette first.** Fill the icon with a single colour. You should still recognise it at 16px. If
   you can't, fix the shapes before you add any detail.

## 2. Grid and measures (24 x 24 grid, raw coordinates, no transform)

| measure | value |
|---|---|
| body live area | 3..21 (piping adds 0.62u outside; the ground shadow adds 0.3 right and 0.75 down) |
| body corner radius | 2-3u (`rr`), pills for rims and lids |
| tube (stuffed bar) | 2.4-3.4u (`tube`, `seg`, `bar`); arrows and checks 3.4u |
| thin tube (steam, handles, loops) | 1.5-2u, `stitch: false`, `out: 0.5` |
| embroidery thread | 1.0-1.2u (lines), 0.4-0.6u (fine cross-stitch, window panes) |
| French knot | r 0.55-0.8 |
| button | r 1.25-1.75 (small), 3-3.5 (hub, focal) |
| gap between panels of one colour | at least 1u, or they fuse |
| moat (`moat`) around a badge or slash | 0.9-1.1u |
| polygon fillets | tips 1-1.5u, inner (concave) 0.6-0.9u (`poly(pts, [r1, r2, ...])`) |

## 3. The panel recipe (automatic: `_plush-compose.mjs`)

Each `felt` piece is painted as:

| layer | geometry | paint |
|---|---|---|
| ground | union of all object panels grown by the piping, moved (0.3, 0.75) | `shadow` 16%, class `wm-shadow` |
| piping | panel grown 0.62u (`out`) | `ink` |
| base | the panel | its felt role |
| pinch | 0.5u band just inside the edge | `shadow` 13% |
| shade | panel minus itself moved up-left (0.85-1.5u, scaled by depth) | `shadow` 17% |
| highlight | inset panel minus itself moved down-right (scaled by depth) | `shine` 34%, class `wm-shine` on K |
| stitch | running stitch 0.95u inside the edge (or along `seam`) | light thread `edge` on dark felt, `ink` at 50% on light felt (`c2 tint accent`) |

Per-piece options (pass them in the `felt`/`tube` options object):
`stitch: false | 'seam'`, `seam: [[x,y]...][]`, `inset`, `stitchMin` (inscribed radius below which
no loop is sewn, default 1.55), `out` (piping width), `line: false` (no piping), `shade: false`,
`pinch: false`, `hi: false`, `shadeOp`, `hiOp`, `threadRole`, `threadOp`, `ground: false`, `part`.

Small panels drop the layers they can't hold (no stitch under r 1.55, no highlight under r 1.05).
That's on purpose. **Don't** force stitches onto small parts.

## 4. Colour

| role | default | use |
|---|---|---|
| `c1` | tomato #F4695E | roofs, hearts, mugs, arrows, alerts |
| `c2` | sunflower #FFC53D | walls, bells, stars, locks, folders, buttons |
| `c3` | sky #4C9FE6 | bodies of devices, files, gears, doors, shackles |
| `c4` | mint #4FBF8A | checks, bins, nature, success |
| `accent` | bubblegum #FF8DB4 | heart patches, seals, sweet details |
| `tint` | cream #FFF0D9 | envelopes, pages, clouds, windows, patches |
| `ink` | plum #4A2C3D | piping, embroidery, knots, keyholes (fixed, not currentColor) |
| `shadow` | #3A1E46 | fabric shading only, always at low opacity |
| `shine` | #FFFFFF | highlights, glints |
| `edge` | #FFF9F0 | light stitching thread, embroidered text on dark felt |

- **2-3 felts per icon**, plus ink. One dominant body felt, one contrasting part, and an optional
  patch or detail felt.
- **Neighbours contrast.** A panel sits on a panel of a *different* felt (sunflower walls under a
  tomato roof). Cream next to sunflower is weak, so keep a tomato or sky panel between them.
- **Family colours stay the same:** files are a sky sheet with a cream flap, folders a tomato back
  with a sunflower front, calendars a cream page with a tomato header and sky loops, people a
  sunflower head over sky shoulders, locks a sky shackle on a sunflower body, arrows tomato, checks mint.
- **Dark mode:** the plum piping melts into the dark page, and that is intended. The felt colours
  carry the shape. Never rely on `ink` alone for a part that sits on the page, not on felt. Steam,
  sparkles and motion lines are thin `tint` tubes (`tube('tint', pts, 1.7, { stitch: false, out: 0.5 })`),
  not threads.

## 5. Ornament budget

At most **two** of these per icon, and none when the object is already busy:

- `button` (four holes from r 1.5; two below). Use it for hubs, snaps, chest buttons and centres.
- `knot` (French knot). Use it for door knobs, dots, days and eyes.
- `heartPatch` / a small `felt('accent', P.heart(x, y, 0.25-0.45))`. Use it for seals and favourite days.
- `thread` (embroidery). Use it for text lines, ribs, glints and keyholes.
- `tag` (a little label sewn into a seam). Use it **only** where it reads at 24px (len 3 or more).
- `cross` (cross-stitch X). Use it for windows and markers.
- `smile`. Use it only for characters (see section 1.5).

Decorations that lie wholly off the object (steam, sparkles, a tag) must be marked `part: 'deco'`.
They then float on their own loop instead of playing the object's motion.

## 6. Motion tagging (forge/MOTION.md, Parts choreography)

Every piece takes `part: 'K' | 'A' | 'S' | 'deco'`. Compose writes the classes for you:

- `K` is the body. `A` is the moving or secondary part: a shackle, a door, a clapper, a lid, a hub
  button. `S` is a badge or modifier: a plus badge, a slash, a seal. `deco` is a decoration off the object.
- Plates are tagged `wm-k` / `wm-a` / `wm-s` only when the icon has more than one plate. The ground
  is always `wm-shadow`. K highlights are `wm-shine`.
- If you leave `part` out, compose measures the piece against the skeleton: on an A line it
  becomes A, wholly off the object it becomes deco. **Always pass `part` explicitly.** It is cheaper
  and never wrong.
- Keep moving parts as their own pieces (the bell's clapper, the lock's shackle). Then check with
  `preview-motion` that the right part moves.

## 7. Exemplars (`_plush-exemplars.mjs`)

These override the same names in the redraw chunks, so don't redefine them. Copy their construction
for the rest of each family.

| family | icon | construction |
|---|---|---|
| buildings | home | sunflower walls `rr`, tomato roof slab `poly` (5 points, fillets), sky door with a knot knob, cream window with thread panes |
| hearts | heart | `felt('c1', heart())`, nothing added |
| bells, alerts | bell | tomato top loop `tube`, sky clapper ball (A, behind), sunflower dome, tomato rim pill |
| mail | mail | cream envelope, tomato flap `poly` (A), accent heart seal (S) |
| search, zoom | search | sunflower handle tube (A, behind), sky glass, tomato `ring`, `shine` glint thread |
| settings, cogs | settings | sky gear (`around` pills + disc, filleted), sunflower hub `button` r 3.4 (A) |
| users | user | `person(12, 2.75)` + a small cream chest button |
| stars, ratings | star | sunflower `poly(starPts(...), [1.3, 0.9])` + tomato button |
| calendars | calendar | `calendar('tint','c1','c3')` + knot days + one accent heart day |
| cameras, media | camera | sky body with filleted hump, sunflower lens ring, sky lens, shine knot, tomato shutter (A) |
| weather | cloud | `felt('tint', cloud())`, nothing added |
| files | file | `page('c3','tint')` + `textLines` in light thread |
| folders | folder | `folder('c1','c2')` + sky snap `button` |
| security | lock | sky shackle `arcTube` + legs (A, behind), sunflower body, accent heart with an ink keyhole |
| music | music-note | sky stem and flag (one filleted panel, A), tomato head ellipse rotated -20 |
| transport, space | rocket | built upright, then `rot(…, 45)`: sunflower flame, tomato fins, cream body, tomato nose, sky porthole |
| food, drink | coffee | tomato handle `arcTube` (A, behind), tomato mug, accent heart, cream steam tubes (deco) |
| actions | trash | sky lid handle, mint bin with two `edge` thread ribs, sky lid pill (A) |
| arrows | arrow-right | `arrow(3.75,12,20.75,12,{len:7.5,half:6.5,w:3.4,r:1.6})`: one panel, seam on the shaft |
| checks | check | `tube('c4', [[4.5,12.5],[9.5,17.5],[19.5,6.5]], 3.4)` |

## 8. Writing a redraw

Each chunk exports `R`: icon name -> `(icon, P) => pieces`. The pieces are painted bottom to top.
`P` holds everything in `_plush-prim.mjs` and `_plush-kit.mjs`, plus:

- `P.auto()`: this icon's automatic pieces. Start from them and add details when the automatic
  shape is already right.
- `P.scheme`: `{ main, part, patch, badge }`, the felt roles the automatic path picked.
- `P.icon`: the prepared skeleton (read only).

**Shapes** (`_plush-prim.mjs`) are signed-distance fields:

- Discs and boxes: `circle`, `ellipse`, `ring`, `dot`, `rr(x0,y0,x1,y1,r|[tl,tr,br,bl])`, `rect`, `pill`.
- Bars: `seg(ax,ay,bx,by,w)`, `bar(pts,w,closed)`, `arc(cx,cy,r,a0,a1,w)` (degrees, 0 = east,
  90 = south), `arcPts(...)`.
- Polygons: `poly(pts, r|[r...])` with real tangent fillets, `starPts`/`star`, `ngon`.
- Organic shapes: `sector`, `segment`, `half`, `lens`, `drop`, `heart(cx,cy,k)`, `cloud(cx,cy,k)`.
- From SVG: `path(d)` (closed, even-odd) and `stroke(d,w)` (any path as a tube).
- Booleans: `unite(...)`, `cut(a, ...b)`, `clip(a, b)`.
- Offsets: `grow(f, d)`, `shrink(f, d)`, `round(f, r)` (convex corners), `fillet(f, r)` (concave
  corners: use it to merge parts into one soft body), `puff(f, r)` (both).
- Transforms: `move`, `rot(f, deg, cx, cy)`, `scale`, `flipX`, `flipY`, `around(f, n, cx, cy)`.
- Polylines (for seams and threads): `linesOf(d)`, `pt(cx, cy, r, deg)`.

**Pieces** (`_plush-kit.mjs`):

- Panels and tubes: `felt(role, F, o)`, `tube(role, pts, w, o)`, `arcTube(...)`, `flat(role, F, o)`.
- Embroidery: `thread(lines | d, { w, role, op, part })`, `knot(x, y, r, role)`, `cross`, `smile`.
- Gaps: `moat(F, gap)`.
- Details: `button(x, y, r, role, o)`, `patch`, `heartPatch`, `tag(x, y, role, { deg, len, wid })`.
- Badges and glyphs: `badge(kind, role, cx, cy, r)` with kind plus, minus, x, check, bang, dot, up,
  down or null; `glyph`; `slash()`.
- Arrows and chevrons: `arrow(x0, y0, x1, y1, { len, half, w, r, rb, role })`, `chevron(x, y, deg, arm, o)`, `chevPts`.
- Families: `page(role, flapRole, x0, y0, x1, y1, fold)`, `textLines(x0, x1|[...], ys)`,
  `folder(back, front)`, `person(cx, top, k, head, body)`, `calendar(page, band, ring)`.

Example: a `file-plus`, built from the family part plus a badge.

```js
'file-plus': (icon, P) => [
  ...P.page('c3', 'tint'),
  P.textLines(8.25, [15.75, 13], [11.75, 14.75], { part: 'K' }),
  ...P.badge('plus', 'c4', 17.25, 17.75, 4.25),   // moat + mint disc + light-thread plus, all part S
],
```

Example: start from the automatic pieces and add one detail.

```js
'battery': (icon, P) => [...P.auto(), P.knot(7.5, 12, 0.7, 'edge', { part: 'deco' })],
```

Rules:

- **Return pieces, never nodes.** Compose does the piping, shading, stitching and classes.
- **Never edit skeletons, the engine or another chunk.** For an icon-specific tweak of the automatic
  path (`main`, `scheme`, `tw`, `ink`, `drop`), ask the art director to add it to `TUNE`.
- A redraw that throws falls back to the automatic path silently. Run with `PLUSH_DEBUG=1` to see
  the error.
- **Size and speed:** each felt panel costs about 1-1.5 KB and about 8 ms. Keep an icon under 8 KB
  (ceiling 16 KB) and under 150 ms, so 6 panels or fewer plus details.

### What to redraw, and what to leave automatic

Redraw in priority order:

1. Icons whose automatic version is a **blob** or **mush**: dense line art, overlapping tubes,
   faces, animals, vehicles, tools, food, `qr-code`, `fingerprint`, `audio-lines` and `wifi`.
2. Every **family member**, built from the family part (all `file-*`, `folder-*`, `user-*`,
   `calendar-*`, `mail-*`, `lock`/`unlock`, `shield-*`, `cloud-*`), so a family reads as one set of toys.
3. Popular icons that deserve the fabric details: hubs as buttons, doors with knots and so on.

You can leave automatic the simple glyphs that already read as stuffed tubes: arrows, chevrons, plus,
minus, x, the `circle-*` and `square-*` buttons, align/list/menu bars, and simple geometry. Do check
each one on the contact sheet first.

## 9. Checklist per icon

1. The silhouette reads in one colour at 16px, and the meaning matches `line`.
2. Use 2-3 felts. Neighbouring panels contrast, and nothing important is ink-on-page only.
3. Shapes are round and inflated: no spikes, and tubes are 2.4u or wider.
4. Details stay within the ornament budget. No face, unless the object is a character.
5. Every piece has a `part`. Decorations are `deco`, and moving parts are separate pieces.
6. Check light and `--dark` at 72, 24 and 16px.

```bash
node forge/tools/preview.mjs --styles plush,line --icons a,b --size 72 --small --out .preview/<you>-x.png
node forge/tools/preview.mjs --styles plush --icons a,b --size 72 --small --dark --out .preview/<you>-x-dark.png
node forge/tools/check.mjs --styles plush a b
node forge/tools/preview-motion.mjs a,b --styles plush --frames 7
PLUSH_DEBUG=1 node forge/tools/check.mjs --styles plush a b   # surface errors in your redraw
```
