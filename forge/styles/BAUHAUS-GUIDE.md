# Bauhaus: the design system for redrawers

This guide is for the agents who compose the 500 Bauhaus icons (`_bauhaus-redraw-1..12.mjs`).
The primitives (`_bauhaus-prim.mjs`) and parts (`_bauhaus-kit.mjs`) are **frozen**. Build with what
is listed here. If something is missing, ask the art director instead of drawing around it.

Previews (gitignored, regenerate with the commands at the end):
- `.preview/bauhaus-ad-exemplars-before-after.png`: the 20 exemplars, before | after
- `.preview/bauhaus-ad-arrows-before-after.png`: the arrow family after the systemic fix
- `.preview/bauhaus-ad-exemplars-after.png` / `-after-dark.png`: exemplars at 72, 24 and 16px, light and dark

## 1. What world class means here

A Bauhaus icon is a **small poster**. It should read at 16px, hold up at 128px, and at 56px look
like someone composed it with a compass and a set square:

1. **Few, bold primitives.** 2-6 shapes. Every shape is a circle, part of a circle, a pill, an arch,
   a lens, or a generously rounded polygon. If you need more than 6, the idea is wrong.
2. **Soft, never boxy.** No hard corners (compose rounds them for you, see §3). Bars have round caps.
   Arrowheads are swept and rounded. Curved bands end in round caps or are buried under another field.
3. **Flat fields of 2-4 colours.** Each primitive is one flat colour. Overlaps are deliberate.
4. **One idea of construction.** Split bodies, a quarter-disc detail, an arch, concentric bands. Pick
   one or two per icon. Don't stack all of them.
5. **Silhouette first.** Fill the icon with a single colour. You should still recognise it. If you
   can't, fix the shape before you touch the colours.
6. **Same family, same build.** All arrows, files, folders, people and calendars use the kit part
   for their family. Never re-derive a family shape by hand.

## 2. Grid and measures

| measure | value |
|---|---|
| canvas | 24 x 24, live area 2..22 (a disc container is r 9.75 at 12,12) |
| colour bar (`BW`) | 2.5u, round caps (`seg2`, `bar`, `arc`) |
| ink detail bar (`IW`) | 2-2.25u |
| chevron / check arms | 2.75-3.25u |
| small dot | r 1-1.25u; eye/keyhole dot r 1.25-1.75u |
| container corner radius | 2.5-3.5u (`rr`), sheet 2.5u, square 3.5u |
| rounded polygon corners | >= 0.9u (enforced), roof/flap 1.25-2u, play/triangle tips 2.25-2.75u |
| moat / gap between parts | 1-1.25u (`badge`, `slash`, `['cut', ...]`) |
| arrowhead | len 6-7.25, half 5-6.5 (straight); len 6, half 4.5-4.75 (curved) |
| automatic corner radius | 0.8u (compose, §3) |

Keep weights consistent within an icon. A 2.5u colour bar next to a 3.25u bar looks like a mistake.

## 3. The no-hard-corner rule (automatic)

`compose()` runs `soften()` on every printed field. Every sharp convex corner gets a 0.8u round:
the chord ends of a half disc, the point of a quarter disc, the flat ends of a band, the corners of
`rect`, and the edges that a `cut`, moat or slash leaves behind.

A corner is **kept crisp only when it sits flush against another field** (within 0.3u). Examples:
the seam of a split disc, a chord standing on a bar, a dog-ear in its notch, a flat band end
buried in an arrowhead. So:

- **Want a crisp seam?** Make the parts share the edge exactly: `split`, `halves`, `clip` to the same
  container, or a chord on another shape's edge.
- **Don't fake roundness** with tiny `rr` radii on parts that abut. Abutting edges must match exactly.
- A corner that is still visible and still sharp after compose is a bug. Report it to the art director.

## 4. Primitive vocabulary (`P` = prim + kit, passed to every redraw)

Shapes (`_bauhaus-prim.mjs`):
- `circle ellipse ring dot`: discs and rings.
- `half(cx,cy,r,dir)`, `quarter(cx,cy,r,dir)`, `sector`, `segment`, `ehalf`: parts of a circle.
- `arc(cx,cy,r,a0,a1,w)`: a band with round caps.
- `arcEnds(..., e0, e1)`: a band with `'round'` or `'flat'` ends. Use flat only where the end is
  buried under another field.
- `band`: a flat-ended annular sector, which compose softens.
- `seg2 bar`: round-capped bars and polylines. `stroke(d, w)`: any curve as a round-capped band.
- `rr(x0,y0,x1,y1,r|[tl,tr,br,bl])`, `pill`, `arch(…, dir, rb)`, `rect`: rect only for clip regions
  or flush joints.
- `poly(pts, r)`, `tri`, `star`, `ngon`: rounded polygons.
- `lens cap drop`: petals, leaves, eyes, domes, pins, flames.
- `move rot flipX flipY scale around join`: transforms.
- `cut clip unite`: booleans.
- `soften(shape, f)`: explicit rounding, which compose already applies.

Parts (`_bauhaus-kit.mjs`):
- **Arrows:**
  - `arrow(x0,y0,x1,y1,{len,half,shaft,tip})`: ink shaft and a red swept head.
  - `head(tx,ty,deg,len,half,r,{notch,rb})`: the rounded tip lands exactly on (tx,ty). The concave
    back takes the shaft, so end a separate shaft 0.5-2u inside the head.
  - `softTri(T,B1,B2,notch,rt,rb)`: the raw swept triangle.
- **Curved arrows:**
  - `arcArrow(cx,cy,r,a0,a1,{role,tip,len,half,ccw,r,rb})`: the band runs round-capped from its tail
    and ends flat inside the head. The head rides the curve, so it never kinks.
  - `arcHead`: the head alone.
  - Never hand-place a `head` at the end of a raw `arc` (straight legs after an arc, as in undo, are fine).
- **Two-arm glyphs:**
  - `vee(pts,w,rA,rB)`: one bent bar split along the joint's bisector (chevrons, checks). Pass
    rA = rB for one colour.
  - `chev(x,y,deg,arm)`: the chevron points.
  - `chevSplit(x,y,deg,arm,w,ra,rb)`, `chevron(...)`: one colour.
- **Splits:**
  - `split(sh, ra, rb, x, y, deg)`: any shape cut along any line. ra is the side the normal
    (sin deg, -cos deg) points to: above a horizontal seam, right of a vertical one.
  - `halves(sh, ra, rb, 'v'|'h'|'d', at)`
  - `splitDisc(cx,cy,r,ra,rb,dir)`
- **Construction:**
  - `bands(cx,cy,rs,w,roles,a0,a1)`: concentric rings or arcs.
  - `archStack(cx,cy,base,rs,w,roles)`: nested arches (rainbow, portal).
  - `petals(cx,cy,n,r0,r1,h,roles,start)`: a petal ring (flower, pinwheel, shutter).
  - `cornerQuarter(container,x,y,r,dir)`: the quarter-disc detail tucked into a corner.
- **Families:**
  - `page(role, fold, …, q)`: file, with a quarter-disc dog-ear.
  - `folder(back, front)`, `calendar(body, band)`, `cloud(dy, body, lobe, k)`
  - `person(cx, top, s, head, body)`, `heart()` (`.left .right .all`), `face`
  - `square`, `disc`: containers.
- **Modifiers:**
  - `badge(kind, role, cx, cy, r)`: a disc with a glyph and a moat. `glyph(kind, …)` for plus,
    minus, x, check, bang, dot, up, down and q.
  - `slash()`: the "-off" bar with its gap.
  - `moat`, `lines`

## 5. Composition rules

- **Split bodies.** The signature move. A disc, a lock body, a star, a chevron or a shield is cut once
  along an axis into two primaries. Use `split` / `halves` / `splitDisc`, never two overlapping shapes.
- **Quarter-disc details.** A quarter disc rising from a corner of the container (`cornerQuarter`,
  `page(..., q)`): the file's red corner, the calendar's yellow sun.
- **Arches.** Doors, windows, bells, tombstones and tunnels: `arch`, `archStack`.
- **Concentric bands.** Targets, lenses, signals and sound: `bands`, `ring`.
- **Decoration, sparingly.** 1-2 geometric accents per icon at most: a dot, a small quarter, a short
  band beside the object. They must lie **wholly off** the skeleton so compose tags them `wm-deco`
  and they stay still while the object moves. **Never** use a backdrop disc or square behind the
  object, or a random confetti accent.
- **Motion.** Keep moving parts (A plate: shackle, door, hands, clapper) as their own primitives, so
  compose tags them `wm-a`. Check with `preview-motion` that decorations don't move with the object.
- **Paint order** is bottom to top. Use a `['cut', …]` layer to open a moat (1-1.25u) where a modifier
  crosses the body.

## 6. Colour

| role | default | use |
|---|---|---|
| `c1` | red #E0412E | the active or main part, heads, hearts, alerts |
| `c2` | yellow #F2B33D | light, faces, lenses, details |
| `c3` | blue #2A6BC2 | bodies, containers, pages |
| `c4` | orange #E9772E | the red/yellow overprint only |
| `accent` | green #2E7A5E | leaves, money, success |
| `tint` | cream #F3EBDD | light detail on a dark field: arrows on discs, highlights |
| `ink` | currentColor | black geometry on the page (shafts, steam, shackles). On a colour field it prints in the fixed black `shadow`, which compose decides for you. |

- **2-4 colours per icon**, ink included. One dominant field, one contrasting primary, and ink or
  tint for details.
- **Legibility:**
  - Text, hands, glyphs and arrows on a field use `tint` (on red or blue) or `ink` (on yellow).
  - Never put yellow on yellow, or red detail on orange.
  - Never put tint on yellow (contrast).
- **Dark mode:** `ink` flips to the page colour. Anything that must stay black on a colour field
  (keyholes, pupils) is printed **on** that field, so compose turns it into `shadow`. Check `--dark`
  every time.
- **Family colours:** keep the same colours across a family (files blue with a yellow dog-ear,
  folders red over blue, calendars blue with a red band, arrows ink with red heads).

## 7. The 20 exemplars

These live in `_bauhaus-render.mjs` (`EXEMPLAR`). They override the same names in the redraw chunks,
so don't edit those entries. Copy their construction for the rest of each family.

| family | icon | construction |
|---|---|---|
| arrows | arrow-right | `arrow(3.75,12,20.75,12,{len:7.25,half:6.5})`: ink shaft sunk into the notch of a red swept head |
| refresh/rotate | refresh | two `arcArrow`s on r 8 (190-335 blue, 10-155 red), len 6, half 4.5, heads riding the curve |
| chevrons | chevron-right | `chevSplit(16,12,0,8.5,3.25)`: one bent bar, blue upper arm, red lower, seam through the tip |
| circle-arrows | circle-arrow-right | red `disc`, cream shaft and `head` |
| file | file | `page('c3','c2',…,'c1',9)`: blue sheet, yellow dog-ear lifted 1u, red quarter rising |
| folder | folder | `folder('c1','c3')`: red back with a half-disc tab, blue front with an arched lip |
| calendar | calendar | `calendar('c3','c1')` + yellow `cornerQuarter` sun + three cream day dots |
| cloud | cloud | `cloud(0)`: red front lobe over the blue body and pill base |
| star | star | rounded 5-point star `split` vertically: yellow, red |
| play | play | one red triangle, corners 2.75/2.25/2.75. Pure, nothing added |
| heart | heart | `heart().all` red with a cream `lens` highlight |
| user | user | `person(12,3)`: red head disc over blue half-disc shoulders (softened chord ends) |
| bell | bell | yellow `arch` dome on a red pill rim, ink clapper and finial |
| home | home | red walls, blue rounded roof triangle, yellow `arch` door, cream window dot |
| mail | mail | blue envelope, yellow flap triangle, red seal disc |
| search | search | blue `ring`, yellow lens disc, red handle bar |
| settings | settings | blue gear (8 pills `around` a disc), yellow hub, ink axle |
| lock | lock | ink shackle (`arc` + legs), body `halves` yellow over red, ink keyhole |
| camera | camera | blue body, red viewfinder pill, concentric lens ink/yellow/ink, cream flash dot |
| coffee | coffee | red cup, yellow rim band, blue handle `arc`, ink steam `stroke`s |

## 8. Checklist per icon

1. Silhouette reads in one colour at 16px.
2. 2-4 colours, and the details are legible on their field.
3. No visible hard corner and no square end on a curved band. Buried ends are hidden.
4. Weights from §2. The arms of a glyph match each other.
5. Decorations sit wholly off the object (`wm-deco`). Moving parts are separate primitives.
6. Light and `--dark`, 72 / 24 / 16px, side by side with `line`, so the meaning matches the skeleton.

```bash
node forge/tools/preview.mjs --styles bauhaus,line --icons a,b --size 72 --small --out .preview/<you>-x.png
node forge/tools/preview.mjs --styles bauhaus --icons a,b --size 72 --small --dark --out .preview/<you>-x-dark.png
node forge/tools/check.mjs --styles bauhaus a b
node forge/tools/preview-motion.mjs a,b --styles bauhaus --frames 8
```
