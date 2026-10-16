# with icons — Loaders

**50 animated loaders** (20 common, 20 creative, 10 festival) that ship in **every style**, plus **morph sequences**:
any chain of library icons (or loaders) that keep turning into one another while something loads.

A loader is a few **parts**. Each part is a normal skeleton (`paths` with plates K/A/S, `fills`, `cutouts`, exactly the
format in `forge/CONTRACT.md`) plus a **motion**. Every style renderer draws each part exactly as it draws an icon, the
compiler stacks the parts in one `<svg>` and animates them with a few lines of embedded CSS (transform + opacity
keyframes). So a loader:

- is **one self-contained SVG file**: no script, no font, no runtime. It animates as `<img src>`, inline `<svg>`, CSS
  `background`/`mask`, in emails that allow SVG, in any framework;
- animates **only transform and opacity** (compositor-only, 60 fps, no layout or paint thrash);
- honours `prefers-reduced-motion` (it slows to a calm 2.4x, it never freezes: a frozen loader reads as a hang);
- takes the ink from `currentColor`, the style colours from `--with-<style>-<role>`, the speed from `--wl-speed`
  (2 = twice as fast) and `--wl-state: paused` to pause, all from any ancestor when inline.

## Spec: `forge/loaders/<name>.mjs`

```js
import { circle, solid, stroke, polar, icon, show, spin, E } from './_kit.mjs'
export default {
  name: 'spinner-dots', title: 'Dot spinner', group: 'common',          // common | creative | festival
  description: 'Eight dots on a ring: a bright head runs clockwise while the tail fades.',   // <= 160 chars
  intent: 'the everyday activity indicator, softer and rounder',             // <= 80 chars: what the motion SAYS
  aliases: ['activity-indicator', 'dots-spinner', 'ios-spinner'],            // >= 3, what people type
  tags: ['loading', 'spinner'], synonyms: ['please wait', 'busy'],
  duration: 1,                       // seconds per cycle (0.6..8)
  morph: ['sparkles', 'zap'],        // optional: the library icons the loader turns into (shown on the site)
  parts: [                           // or parts() returning the array
    {
      skel: solid(circle(12, 4.5, 1.6)),            // any skeleton; icon('rocket', { s: 0.5, x: 2 }) borrows a library icon
      motion: {
        origin: [12, 4.5],                          // pivot for rotate / scale, 24-grid units
        keys: [[0, { s: 1.15, o: 1, e: E.out }], [0.85, { s: 0.45, o: 0.18 }], [1, { s: 1.15, o: 1 }]],
        lag: 0,                                     // 0..1 of the cycle this part runs behind (stagger)
        rep: 1,                                     // loops of this part per cycle
      },
      copies: [{ x: 0, y: 0, lag: 0 }, { x: 5.3, y: 2.2, lag: 0.125 }],   // optional: the part drawn ONCE, placed many
    },                                                                     // times (tiny files), each with its own lag
  ],
}
```

**Keys** `[t, { x, y, r, s, sx, sy, o, e }]`: `t` in 0..1 of the cycle; `x y` translate (grid units), `r` rotate (deg,
about `origin`), `s` (or `sx sy`) scale about `origin`, `o` opacity, `e` the easing of the segment that **starts** at
this key (`E.linear E.ease E.in E.out E.inOut E.expoOut E.expoIn E.spring E.anticipate E.gravity E.lift`, or any CSS
timing function). Missing properties carry forward from the previous key; keys at 0 and 1 are added if missing.
A part without `motion` is still (a track, a frame, a planet).

**Kit** (`forge/loaders/_kit.mjs`): `circle arc line dot rr poly star heart drop polar xform` (geometry),
`solid stroke ring merge icon` (skeleton parts), `spin pulse blink bob keysAlong show lagOf rng E` (motion).
`show(i, n, { fade, enter, exit })` builds a morph step: part i of n holds the stage for its slot and blooms in / folds
out (the shape-shift and icon-morph loaders). Group helpers may live in `forge/loaders/_<group>.mjs`.

## How styles draw loaders (`forge/lib/loader-compile.mjs`)

- Each part is drawn through the style separately. Parts of one loader share its `name` (one consistent colourway);
  a part made with `icon(name)` keeps that icon's name, so it looks exactly like the library icon in that style.
- **Chrome** (what a style draws whatever the glyph: bento and dock tiles, corner sparkles) is found by drawing two
  probes; it is drawn once, still, under the moving parts. On tile styles (`STAGE`: bento, dock) the glyph sits scaled
  on the tile, so origins and moves are mapped onto the tile automatically.
- Pixel art moves in steps (10 fps) rather than gliding.
- **Names decide looks.** Some styles draw an icon by its name (hand art in `forge/hand/`, per-icon sprites and colour
  tuning). A part keeps an icon's name only when its paths ARE that icon unchanged (`honestName`); a piece, an edited copy
  or a transformed `icon(name, { s, x, y })` draws under a neutral `wl-` name, so its own geometry always shows. Parts
  default to `wl-<loader>`. To keep an icon's own look and colours, borrow it unchanged and size / place it with motion keys.
- **soft3d** fits every icon to the canvas; loader parts (category `loader`) share one fixed frame instead, so parts
  drawn one by one line up.
- `copies` share one animation rule; each copy only adds its delay (`lag: 0` on a copy means "no lag", not "the part's").
- Known style character (not bugs): coquette turns small circles into bows, blueprint adds construction circles,
  kawaii / sticker / valentine / halloween add small ornaments per part, lighting and offset shadows (brutal, clay,
  soft3d) turn with rotating parts, and pixel art is resampled while it rotates. Keep many-part loaders readable anyway.
- Ids start with `wg-` and carry the loader + style; inline runtimes suffix them per instance.

## Motion design rules (the quality bar)

1. **Seamless loop.** The last key equals the first (or the part is invisible at both ends). No visible seam, ever.
2. **One idea, read at 16 px.** The motion must read at 16-24 px in line *and* in the heaviest style. Big, simple
   moves; detail is a bonus at 64 px.
3. **Ease like physical things.** Linear only for constant rotation. Things fall with `E.gravity`, rise with `E.lift`,
   land with a squash (`sy` 0.8, `sx` 1.15 for a frame), bloom with `E.spring`. Overlap: parts start at different times
   (`lag`), never all at once.
4. **Calm enough to watch for a minute.** Cycles of 0.8-2 s for spinners, 2-5 s for stories and morphs. No strobing
   (opacity never flashes more than 3 times a second), no violent shake.
5. **Centred mass.** The drawing stays inside the live area 2..22 at every moment (scale overshoots included), and its
   visual centre does not drift.
6. **Small.** Use `copies` for repeated parts. Line output should be ~1-3 KB, rich styles < 24 KB (hard cap 48 KB; morph presets, which hold 3-4 whole icons, 64 KB, about 12 KB gzipped).
7. **Original.** Never copy path data or choreography from another library (Lucide, SpinKit, Loading.io, CSS-loaders…).

## Morph sequences (runtime + Loader Studio)

`@withicons/loaders` composes any list of library icons (in any style) into one looping SVG at runtime:
`morph(['file', 'cloud-upload', 'check-circle'], { style: 'line', effect: 'bloom', hold: 0.9 })`. Effects: `bloom`
(fold into a dot, bloom out), `spin`, `flip`, `slide-up`, `slide-left`, `blur`, `drop`, `zoom`. Presets live in
`forge/loaders/_morphs.mjs` (name, title, icons, effect) and are pre-rendered like loaders.

## Tools

```bash
node forge/tools/check-loaders.mjs [names] [--styles line,glass]   # validate, compile every style, size, determinism
node forge/tools/preview-loaders.mjs --loaders orbit,spinner --styles line,glass,pixel --frames 8 --size 56 [--dark]
node forge/tools/preview-loaders.mjs --loaders all --styles all --grid --t 0.3   # one frame of everything
```
Output: `node forge/lib/emit-loaders.mjs` → `packages/loaders/dist/**` (`@withicons/loaders`) and the site data
(`site/data/loaders*.js`) used by the Loader Studio (`site/loaders.html`).
