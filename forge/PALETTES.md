# with icons — per-icon colour palettes

Six styles paint with more than one colour: `duo` (tint), and the five palette styles `glass`, `kawaii`, `sticker`,
`pixel`, `retro` (every colour is a CSS variable `--with-<style>-<role>` with a default; see `forge/CONTRACT.md`).
Users can change **every** colour in the editor, and every icon ships **20–30 hand-picked palette suggestions**
written for that icon specifically.

## File: `forge/palettes/<name>.json`

```json
{
  "name": "pizza",
  "palettes": [
    { "id": "margherita", "name": "Margherita", "tags": ["true-to-life", "warm"],
      "colors": { "ink": "#3B1F12", "c1": "#F4B942", "c2": "#E2522F", "c3": "#4E9F3D", "c4": "#F7E3B5",
                  "tint": "#FFF1D6", "accent": "#E2522F", "shadow": "#5A2A14", "shine": "#FFFFFF", "edge": "#FFFDF7" } }
  ]
}
```

- `name` = filename = an icon in `forge/icons`. 20–30 palettes. `id` kebab-case, unique in the file. `name` ≤ 24 chars, evocative and plain
  ("Ripe tomato", "Midnight neon", "Sage & clay"). `tags`: 1–3 from the list below.
- `colors`: all ten roles, 6-digit hex `#RRGGBB`:

| role | what it paints | in styles |
|---|---|---|
| `ink` | outlines, line work, faces (sets `color` / currentColor) | all |
| `c1` | the icon's **main** colour — the object's body | duo tint, glass back, kawaii body, sticker 1st colour, pixel fill, retro 1st stripe, blueprint accent |
| `c2` `c3` `c4` | 2nd–4th colours, in order of prominence | sticker / kawaii extra parts, retro stripes 2–4 |
| `tint` | a light, airy tint (usually a pale version of c1) | glass front pane |
| `accent` | small pops | kawaii blush & sparkles, glass accent |
| `shadow` | deep shade for drop shadows | sticker shadow, retro offset shadow |
| `shine` | highlights | glass, kawaii, sticker, pixel specular |
| `edge` | sticker die-cut border / paper | sticker |

Variables are mapped to roles by `forge/lib/palette-map.mjs`. Families (kawaii fills, sticker candies, retro stripes) are matched
to `c1..c4` in the order they appear in the rendered icon, so **c1 is always the main body colour**.

## What a great set looks like (per icon)

1. **True to the object first** (4–8 palettes): real-world colours of *this* thing and its common variants
   (pizza: margherita, pepperoni, …; leaf: spring, summer, autumn, frost; heart: classic red, rose, candy; credit-card: gold, black, ocean, …).
   For abstract UI icons (arrow, settings, menu), use meanings and contexts instead (success green, warning amber, brand blues, "dark mode", …).
2. **Mood & trend sets** (the rest), adapted so they still flatter this icon: pastel, kawaii candy, Y2K, neon on dark, earthy/boho,
   70s retro sunset, vintage muted, monochrome (a single hue ramp), grayscale, ocean, forest, sunset, berry, citrus, luxe (gold/black),
   seasonal (spring/summer/autumn/winter/holiday), high-contrast accessible, corporate blues, Gen-Z dopamine brights.
3. Every palette is **harmonious** (analogous / complementary / triadic built on purpose), c1–c4 clearly distinct from each other,
   `ink` ≥ 4.5:1 contrast against `c1` *or* clearly outlines it, `shine` lighter than `c1`, `shadow` darker than `c1`, `tint` light.
4. Tag palettes that only read well on dark pages with `on-dark` (neon sets); everything else must read on white.
5. Order: best/most natural first. No duplicate-looking palettes. 20–30 total.

Tags: `true-to-life` `pastel` `vivid` `neon` `earthy` `retro` `vintage` `mono` `grayscale` `dark` `on-dark` `luxe` `seasonal`
`nature` `ocean` `sunset` `candy` `accessible` `corporate` `y2k`.

## Tools

```bash
node forge/tools/check-palettes.mjs pizza heart     # lint (count, hex, roles, tags, contrast warnings)
node forge/tools/preview-palettes.mjs pizza --size 48           # contact sheet: palettes x (duo glass kawaii sticker pixel retro)
node forge/tools/preview-palettes.mjs pizza --size 48 --dark
```
