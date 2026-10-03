# Anime: the design system for redrawers

This guide is for the agents who hand-draw Anime icons in `_anime-redraw-1..5.mjs`.
The renderer (`anime.mjs`, `_anime-render.mjs`), compose (`_anime-compose.mjs`), primitives
(`_anime-prim.mjs`), kit (`_anime-kit.mjs`), tune (`_anime-tune.mjs`), auto path (`_anime-auto.mjs`)
and exemplars (`_anime-exemplars.mjs`) are **frozen**. You only edit your own chunk file. If the kit is
missing something, build it inside your chunk from prim shapes (a local helper function is fine) or ask
the art director.

Previews of the baseline (gitignored, regenerate with the commands in §10):
- `.preview/anime-ad-exemplars.png`, `-exemplars-dark.png`: the 20 exemplars at 72, 24 and 16px
- `.preview/anime-ad-all-1..5.png`, `-all-1..5-dark.png`: all 500 through the automatic path (100 per sheet)

## 1. What world class means here

An Anime icon is a **prop from a modern anime film**: the cup on the kitchen table in a Kyoto Animation
episode, the phone in a Makoto Shinkai frame. It is flattened into crisp vector, but every one of these is true:

1. **Ink line art with weight.** One continuous outline, thin on the lit side (upper left) and heavier on
   the shadow side (lower right). Free line ends taper like a brush stroke. compose does this for you.
2. **Cel colour.** Every surface is one flat colour, with **ONE** hard-edged shadow tone. Never a gradient,
   never two shadow steps. The terminator is a confident smooth curve (compose smooths it for you).
3. **Light from the upper left, always.** Shadows sit lower right. Cast shadows fall down-right from the
   part on top onto the part below (a lid on a bin, a roof on a wall). compose computes them.
4. **Anime shine.** Glossy things get the classic specular: a pointed white streak hugging the lit shoulder
   and a dot after a gap; glass gets two diagonal bars; round glass and eyes get a 4-point glint. Matte things
   (paper, cloth, clouds, skin) get **no** shine.
5. **Vivid but harmonious colour.** Sky blue, sakura pink, warm gold, leaf green, cream, coral. Two or three
   colours per icon plus ink. Shadows are cool (violet) on cool colours and warm (amber/rose) on warm ones.
6. **The object stays recognisable.** Read the skeleton and the `line` style next to yours. Same metaphor,
   same orientation, same silhouette, now drawn as a prop with volume and charm.
7. **Restraint with sparkle.** At most one sparkle (with its mini dot), or one set of speed lines, per icon.
   Many icons have none. Faces only where the object IS a face or a character (user, smile, bot, cat...).

## 2. Grid and measures

| measure | value |
|---|---|
| canvas | 24 x 24. Keep surfaces inside **2.5..21.5** (the outline adds ~0.5 up-left and ~1.1 down-right) |
| outline beyond a surface | 0.5u lit side, ~1.05u shadow side (`M.OL`, `M.OL_SHIFT`). Small parts: `ol: 0.35-0.45` |
| ink detail line | 0.75u (`M.INK`), 0.8-1u for ribs/text lines, tapered free ends |
| tube (coloured line) | core 1.55u + 0.5u outline each side. Thin wisps (steam): `w: 0.95, ol: 0.42` |
| smallest legible part | 1.4u across (a dot of colour), 2.5u for anything that must read at 16px |
| clearance | 1u of colour or background between two outlined parts, or they merge at 16px |
| sparkle | r 1.6-2.4, in a free corner, never touching an outline (`sparkle()` checks for you) |

## 3. Palette (role-named variables, `--with-anime-<role>`)

| role | default | use |
|---|---|---|
| `ink` | #2B2148 deep plum-indigo | all line art; also the colour of dark glass, lenses, keyholes, screens, pupils |
| `c1` | #4BA8F5 sky blue | main colour of most props (devices, arrows, tools, navigation) |
| `c2` | #FF8DB6 sakura pink | hearts, gifts, flowers, sweets, music, cute details, collars |
| `c3` | #FFC740 warm gold | light, metal, stars, bells, keys, coins, folders, windows with light |
| `c4` | #5FCF8C leaf green | nature, success, money, checks |
| `tint` | #FFF5EC cream white | paper, envelopes, clouds, cloth, skin, mugs, white plastic |
| `accent` | #FF5D78 coral red | alerts, flames, stop/record, badges, fins, chimneys |
| `shadow` | #4B2C8F violet | the cel-shadow overlay on cool colours (printed at 17-32% opacity) |
| `shine` | #FFFFFF | streaks, glints, catch-lights |
| `edge` | #BFE6FF pale sky | glass lenses, rim light on big surfaces |

Shadow tones (automatic, `SHADE_TONE`): c1 / c2 / c4 / accent shade with `shadow` (violet), c3 shades with
`accent` (gold turns amber), tint shades lavender. Override with `tone: [role, opacity]` only for special glass.

**Family colours** (copy them): houses cream + sky roof + gold door; mail and paper cream; calendars cream with a
sakura header and sky rings; folders gold; locks gold with a sky shackle; bins and gears sky; hearts sakura; stars and
bells gold; checks green; alerts coral; clouds cream; devices sky body with ink glass screens.

## 4. How a redraw is written

A redraw is a function `(icon, k) => ops`. `k` holds every primitive and kit function (frozen). It returns a
list of ops, **bottom to top**. compose turns each op into finished, tagged SVG.

```js
// _anime-redraw-N.mjs
export const R = {
  // gold padlock with a sky shackle and a dark keyhole
  'lock-keyhole': (icon, k) => [
    k.surf(k.unite(k.arc(12, 7.6, 4.3, 180, 360, 2.4), k.seg(7.7, 7.6, 7.7, 11.8, 2.4), k.seg(16.3, 7.6, 16.3, 11.8, 2.4)),
      'c1', { part: 'a' }),                                   // the shackle moves (plate A)
    k.surf(k.rr(4, 11, 20, 21.2, 2.4), 'c3', { shineSize: 1.1 }),   // body: streak + dot shine
    k.surf(k.circle(12, 16, 1.6), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
  ],
}
```

### Ops (`_anime-kit.mjs`)

| op | what compose draws | options |
|---|---|---|
| `surf(shape, role, o)` | outline + cel colour + one shadow tone (crescent + cast) + shine | `part` 'k'/'a'/'s'; `shade` 0 or strength (1); `inset` (a recess: shadow under the upper-left rim, casts nothing); `cast:false` (receives no cast shadow); `casts:false` (throws none); `shine` 'streak' (default) 'dot' 'glass' 'glint' 'none'; `shineSize`; `ol` (0.5, 0 = none); `olShift`; `rim` (pale rim light on big surfaces); `tone` |
| `ink(lines, o)` | brush ink lines | `w` (0.75), `taper` (true / number / false), `role` ('ink'; 'tint' for white glyphs on a badge), `shift` (0 = no shadow-side thickening), `part` |
| `tube(lines, role, o)` | coloured line with an ink outline and its own shadow | `w`, `ol`, `shade`, `part` |
| `paint(shape, role, o)` | flat paint, no outline, no shadow | `op` opacity, `part` ('shine'/'deco' for those classes) |
| `shine(shape)` | explicit white specular shapes (hair angel ring, eye catch-lights) | `op` |
| `deco(shape, role, o)` | decoration beside the object | `ol` thin outline |
| `sparkle(o)` | 4-point sparkle + mini dot in the freest corner (or none if no room) | `r`, `min`, `role`, `mini`, `where: [[x, y, mx, my], ...]` preferred spots |
| `sparkleAt(x, y, r, o)` | sparkle exactly there | `mx`, `my`: which side the mini dot goes |
| `speed(x, y, deg, o)` | anime speed lines trailing from (x, y) in direction deg | `n` 3, `len` 4, `gap` 1.8, `w` 0.8, `role` 'c1' |
| `ground(cx, cy, rx, ry)` | flat contact shadow under the object (wm-shadow) | `op` |
| `moat(shape, gap)` | erases shape+gap from everything below: the gap around a badge or slash | |
| `asPart(ops, part)` | set the motion plate of a group | |

Lines are path data strings (`'M8 7 C6 6 9 5 8 3'`), point lists, or `[{ pts, closed }]`.

### Shapes (`_anime-prim.mjs`): every shape is a list of rings (even-odd)

- `circle ellipse(cx,cy,rx,ry,deg) ring(cx,cy,r0,r1) dot rect rr(x0,y0,x1,y1,r|[tl,tr,br,bl]) pill`
- `poly(pts, r|[r..])` rounded polygon, `tri`, `ngon(cx,cy,r,n,deg,round)`, `star(cx,cy,R,r,n,deg,round)`
- `sparkle(cx,cy,r,waist,deg)`, `lens(x0,y0,x1,y1,bulge)` (leaf, eye, petal), `drop(cx,cy,r,tx,ty)`,
  `arch(x0,y0,x1,y1)` (door, window), `sector(cx,cy,r,a0,a1)`, `path(d)` (closed subpaths of any SVG path)
- strokes as shapes: `stroke(lines, w)`, `arc(cx,cy,r,a0,a1,w)`, `seg(x0,y0,x1,y1,w)`, `bar(pts,w)`;
  `arcPts`, `curve(points)` (smooth Catmull-Rom through points)
- transforms: `move rot(sh,deg,cx,cy) scale flipX flipY join around(sh,n,cx,cy)`
- booleans (through the field, result is a shape again): `unite cut(a, ...b) clip(a,b) grow(sh,d) soften(sh,r)`
- family parts (kit): `heartShape(cx,cy,s)`, `page(x0,y0,x1,y1,fold,r) -> {sheet, flap}`, `cloudShape(cx,cy,s)`,
  `gearShape(cx,cy,r,n,tooth,tw)`, `person(cx,top,s) -> {head, body, hair}`, `starShape(cx,cy,R,r,round)`
- `k.cast(icon)` returns the automatic colour casting `{ main, second, badge, panel }` if you want to stay
  consistent with the auto path; `k.M` the measures; `k.PALETTE` the defaults.

Angles are degrees, 0 = east, clockwise (90 = south).

## 5. Composition rules

- **Stack like cels.** Back parts first (handle behind the cup, chimney behind the roof, fins behind the rocket),
  then the body, then the parts that sit on it. Each surface gets its own outline, so the stack reads as layers.
- **One surface per material plane.** A lid is its own surf on top of the bin (it casts onto the bin). A header
  band is a `clip` of the body (with `cast: false`, it shares the body's plane).
- **Recesses** (screens, keyholes, windows, lens glass, doors set into walls): `inset: true`. Dark glass is
  `'ink'` with `shine: 'glass'` (two diagonal bars) or `'glint'`. Light glass is `'edge'`.
- **Shine budget:** one streak per glossy object (on the biggest glossy surface), dots on small glossy parts,
  `'none'` on paper, cloth, skin, clouds, walls, matte plastic. Never shine on every part.
- **Details** are ink lines (ribs, text lines, folds) at 0.75-1u, or flat `paint` dots. Keep ≥ 2u from the edge.
- **Badges (S plate):** `moat` first (gap 0.6-0.8), then a coral/green disc `surf` with `part: 's'`, then the glyph
  as `ink(..., { role: 'tint', w: 1.3, taper: false, shift: 0, part: 's' })`. Slashes (`-off`): `moat` + coral tube.
- **Motion lines and sparkles** sit wholly off the object, in empty corners. Speed lines go behind moving things
  (arrows, rockets, send, cars), opposite to the direction of travel.
- **Characters:** cream face, hair in c1/c2 with a back layer behind the face and a fringe in front, two ink eyes
  (0.6 x 0.9) with white catch-lights up-left, the hair's angel-ring shine (`shine(clip(arc(...), hair))`).
  No mouth or nose at icon size unless the icon is about the expression (smile, frown, angry, laugh).

## 6. Motion tags (forge/MOTION.md "Parts choreography")

compose tags every node for you:

| your op | class |
|---|---|
| `surf/ink/tube/paint` with `part: 'k'` (default) | `wm-k` (outline, colour, cel shadow, rim move with it) |
| `part: 'a'` | `wm-a`: the skeleton's A plate, the part that moves (shackle, lid, door, clapper, hands, flap) |
| `part: 's'` | `wm-s`: badges, slashes, modifiers |
| shine (auto or `shine()`) | `wm-shine` |
| `deco`, `sparkle`, `speed`, `paint(..., {part:'deco'})` | `wm-deco` |
| `ground` | `wm-shadow` |

Rules: give `part: 'a'` only to what the skeleton marks A **and** what really moves (a lock's keyhole is plate A in
the skeleton but stays with the body: tag it 'k'). Check with `preview-motion` that decorations stay put.

## 7. The 20 exemplars (`_anime-exemplars.mjs`, they win over the chunks)

| family | icon | construction |
|---|---|---|
| buildings | home | coral chimney, cream walls incl. gable, glossy sky roof slab with eaves, gold arched door (A) + knob, gold window glint |
| hearts | heart | `heartShape` sakura, big streak, sparkle |
| alerts/bells | bell | gold dome `path`, gold lip pill, sakura clapper (A), ring on top, sparkle |
| mail | mail | cream envelope, ink lower folds, cream flap (A) with a coral heart seal |
| search/zoom | search | sky grip handle (A), brass `ring`, `edge` glass with `shine: 'glass'` |
| gears | settings | `gearShape` cut by the hub hole, gold hub `ring` (A) |
| users | user | cream shirt + sakura collar, sky back-hair, cream face, ink eyes + catch-lights, fringe, angel ring |
| stars | star | `starShape` gold, sparkle |
| calendars | calendar | cream body, sakura header `clip`, ink day dots, one sky picked day, sky ring pills (A) |
| cameras/media | camera | sakura shutter, sky body with hump, gold flash, ink barrel (A), sky glass `inset` + glint |
| weather | cloud | `cloudShape` cream, `rim`, soft lens shine |
| files | file | `page()` cream sheet + sky flap (A), three ink text lines |
| folders | folder | gold back with tab, cream paper (A), gold front flap (casts onto the paper) |
| locks | lock | sky shackle band (A), gold body, ink keyhole `inset` |
| music | music-note | head + stem + flag united, sakura, sparkle |
| travel/space | rocket | everything rotated 45°: gold flame (A), coral fins, cream body, sky porthole glint, speed lines |
| food/drink | coffee | cream steam tubes (A), sky saucer, cream handle ring (A), cream mug, sakura heart print |
| bins | trash | sky body with ink ribs, lid + handle (A) casting onto the body |
| arrows | arrow-right | one united shaft + head `surf` in sky, speed lines behind |
| checks | check | `stroke` polyline 3.6u green, sparkle |

## 8. Hand-redraw or leave automatic?

The automatic path already renders every icon in the style (fills become surfaces, cutouts become inset panels,
lines inside become ink, lines outside become tubes, S plates become badges). **Redraw** when any of these is true:

1. The icon is a **hero** (common in apps: navigation, communication, media, files, commerce, users, weather).
2. The auto colours are wrong for the object (a banana must be gold, a leaf green, a fire coral + gold).
3. Parts that should be separate surfaces are one mass (a mug and its saucer), or a recess is not a panel.
4. Line-only skeletons that are objects, not glyphs (a pencil, a key, a magnet): make them surfaces with volume.
5. A character or face (user-*, smile, bot, cat, dog...): draw it like §5 Characters.

**Leave automatic** (or redraw lightly) pure glyphs: chevrons, align/indent/list text glyphs, plus/minus/x, layout
grids. If you redraw an arrow, copy `arrow-right` (one united surface + speed lines).

## 9. Checklist per icon

1. Silhouette reads at 16px; compare with `line` side by side. Same metaphor and direction.
2. 2-3 colours + ink, from the family colours. Shadows look like one clean cel tone, lower right.
3. Shine only on glossy parts; at most one streak; matte parts `shine: 'none'`.
4. Nothing touches the canvas edge (outline included), sparkles don't touch outlines.
5. Moving parts carry `part: 'a'`; badges `part: 's'`; decorations are deco ops.
6. Light **and** `--dark`, 72 / 24 / 16px. Output < 8 KB (compose shrinks dense icons automatically), render < 150 ms.

## 10. Commands

```bash
node forge/tools/preview.mjs --styles anime,line --icons a,b --size 72 --small --out .preview/<you>-x.png
node forge/tools/preview.mjs --styles anime --icons a,b --size 72 --small --dark --out .preview/<you>-x-dark.png
node forge/tools/preview.mjs --styles anime --icons a --size 220 --nolabels --out .preview/<you>-zoom.png
node forge/tools/check.mjs --styles anime a b
node forge/tools/preview-motion.mjs a,b --styles anime --frames 7 --out .preview/<you>-motion.png
```

A redraw that throws falls back to the automatic path. If your icon looks like the auto version, run the preview
with `ANIME_DEBUG=1` set and the error is printed.
