# Pastel: the design system for redrawers

This guide is for the agents who hand-compose Pastel icons in `_pastel-redraw-1..5.mjs`.
The renderer, paint/lighting model, compose, primitives and kit are **frozen**:
`pastel.mjs`, `_pastel-render.mjs`, `_pastel-paint.mjs`, `_pastel-compose.mjs`, `_pastel-auto.mjs`,
`_pastel-prim.mjs`, `_pastel-kit.mjs`, `_pastel-field.mjs`, `_pastel-path.mjs`, `_pastel-tune.mjs`, `_pastel-redraws.mjs`.
Build with what is listed here. If something is missing, ask the art director. Don't draw around the gap.

Previews (gitignored, regenerate with the commands in §9):
- `.preview/pastel-ad-exemplars.png` / `-exemplars-dark.png`: the 20 exemplars at 72, 24 and 16px
- `.preview/pastel-ad-px24.png`: exemplars at real 24px, pixels blown up 4x, light over dark
- `.preview/pastel-ad-all-1..5.png` / `-all-N-dark.png`: all 500 as rendered today (exemplars plus the automatic path). This is your baseline.

## 1. What world class means here

Pastel is **calm, airy and premium**, closer to a Notion cover or a Dribbble shot than a cartoon.
A great Pastel icon:

1. **Is made of 2-4 soft, layered shapes.** Each shape is one pastel hue. The object is built by
   stacking them (a roof over walls, a flap over an envelope, a hub on a gear). It is never an outline.
2. **Is soft everywhere.** Generous radii (containers r 3-3.5), round caps, rounded polygon corners
   (compose softens what's left by 0.6u). Nothing pointy except a deliberate star tip.
3. **Gets its light from the renderer.** Every field automatically gets a deeper rim in its own hue,
   a soft lighter top plane, a gentle deeper bottom plane, a faint cast shadow, and one glint per
   icon. **Never paint highlights or shadows by hand**, except an explicit `shine` (§4) on glass.
4. **Is low contrast but legible.** Key details (keyholes, text lines, ribs, dots) print in **ink**, a
   mid-tone of the field's own hue. Check that each icon reads at 24px on white and on dark.
5. **Has no faces, no die-cut border and no black.** Kawaii, sticker and duo are other styles.
6. **Reads in silhouette first.** Fill the whole icon with one hue. You should still recognise it.

## 2. Grid and measures

| measure | value |
|---|---|
| canvas | 24 x 24, live area 2..22 |
| container corner radius | 3-3.5 (`rr`), sheet 2.5-2.75, small parts 1.25-1.75 |
| soft bar (a field used as a stroke: shackle, handle, steam, stem) | 2.5-2.75 (`seg2`, `arc`, `stroke`) |
| line glyph (arrow, chevron, check) | 3-3.5, one hue, one field (`arrow`, `chevron`, `check`) |
| ink detail | 1.5-1.75 (`W.INK` 1.6); fine ink 1.35 |
| ink dot | r 1.1-1.6 |
| moat around a badge or slash | 1.2 (`W.MOAT`, built into `badgeLayers` / `slashLayers`) |
| badge | disc r 4.5-4.75 centred near (17.5, 17.5) |
| rim (automatic) | 0.8 stroke, half inside and half outside the field |

A field under ~1.2u thick gets no planes, and one under ~2.9u gets no top plane. Thin parts
automatically become plain rimmed shapes. Don't fight this: use `.flat` on purpose for small parts.

## 3. Colour

Six pastel hues plus paper. Pick by **meaning** (a heart is blush, a leaf mint, a star butter, a
cloud sky). When the meaning gives no hue, use lavender as the calm default. `_pastel-tune.mjs` shows
how the automatic path chooses.

| hue | base | deep (rim, bottom plane) | ink | use |
|---|---|---|---|---|
| `lavender` | #CDBBF7 | #9E87E6 | #6A55B8 | UI, tech, people, arrows. The default. |
| `peach` | #FFCBAF | #F09F7C | #B4613D | warmth, food, home, commerce, skin |
| `mint` | #ABE6CD | #6EC8A4 | #2F8865 | nature, success, money, health |
| `sky` | #B7D6FA | #7DAEEA | #3F70B2 | weather, water, media, files, devices |
| `butter` | #FFE29C | #EDBD52 | #A07222 | light, stars, folders, awards, notes |
| `blush` | #FFC3D7 | #F08FB3 | #B54A76 | love, gifts, alerts, removal |
| `paper` | #FFFFFF | #CFC4EC | #6A55B8 | flaps, bezels, dial faces, folds (light inner surfaces) |

**Roles.** The paint layer maps hues to the palette roles for you, in order of first appearance:
the first hue becomes `c1` (the main colour), then `c2`, `c3` and `c4`, and a fifth becomes `accent`.
`paper` maps to `tint`. Rims use `edge`, planes and the cast shadow use `shadow`, details use `ink`,
the glint uses `shine`. Every role's fallback is hue-matched, so **paint the main body first** so it
becomes c1.

Rules:
- **2-3 hues per icon** (4 at most, paper not counted). One dominant field.
- **Never place a field on the same hue** unless a clear rim separates them. Neighbouring parts take
  different hues, or `paper`.
- **Ink only goes on a field.** A detail that sits on the page is a pastel field (`'lavender.flat'`), not ink.
- **Keep family colours.** Use the colours the exemplars set for each family (§7). Modifiers say what they mean:
  plus and check badges are mint, minus, x, off and alert are blush, lock and shield are lavender,
  info, time and help are sky.

## 4. API: writing a redraw

Each chunk exports `R`, which maps an icon name to `(icon, p) => layers`:

```js
// _pastel-redraw-2.mjs
export const R = {
  'cloud-rain': (icon, p) => [
    ['sky', p.cloud(12, 10.5, 0.95)],
    ['lavender.flat@A', p.seg2(8, 17, 7, 20, 2), p.seg2(12, 17, 11, 20, 2), p.seg2(16, 17, 15, 20, 2)],
  ],
  'folder-plus': (icon, p) => {
    const f = p.folder()
    return [['peach', f.back], ['butter', f.front], ...p.badgeLayers('plus', 'mint')]
  },
}
```

**Layers** are `[key, shape, shape, ...]`, painted in order with later layers on top. Keys:

| key | what it paints |
|---|---|
| `'hue'` | a lit soft field: base, hue rim, bottom plane, top plane (and the icon's one glint) |
| `'hue.flat'` | base and rim only: small parts, thin bars, steam, seals |
| `'hue.well'` | a recessed inlay with a soft shade under its top edge: screens, windows, doorways, glass |
| `'ink'` | mid-tone detail. It takes the ink of the field under it. |
| `'shine'` | an explicit glint (on glass or a lens). The automatic glint is then skipped. |
| `'shade'` / `'shade.hue'` | a translucent shadow tone over what's below (a fold's shadow, a gap) |
| `'cut'` | knocks these shapes out of **every layer before it**: moats, holes, gaps (real geometry) |
| `…@K` `@A` `@S` `@deco` | forces the motion part. Otherwise compose reads it from the skeleton (§6). |

`icon` is the prepared skeleton (`icon.paths`, `icon.fills`, `icon.lines`). Use it to match the meaning,
never to copy its outlines. If a redraw throws or returns nothing, the automatic composer renders the icon.
Live icons (`icon.params`) always use the automatic composer unless a chunk deliberately registers one by name.

**`p`: primitives** (`_pastel-prim.mjs`):
- Discs: `circle ellipse ring sector segment half quarter`, `arc(cx,cy,r,a0,a1,w)` (round caps; 0° is east, angles run clockwise), `arcEnds`
- Bars: `seg2(ax,ay,bx,by,w)`, `bar(pts,w)`, `stroke(d,w)` (any path data as a round-capped band)
- Rects and polygons: `rr(x0,y0,x1,y1,r|[tl,tr,br,bl])`, `pill`, `arch(…,dir)`, `poly(pts, r|[r…])`, `tri`, `lens`, `cap`, `drop`, `path(d)`, `pathEO(d)`
- Point helpers: `star(cx,cy,ro,ri,n)` and `ngon` return points for `poly`
- Transforms: `move rot flipX flipY scale around join`
- Booleans: `cut clip unite`

**`p`: kit** (`_pastel-kit.mjs`):
- Weights: `W` = `{ BAR 2.75, GLYPH 3, INK 1.6, INK_FINE 1.35, MOAT 1.2, R 3 }`
- Containers:
  - `box(x0,y0,x1,y1,r=3)`, `disc(cx,cy,r)`
  - `page(...)` returns `{sheet, fold}`
  - `folder(...)` returns `{back, front}`
  - `calendar(...)` returns `{body, head, rings}`
  - `bubble(x0,y0,x1,y1,side)`
- Forms:
  - `cloud(cx,cy,s)`, `heart(cx,cy,s)`
  - `person(cx,top,s)` returns `{head, body}`
  - `star5(cx,cy,ro,ri,r)`, `gear(cx,cy,ro,rb,n,tw)`
  - `sparkle(cx,cy,r)`: decoration only
- Glyphs (one field):
  - `arrow(x0,y0,x1,y1,{w,head,spread})`, `arcArrow(cx,cy,r,a0,a1,{w,head})`
  - `chevron(x,y,deg,arm,w)`, `check(pts,w)`
- Details:
  - `glyph(kind,cx,cy,s,w)`: kinds are plus, minus, x, check, bang, dot, up and down
  - `lines(x0,x1|[…],ys,w)`: ink text lines
  - `steam(x,y,h,w)`
- Modifiers (these return **layers**, so spread them in last):
  - `badgeLayers(kind, hue, cx, cy, r)`
  - `slashLayers(hue, a, b, w)`

## 5. Composition rules

- **Paint order:** body first, then the parts that sit over it, then inlays and ink, then modifiers.
  The first hue painted becomes c1.
- **Layer, don't outline.** An envelope is a sky body plus a paper flap, not a sky outline with a V.
  A door is a `well` in the wall, not an ink rectangle.
- **The ornament budget is 0-1 decoration per icon:** a sparkle beside a heart, a tiny star by a moon.
  It has to lie **wholly off** the object, so it's tagged `wm-deco` and casts no shadow. No confetti,
  no backdrop discs or squares, no frames.
- **Glints are automatic:** one per icon, on the first big lit field, top-left. Only glass or lenses get
  an explicit `shine` (a short `arc` of w 1-1.2).
- **Moats:** a badge or slash crossing the body always comes with its `cut` (use the kit modifiers).
- **Silhouettes:**
  - Keep the optical size of the exemplars: a filled body spans about 16-19u.
  - Rotated objects (the rocket) are drawn upright, then `rot` + `scale` so they fill the box.
- **Same family, same build.** Copy the exemplar's construction for the rest of its family (§7).
  `file-*` icons use `page()` in sky with a paper fold. `folder-*` use `folder()` in peach and butter.
  `calendar-*` use `calendar()`. `user-*` use `person()`.

## 6. Motion tagging (forge/MOTION.md, Parts choreography)

The renderer tags **every** node:

| class | what it covers |
|---|---|
| `wm-k` | the body |
| `wm-a` | moving or secondary parts (a door, a shackle, a clapper, a flame, a lid) |
| `wm-s` | badges and modifiers |
| `wm-deco` | decorations |
| `wm-shadow` | the cast shadow. It comes from the K body only, so a swinging part leaves no ghost. |
| `wm-shine` | the glint |

Compose reads the plate of each shape from the skeleton lines it covers. A shape wholly off the
object becomes `wm-deco`. When the reading is wrong, force it with `@A`, `@K`, `@S` or `@deco`.
Keep moving parts as **their own layer** (`'peach@A'`) so they can move. Check with `preview-motion`
that decorations stay still and parts pivot cleanly.

## 7. The 20 exemplars (`EXEMPLAR` in `_pastel-render.mjs`; they win over redraw chunks)

| family | icon | construction |
|---|---|---|
| home | home | peach walls, lavender roof `poly`, butter `arch` doorway as a well (A), sky window dot as a well |
| love | heart | `heart()` blush, butter `sparkle` (deco) off the right lobe |
| alerts | bell | butter dome path with a knob, peach clapper disc (A) under it |
| mail | mail | sky `rr` body, paper flap triangle (A), blush seal dot (A) |
| search | search | lavender `ring`, sky `well` glass with an explicit `shine` arc, peach handle bar (A) |
| settings | settings | lavender `gear`, butter hub (A), `cut` axle hole |
| people | user | `person()`: lavender shoulders, peach head |
| rating | star | `star5` butter, tips r 1.1 |
| calendar | calendar | `calendar()`: lavender body, blush header, butter rings (A), ink day dots, a butter "today" chip |
| media | camera | lavender body plus top `unite`, paper bezel and sky well lens (A), butter flash |
| weather | cloud | `cloud()` sky |
| files | file | `page()` sky sheet, paper fold (A), ink `lines` |
| folders | folder | `folder()`: peach back, butter front |
| security | lock | peach shackle `arc` and legs (A), lavender body, ink keyhole (A) |
| music | music-note | lavender stem and flag (`unite` of `seg2` and `stroke`), blush note head (rotated ellipse) |
| travel | rocket | upright, then `rot` 45: lavender body, peach nose `clip` and fins, paper bezel, sky porthole, butter flame (A) |
| food | coffee | peach cup, butter coffee surface (`.flat`), lavender handle `arc` (A), lavender `.flat` `steam` (A) |
| trash | trash | mint can, ink ribs, sky lid and handle (A) with a `cut` handle hole |
| arrows | arrow-right | `arrow()` lavender, w 3.25, head 7 |
| checks | check | `check()` mint, w 3.5 |

## 8. Hand-redraw or leave automatic?

The automatic path (`_pastel-auto.mjs`) already renders every icon in the house look. Check the
baseline sheets (`.preview/pastel-ad-all-*.png`). **Redraw** when the automatic result:
- is a single-hue blob where real parts exist (devices, vehicles, buildings, animals, food),
- uses a hue that breaks its family (§3, §5),
- turns an inner opening into an ink outline instead of a layered part,
- loses the silhouette at 24px, or looks small next to the exemplars.

Leave automatic (or redraw only if you can clearly beat it): pure line glyphs (align-\*, list-\*,
chevrons, text formatting), simple geometric shapes (square, circle, hexagon), and every Live icon.

## 9. Checklist per icon

1. Its silhouette reads in one colour at 16px, and its meaning matches the `line` skeleton.
2. It uses 2-3 hues, ink only on fields, the family's colours, and paints the body first.
3. Nothing is hard, pointy or outlined. No hand-painted highlights. At most one decoration, wholly off the object.
4. Moving parts are their own layers (`@A`), and modifiers come with their moat.
5. Check light and `--dark` at 72, 24 and 16px. Keep it under 8 KB (the ceiling is 16 KB) and under 150 ms.

```bash
node forge/tools/preview.mjs --styles pastel,line --icons a,b --size 72 --small --out .preview/<you>-x.png
node forge/tools/preview.mjs --styles pastel --icons a,b --size 72 --small --dark --out .preview/<you>-x-dark.png
node forge/tools/check.mjs --styles pastel a b
node forge/tools/preview-motion.mjs a,b --styles pastel --frames 7
```
