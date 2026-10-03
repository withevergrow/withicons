# Coquette: the design system for redrawers

This guide is for the agents who hand-compose Coquette icons in `_coquette-redraw-1..5.mjs`.
The painter (`_coquette-paint.mjs`), the kit (`_coquette-kit.mjs`), the automatic path
(`_coquette-auto.mjs`), the registry (`_coquette-redraws.mjs`) and the renderer are **frozen**.
Build with what is listed here. If something is missing, ask the art director; don't draw around it.

Previews (gitignored, regenerate with the commands at the end):
- `.preview/coquette-ad-exemplars.png` / `-dark.png`: the 20 exemplars at 96, 24 and 16px
- `.preview/coquette-ad-auto-1..5.png` / `coquette-ad-auto-dark-1..5.png`: all 500 through the automatic path (your baseline)
- `.preview/coquette-ad-live.png`: Live icons (always automatic)

## 1. What world class means here

Coquette is the Gen-Z romantic-feminine look: ballet pink, cream, ribbon red, satin bows, pearls,
lace, little hearts, a touch of gold. A Coquette icon is **the object, dressed**. Not a cartoon.

1. **The object first.** Fill the silhouette with one colour: you must still recognise it at 16px.
   The ornament never replaces or hides the meaning (no bow over the keyhole, no lace over the text).
2. **Dainty, not childish.** No faces, no eyes, no blush cheeks (that is Kawaii). No thick sticker
   border (that is Sticker). A fine wine-berry line, satin light, quiet shadow.
3. **One or two ornaments, chosen.** A bow *or* a pearl string *or* a lace trim, plus at most one small
   accent (a heart, a pearl, a gold twinkle). Three ornaments is a costume. Zero is allowed when the
   object is already the ornament (a heart, a ribbon, a gift with its own bow).
4. **Ornaments belong to the object.** A bow is *tied on* something (a corner, a handle, a stem, a
   tail, a hanger); pearls *hang* (a necklace, a strap, a chain); lace *trims* an edge (an eave, a
   rim, a flap, a hem). Never float a bow in empty space.
5. **Satin light.** Every surface is lit from the upper-left: a shade crescent lower-right, a satin
   ramp toward the light, a crisp tapered sheen. The painter does this for you: draw clean shapes.
6. **Family consistency.** Same family, same build: files are cream pages with a blush dog-ear,
   folders rose back / blush front with a heart clasp, people have a hair bow and a pearl necklace,
   arrows are satin ribbons with the bow on the tail. Copy the exemplar of your family (section 7).

## 2. Palette (roles)

Every colour is `var(--with-coquette-<role>, #hex)`, so per-icon palettes and the editor work.

| role | default | use |
|---|---|---|
| `ink` | `#7E2443` wine berry | the fine outline, inner detail lines, text |
| `c1` | `#F8BCCB` blush | THE object body (material `blush`) |
| `c2` | `#EC8DA6` rose | secondary parts (`rose`), flat inner lines/dots on cream, the shade on blush |
| `c3` | `#D7385F` ribbon red | bows, hearts, badges, accents (`satin`, `heart`, `bow`) |
| `c4` | `#FCEADD` cream | paper, inner panels, pearls (`cream`, `pearl`) |
| `tint` | `#FFE4EB` light satin | the satin ramp on blush (automatic) |
| `accent` | `#D9A45B` gold | handles, shackles, rims, clappers, chains, twinkles (`gold`, `wire`, `sparkle`) |
| `shadow` | `#A8345C` rose shadow | the cast shadow at low opacity (automatic) |
| `shine` | `#FFFFFF` | the sheen (automatic) |
| `edge` | `#FFFBF6` lace white | lace, cream glyphs on badges |

Colour budget per icon: blush + one of (rose | cream) + ribbon red + optional gold. The body is
blush **unless** the object is paper or glass (cream), or metal (gold). Red is the accent: keep red
areas small (a bow, a heart, a seal, a door) so they sparkle against the pink.
Dark mode needs no work: every material is light on a dark page; check `--dark` anyway.

## 3. Materials (what `k.<material>(shape, opts)` paints)

| part maker | material | for |
|---|---|---|
| `k.body(f)` / `k.blush(f)` | blush satin | the object (plate K) |
| `k.rose(f)` | rose satin | secondary parts, roofs, lids, handles in pink (plate A) |
| `k.cream(f)` | cream | paper, pages, panels, envelopes, glass (plate K) |
| `k.gold(f)` | polished gold | shackles, rims, rings, clappers, handles, flames (plate A) |
| `k.satin(f)` | ribbon-red satin | doors, fins, badges, seals (plate S) |
| `k.fill(f, role)` | flat, no line | text lines on paper (`'c2'`), glyphs on a badge (`'edge'`) |
| `k.ink(d, w)` | flat wine line | fine inner detail drawn as a line |

Every material part takes `opts`: `{ plate: 'K'|'A'|'S'|'deco', ow, flat, detail, noShadow, sheenBias, op }`.
- `ow` outline width. Default by thickness: 0.64 (bodies), 0.55 (bars), 0.42 (thin parts).
  `ow: 0` = no outline (glass inside a rim, a lens).
- `detail`: a field of ink lines drawn on top of this part (it inherits the part's plate).

## 4. Line weights and measures

| measure | value |
|---|---|
| canvas | 24 x 24; keep the object in 2.5..21.5, ornaments may reach 1..23 |
| body outline | 0.64u (automatic) |
| inner detail line (`k.ink`) | 0.8-1.1u |
| flat text line on paper (`k.fill(k.tube(d, 1.2), 'c2')`) | 1.1-1.3u |
| satin ribbon / glyph tube (`k.tube`) | 2.8-3.1u (arrows, checks, chevrons) |
| object bars / rims / handles | 1.9-2.6u |
| bow | `s` 0.55-0.65 on a corner or handle, 0.72-0.85 as the hero (heart cleft, bell hanger, arrow tail). 1 = 10u wide |
| pearl | r 0.62-0.9 in a string, 0.85-1.2 alone |
| lace scallop | r 0.7-0.85 |
| heart accent | w 4-5.6 (a keyhole, a seal, a clasp); w 3.5-4.4 as a floating accent |
| corner radius | containers 2.2-3, small parts 1-1.5 (`rr`), polygons `poly(pts, 0.6-1.4)` |
| clearance | 1u between separate parts; a modifier gets a moat (`k.moat(a, b, 0.7)`) |

## 5. Ornament budget and composition rules

- **Budget: 1-2 ornaments.** Hero ornament (bow / pearl string / lace) + optional small accent.
- **The bow** sits on an upper corner, a handle, a stem, a hanger or a tail, tilted 15-25 degrees
  outward on a corner (`rot` +18 top-right, -18 top-left), straight when centred.
- **Pearls** for: necklaces (people), straps and chains, a ring of dots, any dot of the skeleton
  (the automatic path already turns dots into pearls).
- **Lace** trims a straight or gently bent edge: under an eave, under a lid, along a flap, across a
  camera body. Paint lace **before** the part it hangs from so only the scallops peek out.
- **Hearts** replace a functional detail when the meaning survives: keyhole, wax seal, clasp, a day
  on a calendar, a hub, a note head. Hearts never replace a glyph that carries meaning (plus, minus,
  x, check, arrows, numbers).
- **Sparkles** (gold twinkle) only in empty corners, at most one.
- **Paint order** is back to front: things behind (shackle, handle, flame, back panel) first, then
  the body, then panels and details, then the ornaments.
- **Silhouette size**: the object's bounding box should be ~16-18u like the exemplars. The ornament
  may break the silhouette, the object may not shrink to make room for it.

## 6. Motion tagging (forge/MOTION.md "Parts choreography")

The painter tags every node: object parts by their `plate` (`wm-k`, `wm-a`, `wm-s`), ornaments
`wm-deco`, the cast shadow `wm-shadow`, the sheen `wm-shine`. You only choose the plate:
- **K** the object body; **A** the moving or secondary part (shackle, door, clapper, hands, lid,
  handle, steam); **S** a badge or modifier (plus, slash, check badge).
- Ornaments default to **deco** (they keep still and breathe while the object moves).
- **Exception: a structural ornament** that the object hangs from or is built of (the bell's bow
  hanger, a heart that *is* the keyhole) takes the object's plate: `{ plate: 'K' }`.
- Check with `preview-motion`: the object must not leave its bow behind in a weird way.

## 7. The 20 exemplars (`_coquette-exemplars.mjs`)

They override the same names in the redraw chunks. Copy their construction for your family.

| family | icon | construction |
|---|---|---|
| buildings | home | blush walls, rose roof slab (`tube` 2.8), lace eave under it, ribbon-red arch door, pearl knob |
| hearts | heart | blush `heartShape(12,13.4,18.6)`, hero bow in the cleft (s 0.82), one gold twinkle |
| alerts | bell | gold clapper behind, blush dome, rose rim pill, bow as the hanger (plate K) |
| mail | mail | cream envelope, wine fold lines, lace along the flap edge, blush flap, red heart seal |
| search | search | rose handle, gold ring, blush glass (`ow: 0`), small bow at the neck |
| settings | settings | blush gear (8 rounded teeth), cream hub, red heart in the hub |
| people | user | blush shoulders, pearl necklace, blush head, hair bow (s 0.62, rot 22) |
| ratings | star | blush rounded star, pearl at its heart, gold twinkle |
| calendar | calendar | cream page, blush header, rose day dots, red heart day, gold binder rings |
| media | camera | rose top hump, blush body, lace band, gold lens ring, rose glass, pearl flash |
| weather | cloud | blush discs + pill base, bow on the crown |
| files | file | cream page (`poly`, r 2), blush dog-ear (plate A), rose text lines, bow on the top-left corner |
| folders | folder | rose back + tab, cream sheet, blush front, red heart clasp |
| security | lock | gold shackle, blush body, red heart keyhole, small bow on the shackle |
| music | music-note | blush stem + flag, ribbon-red heart head, gold twinkle |
| travel | rocket | gold flame, ribbon fins, blush body, gold porthole with cream glass (rotated 45) |
| food/drink | coffee | gold handle, blush cup, red heart, rose steam (`fill`, plate A) |
| actions | trash | gold handle, blush bin, rose ribs, lace under the rose lid |
| arrows | arrow-right | blush satin ribbon (`tube` 3) with the bow on the tail (s 0.72) |
| glyphs | check | blush satin ribbon check, a small red heart in the free corner |

## 8. Hand-redraw vs automatic

The automatic path (`k.auto(icon, opts)`) already reads the skeleton by plate, makes a blush satin
body, gold outer A parts, rose A panels, cream cutout panels, red S badges, pearls for dots, and ties
one bow on the upper corner (or the tail of an arrow; a small heart in a free corner for other line
glyphs). It is the **baseline**: look at `.preview/coquette-ad-auto-*.png`.

Hand-redraw (write an entry) when any of these is true:
- the bow covers a feature or sits awkwardly (alarm-clock bells, wifi arcs, sunrise, bell-ring)
- the object deserves its signature dressing (a family move from section 7: heart keyhole, pearl
  necklace, lace trim, heart clasp, heart seal, cream paper)
- the object is clutter at 24px (many small parts: atom, qr-code, network, snowflake): simplify
- the icon already has its own ornament (gift, award, party-popper): no extra bow
- people, files, folders, calendars, mail, locks, media: use the family build, always

Leave automatic only when the baseline is already good (a plain container with a nicely placed bow).
Live icons (forge/dynamic) are always automatic: never register a Live icon name.

Cheap redraw: start from the baseline and adjust it.

```js
// the automatic dressing without its bow, plus a pearl string as the ornament
'shopping-bag': (icon, k) => [k.auto(icon, { bow: false }), k.pearls('M8 7.5 Q12 4.5 16 7.5', 0.75)],
// the automatic dressing with the bow moved
wifi: (icon, k) => k.auto(icon, { bow: { x: 18.5, y: 17.5, s: 0.6, rot: 0 } }),
```

`k.auto` options: `bow: false | { x, y, s, rot } | { s }`, `corner: 'tl' | 'tr'`, `scale`, `dx`,
`dy`, `mat` (body material), `remap: { A: 'K' }`, `wk` `wl` `wa` (widths), `noFills`, `fillPlate`.

## 9. How a redraw is written (API)

```js
// forge/styles/_coquette-redraw-N.mjs
export const R = {
  // a cream page with a blush dog-ear, a red heart padlock badge
  'file-lock': (icon, k) => [
    k.cream(k.poly([[5, 3], [13.6, 3], [19, 8.4], [19, 21], [5, 21]], 2)),
    k.body(k.poly([[13.4, 3.4], [13.4, 8.6], [18.6, 8.6]], 0.7), { plate: 'A' }),
    k.fill(k.tube('M8.5 12.5 H12.5', 1.2), 'c2'),
    k.gold(k.tube('M14 15.5 V14.5 A2 2 0 0 1 18 14.5 V15.5', 1.4), { plate: 'S' }),
    k.satin(k.rr(12.5, 15, 19.5, 20.5, 1.5), { plate: 'S' }),
  ],
}
```

- Signature: `(icon, k) => parts` (nested arrays are flattened, `null`s dropped). `icon` is the
  prepared skeleton (`icon.paths`, `icon.lines`, `icon.fills`) if you want to reuse its geometry.
- Coordinates are final canvas units (24 x 24). The automatic path shrinks the skeleton to 0.86
  around (11.85, 12.45); hand-composed icons are drawn at full size like the exemplars.
- A redraw that throws falls back to the automatic path. Run with `COQ_DEBUG=1` to see the error.

**Shapes** (return fields; combine freely):
`disc(cx,cy,r)` `ellipse(cx,cy,rx,ry,rot)` `ring(cx,cy,r,w)` `rr(x0,y0,x1,y1,r|[tl,tr,br,bl])`
`rect` `pill` `arch(x0,y0,x1,y1)` `poly(pts, r)` (rounded polygon) `path(d)` (filled SVG path, even-odd)
`tube(d|pts, w, closed)` / `stroke` / `seg(x0,y0,x1,y1,w)` (round-capped bands)
`heartShape(cx,cy,w,rot)` `star(cx,cy,R,r,round,n)` `circlePts` `heartPts` `starPts` `along(d, step)`
`union(...)` `cut(a, ...b)` `inter(a, ...b)` `grow(f,e)` `inset(f,e)` `moat(a,b,gap)` `outline(f,w)`
`move(f,dx,dy)` `mirrorX(f,ax)` `mirrorY(f,ay)` `side(x,y,deg)` (half-plane) `area(f)` `box(f)`

**Parts**: `body blush rose cream gold satin fill ink detail` (section 3).

**Ornaments** (plate `deco` unless `{ plate }`):
- `bow(x, y, s, rot, opts)`: knot at (x, y). Returns 3 parts (tails, loops with creases, knot).
- `pearl(x, y, r)`, `pearls(d|pts, r, { closed, step })`
- `heart(x, y, w, rot, { mat })` (ribbon red; `mat: 'rose'` / `'blush'` for softer)
- `sparkle(x, y, r)` gold four-point twinkle (no outline)
- `lace(d|pts, r, { eyelets, band })` scalloped trim along a path; `laceRing(shape, r, out)` a doily
- `ribbon(d, w)` a red satin band (sash, strap); `wire(d, w)` a fine gold chain/wire

## 10. Checklist per icon

1. One-colour silhouette reads at 16px; meaning matches the `line` style.
2. 1-2 ornaments, attached to the object, never covering a meaningful feature.
3. Blush body (or cream/gold for paper/metal), red only as a small accent, gold for metal parts.
4. Weights from section 4; nothing thinner than 0.8u that isn't a detail line.
5. Plates: moving parts on A, badges on S; ornaments deco unless structural.
6. Light and `--dark`, 72 / 24 / 16px; size under 8 KB (ceiling 16 KB); < 150 ms.

```bash
node forge/tools/preview.mjs --styles coquette,line --icons a,b --size 72 --small --out .preview/<you>-x.png
node forge/tools/preview.mjs --styles coquette --icons a,b --size 72 --small --dark --out .preview/<you>-x-dark.png
node forge/tools/check.mjs --styles coquette a b
node forge/tools/preview-motion.mjs a,b --styles coquette --frames 7
COQ_DEBUG=1 node forge/tools/preview.mjs --styles coquette --icons a --size 200 --out .preview/<you>-zoom.png
```
