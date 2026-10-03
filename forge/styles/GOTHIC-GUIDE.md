# Gothic: the design system for redrawers

This guide is for the agents who hand-draw Gothic icons in `_gothic-redraw-1..5.mjs`.
The engine (`_gothic-field/path/paint/prim/kit/auto/render.mjs`), the registry and the exemplars are
**frozen**. Build with what is listed here. If something is missing, ask the art director instead
of drawing around it.

Every icon renders three ways, first match wins:
1. `EXEMPLAR` in `_gothic-exemplars.mjs` (the art director's 20, do not redefine them),
2. `R` in your chunk `_gothic-redraw-N.mjs` (merged by `_gothic-redraws.mjs`),
3. the automatic composer `_gothic-auto.mjs` (every other icon, every Live icon, any future icon).

If a redraw throws or returns nothing, the icon silently falls back to the automatic composer.
Run with `GOTHIC_DEBUG=1` to make redraw errors throw while you work.

Previews (gitignored): `.preview/gothic-ad-ex*.png` (exemplars), `.preview/gothic-ad-auto-1..5.png`
and `-dark` (the automatic baseline of all 500, 100 per sheet, alphabetical).

## 1. What world class means here

A Gothic icon is **a fragment of a cathedral that is still the object**. Carved limestone and
stained glass in deep jewel colours, set in dark lead, lit from the upper-left by candlelight.

1. **The silhouette rules.** Fill the icon in one colour: you must still recognise the object at
   16px. Architecture *frames and ornaments* the object (a bell in a belfry arch, a lock with a
   quatrefoil escutcheon, a home as a chapel front); it never replaces it.
2. **Stone holds, glass glows, gilt moves.** Structure is stone. Mass (what fills a shape) is glass.
   Moving and precious parts (shackles, clappers, handles, hinges, badges' bezels) are gilded metal.
3. **One architectural idea per icon**, two at most: a pointed arch, a rose window, a quatrefoil,
   crenellations, a pinnacle, a lancet light, ashlar coursing, a wrought-iron curl, a fleur finial.
4. **Ornament is secondary.** It must disappear gracefully at 24px (it becomes texture) and be a
   joy at 256px. Never let tracery compete with the silhouette: leads are thin, medallions sit in
   the biggest pane, finials are small.
5. **Jewel colour, not rainbow.** One main glass colour per icon, one companion for a second pane,
   one medallion colour. Gilt and stone are neutral. Three glass colours at most.
6. **Same family, same build.** Files are glazed leaves with a gilded dog-ear; folders are an ashlar
   back with a glass front; calendars are stone tablets with lancet lights; badges are ruby
   roundels in a gilded bezel. Copy the exemplar of your family.

## 2. Palette roles (`--with-gothic-<role>`)

| role | default | use |
|---|---|---|
| `ink` | `#221A26` | lead cames, outlines, iron, recesses |
| `c1` | `#B3163B` | ruby glass: hearts, alerts, badges, fire, security, media |
| `c2` | `#2552B4` | sapphire glass: files, mail, devices, sky, water, the default |
| `c3` | `#E6A421` | gold glass (silver stain): light, stars, time, money, medallions |
| `c4` | `#1C8A5F` | emerald glass: nature, food, maps, success, travel |
| `tint` | `#DDD3C0` | limestone face |
| `edge` | `#8F806C` | stone shade bevel, mortar joints, iron chamfer |
| `accent` | `#C79A38` | gilded metal |
| `shadow` | `#140F18` | cast shadow, glass vignette, gilt shade (always at low opacity) |
| `shine` | `#FFF6DE` | candlelight: chamfers, glow, glints |

The family colour of an icon's main glass comes from its category (`g.mainRole(icon)`; see
`CAT` in `_gothic-auto.mjs`) with name overrides in `_gothic-tune.mjs`. Companion and medallion
colours: `g.COMPANION[role]`, `g.MEDAL[role]`. Use them so palettes and families stay coherent.

## 3. Measures (24u grid)

| measure | value |
|---|---|
| live area | x, y in 2..21.5 (the cast shadow falls 0.45 right, 0.75 down) |
| outline (lead) round every part | 0.42u, automatic (`outline: 0.25-0.35` for small inlays, `0` for none) |
| stone frame of a pane | 1.3-1.8u (`pane(..., { frame })`) |
| stone tube (open strokes) | 2-2.4u; mullion 1.2-1.3u (`thin: true`) |
| gilt bar / handle | 1.7-2.6u; fine gilt (steam, flags, curls) 0.9-1.2u |
| tracery lead | 0.34u (automatic) |
| ashlar course | h 2-2.4u, block w 3-3.4u |
| moat round a badge | 1-1.05u (`badge`, `slash`) |
| badge | r 4-4.5 at (17.5, 17.5) |
| smallest legible detail | 1u (a stud r 0.45-0.6 is texture, not meaning) |

## 4. Light and materials (automatic: the painter does it for you)

Light comes from the upper-left. Every part is painted: outline (ink), then its material:

- **stone**: limestone face, shade bevel lower-right (`edge`), lit chamfer upper-left (`shine`),
  then mortar joints: `ashlar: { h, w, x, y0, y1 }` lays courses on a slab, `ticks: [[p,q], ...]`
  cuts joints across a tube. `thin: true` for mullions and small pieces.
- **glass**: jewel face, dark vignette by the lead, light pooling upper-left, a glint (`wm-shine`),
  then tracery:
  - `'quarry'`: diamond quarries, some lighter, some darker, and a quatrefoil medallion in
    `medal` colour when the pane is big enough (`medallion: false` to skip it)
  - `'rose'`: spokes (`n`) round a medallion disc (`at: { c: [x, y], r }` fixes the centre)
  - `'lancet'`: vertical bars and transoms (`s` pitch)
  - `'medallion'`: only the quatrefoil (`lobes`)
  - `[polylines]`: your own leads, clipped to the pane
  - `'none'`
  Tune with `glow` (0.16), `dark` (0.3 vignette), `deep` (extra shade, for set-back panes), `glint: false`.
- **gilt**: gold face, shade bevel, bright chamfer, glint. `thin: true` for fine work.
- **iron**: dark face with a cool chamfer. Use sparingly: it vanishes on dark grounds unless a
  gilt or stone part outlines it.
- **recess**: a dark opening; `glow: 'c3'` lights it from within (doorways, keyholes).

Paint order is the list order, bottom to top. A later part's outline lies over the earlier faces as
a lead came, which is the whole stained-glass effect: put glass first, then the stone that frames it.

## 5. Composition rules

- **Glass inside stone.** `g.pane(shape, role, { frame, tracery })` is the default build of any
  closed object. A second pane (a flap, a header, a screen) goes on top with its own outline.
- **Architecture frames the object**: `lancet` arches (k 0.75 soft, 1 equilateral, 1.3 slender),
  `rose` windows for anything round (lenses, wheels, clocks, gears, eyes), `crenel` for lids and
  tops, `spire`/`pinnacle` for anything pointed, `foil` (3 trefoil, 4 quatrefoil) for seals, keyholes,
  medallions, centres.
- **Decoration** (finials, halos, belfry arches, steam curls, sparkles) is wrapped in `g.deco(...)`:
  class `wm-deco`, no cast shadow, it floats/twinkles gently on its own. 1-2 per icon.
- **Ground**: big architecture the object sits *in* (a belfry arch, a niche, an arcade) is wrapped in
  `g.ground(...)`: tagged `wm-shadow`, so it stays put while the object swings (never `deco`, which
  twinkles and scales).
- **Badges and slashes** (`plate: 'S'`): `g.badge('plus'|'minus'|'x'|'check'|'bang'|'dot'|null, cx, cy, r, role)`
  and `g.slash(x0, y0, x1, y1)` cut their own moat. Put them last.
- **No hard-coded hex, no strokes of your own.** Every colour is a role.

## 6. Motion tagging (forge/MOTION.md, Parts choreography)

Each part takes `plate`: `'K'` (default, the object), `'A'` (the moving part: shackle, clapper,
door, hands, lid, flap), `'S'` (badge/modifier), `'deco'` (`g.deco`), `'ground'` (`g.ground`). The painter tags every node:
cast shadow `wm-shadow`, glints `wm-shine`, everything else by its plate. Keep moving parts as their
own parts with `plate: 'A'` so motion presets can swing them. Check with
`node forge/tools/preview-motion.mjs <names> --styles gothic --frames 7`.

## 7. What to redraw by hand, what to leave automatic

The automatic composer is a good baseline: stone frame tubes with block joints, glass panes split by
the skeleton's inner lines, tracery in the biggest pane, gilt for outside A parts, ruby roundels for
badges. **Redraw** where architecture can make the object more itself, in this order:
1. icons where the automatic result is weak: pure line glyphs (arrows, chevrons, text tools,
   charts), very dense icons, icons whose fill hides the meaning;
2. hero icons of each family (the family head first, then its variants built the same way);
3. icons with an obvious gothic reading (castle, church, key, shield, crown, sword, candle, book,
   scroll, lantern, door, window, tower, bell-ring, moon, star, sun = rose window).
**Leave automatic** variants that the auto already renders cleanly (most framed objects with a
fill, `-plus/-minus/-x/-check` badge variants whose base is fine).

## 8. Writing a redraw

```js
// _gothic-redraw-N.mjs
export const R = {
  // a key: gilded bow pierced by a quatrefoil, gilded shank and wards
  key: (icon, g) => [
    g.gilt(g.union(g.seg(10.4, 13.6, 20, 4, 2.2), g.seg(17.2, 6.8, 19.6, 9.2, 2), g.seg(15.2, 8.8, 17, 10.6, 2))),
    ...g.pane(g.circle(7.6, 16.4, 5), 'c1', { frame: 1.6, tracery: 'none' }),
    g.recess(g.foil(7.6, 16.4, 1.9, 4), { glow: 'c3' }),
  ],
}
```

- Signature `(icon, g) => parts` (a list, nested lists are flattened, falsy entries skipped).
  `icon` is the prepared skeleton (name, category, paths, fills), useful for `g.mainRole(icon)` or
  to start from `g.auto(icon)` (the automatic parts) and add to them.
- **Shapes** return signed distance fields; booleans return new fields:
  `circle ellipse rect rr(x0,y0,x1,y1,r|[tl,tr,br,bl]) poly(pts) path(d) lancet(x0,top,x1,bottom,k)
  foil(cx,cy,R,n,rot) star(cx,cy,R,r,n) ngon crenel(x0,y0,x1,y1,n,mh) spire(cx,base,top,w)
  gear(cx,cy,r0,r1,n,duty) stroke(d|pts|[pts..], w) seg ring arc dot`,
  `union cut inter grow shrink rim(f,w) move flipX isEmpty`, point helpers `arcPts lancetPts circlePts curlPts`.
- **Parts**: `stone glass gilt iron recess lead shine cut deco ground plate(pl, parts)`.
- **Pieces**: `pane rose window(x0,top,x1,bottom,role,o) badge slash finial(cx,y,s) pinnacle studs(pts,r)
  curl(cx,cy,r,a0,turns,dir,w) glyph(kind,cx,cy,s,w) auto(icon)`.
- Draw on the 24 grid directly; snap to 0.1. Keep within 2..21.5.
- Budget: < 8 KB typical, 16 KB ceiling (the painter drops texture tiers above ~12 KB), < 150 ms.
  Many small panes and ashlar on big slabs cost the most bytes.

## 9. The 20 exemplars

| family | icon | construction |
|---|---|---|
| buildings | home | ashlar gable, gilt roof band, small rose window, glowing pointed door, fleur finial (deco) |
| hearts | heart | `pane` ruby, rose spokes round a gold medallion |
| alerts | bell | gilt bell and clapper (A) in a sapphire belfry lancet (`ground`) |
| mail | mail | stone rim, sapphire quarry body, stone flap line (A) over gold flap glass, ruby foil seal (S) |
| search | search | `rose` lens, iron collar and gilt handle (A) |
| settings | settings | `gear` pane in ruby, spokes, gilt hub with gold glass (A) |
| people | user | gold glass head, sapphire lancet robe with lancet bars, gilt halo (deco) |
| stars | star | gold glass star, leads from every point and notch, ruby heart |
| calendar | calendar | ashlar tablet, ruby header, six lancet lights (sapphire / gold), gilt rings (A) |
| devices | camera | crenellated top, ashlar body, rose-window lens, ruby flash jewel (A) |
| weather | cloud | sapphire pane, leads following the lobes |
| files | file | sapphire quarry leaf, gold medallion, gilt dog-ear (A) |
| folders | folder | ashlar back with tab, gold quarry front pane (A) |
| security | lock | gilt shackle (A), ruby glass case in a gilt frame with studs, gilt quatrefoil escutcheon, glowing keyhole |
| media | music-note | gilt stem and flag, ruby cabochon head |
| travel | rocket | ashlar spire body, rose porthole, gilt fins (A), gold flame (deco) |
| food | coffee | ruby pane cup, gilt band and studs, gilt handle (A), gilt steam (deco) |
| actions | trash | crenellated stone lid with gilt handle (A), emerald pane body with lancet leads |
| arrows | arrow-right | gilt shaft with iron collar, ogival gilt head pierced by a trefoil |
| status | check | emerald glass check in a carved stone surround |

## 10. Checklist per icon

1. One-colour silhouette reads at 16px; side by side with `line` the meaning matches.
2. One main glass colour (+ companion + medallion at most), stone and gilt neutral.
3. One or two architectural ideas, decoration wrapped in `g.deco`.
4. Moving parts are separate parts with `plate: 'A'`; badges last with their moat.
5. Light and `--dark`, 72 / 24 / 16px; size < 16 KB.

```bash
node forge/tools/preview.mjs --styles gothic,line --icons a,b --size 72 --small --out .preview/<you>-x.png
node forge/tools/preview.mjs --styles gothic --icons a,b --size 72 --small --dark --out .preview/<you>-x-dark.png
node forge/tools/preview.mjs --styles gothic --icons a,b --size 240 --out .preview/<you>-x-big.png
node forge/tools/check.mjs --styles gothic a b
node forge/tools/preview-motion.mjs a,b --styles gothic --frames 7
```
