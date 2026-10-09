# @withicons/vue

734 icons x 34 styles for Vue 3. Tree-shakable, typed, `currentColor` by default.

```bash
npm i @withicons/vue
```

```vue
<script setup>
import { Home, Search } from '@withicons/vue'          // line (default style)
import { Home as HomeSolid } from '@withicons/vue/solid'
</script>

<template>
  <Home />
  <Search :size="20" :stroke-width="1.5" class="text-slate-500" />
  <HomeSolid :size="32" color="#e11d48" title="Home" />
</template>
```

- **One rule:** the root is the **line** style, every other style is a subpath (`@withicons/vue/solid`, `@withicons/vue/duo`, ...).
  Import the icons you use by name from the style you want. That is all.
- Fast everywhere: each style is a single module, so the root or a style subpath loads that one style (never all 34),
  quickly in Node, SSR, Jest and Vitest, and bundlers keep only the icons you import. No bundler config needed
  (no `optimizePackageImports`, no deep imports).
- Every icon is exported twice: `Home` and `HomeIcon`. Names are the PascalCase of the kebab-case icon name (`arrow-right` -> `ArrowRight`).
- Deep imports keep working: `@withicons/vue/icons/home`, `@withicons/vue/solid/icons/home`.
- No bundler (an ESM CDN in a `<script type="module">`)? Ask for the icons you use, so the CDN tree-shakes the style
  down to them: `https://esm.sh/@withicons/vue@0.3.1?exports=Home,Search` (line),
  `https://esm.sh/@withicons/vue@0.3.1/solid?exports=Home`. A bare style URL is every icon of that style (megabytes).

## Props

| prop | type | default | notes |
|---|---|---|---|
| `size` | `number \| string` | `24` | width and height |
| `color` | `string` | `'currentColor'` | inherits the CSS text color by default |
| `strokeWidth` | `number \| string` | the style's own: line and duo `1.75`, blueprint `1.25`, sketch `1.3`, kawaii `2.2` | only these live-stroke styles; the others ignore it |
| `absoluteStrokeWidth` | `boolean` | `false` | keep the stroke width constant in px at any size |
| `title` | `string` | — | renders `<title>` and sets `role="img"`; otherwise `aria-hidden="true"` |
| `class` | `string` | — | appended to `withi withi-<name>` |
| ...rest | | | spread onto the `<svg>` |

## Styles

| style | import | group | look |
|---|---|---|---|
| `line` | `@withicons/vue` | Essentials | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/vue/solid` | Essentials | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/vue/duo` | Essentials | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo and the accent detail with --with-duo-accent. |
| `gloss` | `@withicons/vue/gloss` | Playful | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/vue/engrave` | Artistic | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/vue/blueprint` | Artistic | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/vue/sketch` | Artistic | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |
| `glass` | `@withicons/vue/glass` | 3D & glass | Soft frosted glass: a calm colour glows through a translucent pane with a fine light rim and a gentle shadow. |
| `kawaii` | `@withicons/vue/kawaii` | Playful | Chubby pastel shapes with a soft thick outline and a tiny blushing face: the cutest icons on the web. |
| `sticker` | `@withicons/vue/sticker` | Playful | Die-cut vinyl stickers in candy colours: bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two. |
| `pixel` | `@withicons/vue/pixel` | Playful | Hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 16, 32 and 48 px on 1x, 2x and 3x screens. |
| `retro` | `@withicons/vue/retro` | Playful | Warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch. |
| `luxe` | `@withicons/vue/luxe` | 3D & glass | Premium multi-layered 3D: jewel enamel, polished gold and ruby set in deep extruded slabs, with soft shadows, lit chamfers and crisp highlights. |
| `bauhaus` | `@withicons/vue/bauhaus` | Product & brand | Bauhaus compositions in miniature: circles, arches, half and quarter discs and pills in red, yellow, blue and black. |
| `skeuo` | `@withicons/vue/skeuo` | 3D & glass | Skeuomorphic: every icon is a tactile object in a real material (paper, leather, metal, brass, wood, glass), lit from above with soft shadows, inner walls and debossed detail. |
| `anime` | `@withicons/vue/anime` | Artistic | Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow tone, bright specular shine and the odd sparkle, in sky blue, sakura pink and warm gold. |
| `gothic` | `@withicons/vue/gothic` | Artistic | Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery and rose windows. |
| `pastel` | `@withicons/vue/pastel` | Playful | Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth. |
| `coquette` | `@withicons/vue/coquette` | Artistic | Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold. |
| `plush` | `@withicons/vue/plush` | Playful | Stuffed-toy icons sewn from felt: puffy panels, dark piping, running stitches, buttons and embroidered details. |
| `clay` | `@withicons/vue/clay` | 3D & glass | Soft faux-3D clay: plump, inflated objects of matte clay and soft vinyl, lit from above with a visible thickness, a soft ground shadow and glossy candy badges. |
| `bento` | `@withicons/vue/bento` | Product & brand | Feature-grid tiles: each glyph sits on a soft gradient squircle with a hairline highlight, in a crisp duotone with a gentle lift. |
| `suite` | `@withicons/vue/suite` | Essentials | Office-suite colour icons: layered flat planes in calm blues and violets with gentle gradients, folded corners and bright badges. |
| `dock` | `@withicons/vue/dock` | Product & brand | App-icon tiles: a glossy continuous-corner squircle in a rich two-tone colour carrying a raised, softly shaded glyph, so a set of icons looks like a colourful dock. |
| `liquid` | `@withicons/vue/liquid` | 3D & glass | Clear, thick, refractive glass: a faintly tinted body with a crisp specular rim, a deep refraction edge, a soft lens highlight and a coloured caustic glow. |
| `chrome` | `@withicons/vue/chrome` | 3D & glass | Liquid metal Y2K chrome: every icon an inflated, polished object with a mirror horizon, bevelled rim, crisp glint and soft shadow. |
| `soft3d` | `@withicons/vue/soft3d` | 3D & glass | Soft studio-lit 3D: real objects in a gentle 3/4 view with volume, rounded bevels and natural materials, symbols as rounded front-facing forms, people as soft 3D busts. |
| `brutal` | `@withicons/vue/brutal` | Product & brand | Neo-brutalism: thick black outlines, flat loud colours and a hard offset shadow, like the boldest startup sites. |
| `utsav` | `@withicons/vue/utsav` | Holidays | Indian festive craft: warm marigold forms with a plum outline, a fine gold inner line, rangoli dot-work, rosette badges and a tiny diya flame. |
| `rangoli` | `@withicons/vue/rangoli` | Holidays | Indian festival icons for Diwali, Durga Puja and Holi: clean objects in a warm festive glow, each with one motif of its own (rangoli petals, lotus, toran, marigold, diya flame or gulal). |
| `halloween` | `@withicons/vue/halloween` | Holidays | Spooky-cute Halloween: chunky pumpkin, witch-purple, midnight and bone-white forms with a dark outline, carved details glowing with candlelight, slime goo dripping from broad edges, peeking eyes, and a tiny bat, spider or moon. |
| `christmas` | `@withicons/vue/christmas` | Holidays | Cosy holiday icons: cranberry, pine and gold forms with a soft warm light, a snow cap resting on every top edge, candy-cane stripes and a sprig of holly. |
| `lunar` | `@withicons/vue/lunar` | Holidays | Lunar New Year: lucky red lacquer with a gold-foil rim, gold and jade parts, paper-cut cloud scrolls, silk tassels and plum blossoms. |
| `valentine` | `@withicons/vue/valentine` | Holidays | Cute Valentine's stickers: pink-to-red cartoon shapes in a warm berry outline, a soft shine, polka dots and sprinkles, tiny blushing faces and little floating hearts. |

Duo's tint can be recoloured with the CSS variable `--with-duo`.

### Palette styles

`glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `brutal`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` paint a default multi-colour palette. The main ink stays `currentColor`
(so `color` still recolours the outline; `sticker` draws its bold outline with `--with-sticker-ink` instead, `pixel` draws its bold outline with `--with-pixel-ink` instead, `luxe` draws its bold outline with `--with-luxe-ink` instead, `skeuo` draws its bold outline with `--with-skeuo-ink` instead, `anime` draws its bold outline with `--with-anime-ink` instead, `gothic` draws its bold outline with `--with-gothic-ink` instead, `pastel` draws its bold outline with `--with-pastel-ink` instead, `coquette` draws its bold outline with `--with-coquette-ink` instead, `plush` draws its bold outline with `--with-plush-ink` instead, `clay` draws its bold outline with `--with-clay-ink` instead, `bento` draws its bold outline with `--with-bento-ink` instead, `suite` draws its bold outline with `--with-suite-ink` instead, `dock` draws its bold outline with `--with-dock-ink` instead, `liquid` draws its bold outline with `--with-liquid-ink` instead, `chrome` draws its bold outline with `--with-chrome-ink` instead, `soft3d` draws its bold outline with `--with-soft3d-ink` instead, `utsav` draws its bold outline with `--with-utsav-ink` instead, `rangoli` draws its bold outline with `--with-rangoli-ink` instead, `halloween` draws its bold outline with `--with-halloween-ink` instead, `christmas` draws its bold outline with `--with-christmas-ink` instead, `lunar` draws its bold outline with `--with-lunar-ink` instead, `valentine` draws its bold outline with `--with-valentine-ink` instead) and every other colour is a CSS custom property with a built-in default,
so you can re-theme a page, a section or one icon without touching the SVG:

```css
.brand { --with-kawaii-c1: #c4b5fd; --with-retro-1: #fde047; }
```

| style | variables (default) |
|---|---|
| `glass` | `--with-glass-accent` #F2679E, `--with-glass-back` #7484FF, `--with-glass-c1` #F07CA2, `--with-glass-c2` #E2577F, `--with-glass-c3` #F5B82E, `--with-glass-c4` #FF8A3D, `--with-glass-etch` #3E3A8C, `--with-glass-frost` #FFFFFF, `--with-glass-pane` #E4E8FF, `--with-glass-shadow` #6A45D6, `--with-glass-shine` #FFFFFF |
| `kawaii` | `--with-kawaii-accent` #FF5C9A, `--with-kawaii-blush` #FF6F9C, `--with-kawaii-c1` #BB9275, `--with-kawaii-c2` #504948, `--with-kawaii-c4` #85CDC5, `--with-kawaii-face` currentColor, `--with-kawaii-fill-1` #FF6FA5, `--with-kawaii-fill-2` #FF9A66, `--with-kawaii-fill-3` #FFD23A, `--with-kawaii-fill-4` #45D99A, `--with-kawaii-fill-5` #5AB4FF, `--with-kawaii-fill-6` #A98BFF, `--with-kawaii-shine` #FFFFFF, `--with-kawaii-sparkle` #FFB627 |
| `sticker` | `--with-sticker-accent` #FF6FB5, `--with-sticker-bubblegum` #FF6FB5, `--with-sticker-c1` #A96539, `--with-sticker-c2` #2A2120, `--with-sticker-c4` #22A495, `--with-sticker-edge` #FFFFFF, `--with-sticker-grape` #A98BFF, `--with-sticker-ink` #1D1530, `--with-sticker-lemon` #FFD43B, `--with-sticker-mint` #3FDDA4, `--with-sticker-peach` #FF9563, `--with-sticker-shadow` #1D1530, `--with-sticker-shine` #FFFFFF, `--with-sticker-sky` #5BC6FF |
| `pixel` | `--with-pixel-accent` #FF8A1F, `--with-pixel-c2` #E53935, `--with-pixel-c3` #B71C1C, `--with-pixel-fill` currentColor, `--with-pixel-ink` #23263A, `--with-pixel-shadow` #7A4A2A, `--with-pixel-shine` #FFFFFF, `--with-pixel-tint` #B9D5F3 |
| `retro` | `--with-retro-1` #F4B53F, `--with-retro-2` #EF7D2D, `--with-retro-3` #DE4B3A, `--with-retro-4` #178A86, `--with-retro-cream` #FFF3D9, `--with-retro-letter` #2A160E, `--with-retro-shadow` #6B3323, `--with-retro-tint` #FFF3D9 |
| `luxe` | `--with-luxe-accent` #E3AE47, `--with-luxe-c1` #2039B4, `--with-luxe-c2` #C0174F, `--with-luxe-c3` #16206E, `--with-luxe-c4` #7B4A12, `--with-luxe-edge` #9CC2FF, `--with-luxe-ink` #0B1033, `--with-luxe-shadow` #0A0B26, `--with-luxe-shine` #FFFFFF, `--with-luxe-tint` #FFEFC4 |
| `bauhaus` | `--with-bauhaus-accent` #2E7A5E, `--with-bauhaus-c1` #E0412E, `--with-bauhaus-c2` #F2B33D, `--with-bauhaus-c3` #2A6BC2, `--with-bauhaus-c4` #2A6BC2, `--with-bauhaus-ink` currentColor, `--with-bauhaus-shadow` #151515, `--with-bauhaus-tint` #F3EBDD |
| `skeuo` | `--with-skeuo-accent` #F1CF98, `--with-skeuo-c1` #5560E0, `--with-skeuo-c2` #BFC7D0, `--with-skeuo-c3` #E0483A, `--with-skeuo-c4` #1E2B3B, `--with-skeuo-edge` currentColor, `--with-skeuo-ink` #22160F, `--with-skeuo-shadow` #15110D, `--with-skeuo-shine` #FFFFFF, `--with-skeuo-tint` #FFFFFF |
| `anime` | `--with-anime-accent` #FF5D78, `--with-anime-c1` #4BA8F5, `--with-anime-c2` #FF8DB6, `--with-anime-c3` #FFC740, `--with-anime-c4` #5FCF8C, `--with-anime-edge` #BFE6FF, `--with-anime-ink` #2B2148, `--with-anime-shadow` #4B2C8F, `--with-anime-shine` #FFFFFF, `--with-anime-tint` #FFF5EC |
| `gothic` | `--with-gothic-accent` #C79A38, `--with-gothic-c1` #B3163B, `--with-gothic-c2` #2552B4, `--with-gothic-c3` #E6A421, `--with-gothic-c4` #1C8A5F, `--with-gothic-edge` #837A6F, `--with-gothic-ink` #221A26, `--with-gothic-shadow` #140F18, `--with-gothic-shine` #FFF6DE, `--with-gothic-tint` #D3CDC0 |
| `pastel` | `--with-pastel-accent` #FFC3D7, `--with-pastel-c1` #CDBBF7, `--with-pastel-c2` #CDBBF7, `--with-pastel-c3` #FFE29C, `--with-pastel-c4` #ABE6CD, `--with-pastel-edge` #B6A1EF, `--with-pastel-ink` #6A55B8, `--with-pastel-shadow` #9E87E6, `--with-pastel-shine` #FFFFFF, `--with-pastel-tint` #ECE5FC |
| `coquette` | `--with-coquette-accent` #D9A45B, `--with-coquette-c1` #F8BCCB, `--with-coquette-c2` #EC8DA6, `--with-coquette-c3` #D7385F, `--with-coquette-c4` #FCEADD, `--with-coquette-edge` #FFFBF6, `--with-coquette-ink` #7E2443, `--with-coquette-shadow` #A8345C, `--with-coquette-shine` #FFFFFF, `--with-coquette-tint` #FFE4EB |
| `plush` | `--with-plush-accent` #FF8DB4, `--with-plush-c1` #F4695E, `--with-plush-c2` #FFC53D, `--with-plush-c3` #4C9FE6, `--with-plush-c4` #4FBF8A, `--with-plush-edge` #FFF9F0, `--with-plush-ink` #4A2C3D, `--with-plush-shadow` #3A1E46, `--with-plush-shine` #FFFFFF, `--with-plush-tint` #FFF0D9 |
| `clay` | `--with-clay-accent` #E89A1C, `--with-clay-c1` #7B6CFF, `--with-clay-c2` #FFB257, `--with-clay-c3` #FF5C97, `--with-clay-c4` #2CC0A8, `--with-clay-ink` #2A1D5C, `--with-clay-shadow` #24166B, `--with-clay-shine` #FFFFFF, `--with-clay-tint` #E3DEFF |
| `bento` | `--with-bento-accent` #F43F75, `--with-bento-c1` #6366F1, `--with-bento-c2` #2A2120, `--with-bento-c3` #6366F1, `--with-bento-c4` #6366F1, `--with-bento-edge` #EEF0FF, `--with-bento-ink` #1E1B4B, `--with-bento-shadow` #312E81, `--with-bento-shine` #FFFFFF, `--with-bento-tint` #EEF0FF |
| `suite` | `--with-suite-accent` #FF7A3D, `--with-suite-c1` #3478F6, `--with-suite-c2` #7B61F0, `--with-suite-c3` #15A5B8, `--with-suite-c4` #5C9DFF, `--with-suite-edge` #F2F7FF, `--with-suite-ink` #1F4FB8, `--with-suite-shadow` #0B1E5B, `--with-suite-shine` #FFFFFF, `--with-suite-tint` #E4EEFF |
| `dock` | `--with-dock-accent` #FF3B30, `--with-dock-c1` #2F7DF6, `--with-dock-c2` #FFC94A, `--with-dock-c4` #E2E2FF, `--with-dock-ink` #14182B, `--with-dock-shadow` #1545C2, `--with-dock-shine` #FFFFFF, `--with-dock-tint` #DCE8FF |
| `liquid` | `--with-liquid-accent` #FF5F8F, `--with-liquid-c1` #4A9DFF, `--with-liquid-c2` #A77BFF, `--with-liquid-c3` #1C3F9E, `--with-liquid-c4` #FF7EC1, `--with-liquid-edge` #B9E6FF, `--with-liquid-ink` #2A1414, `--with-liquid-shadow` #0C1A3A, `--with-liquid-shine` #FFFFFF, `--with-liquid-tint` #FFE3B0 |
| `chrome` | `--with-chrome-accent` #FF3E9E, `--with-chrome-c1` #8794AA, `--with-chrome-c2` #5E6A82, `--with-chrome-c3` #3E4556, `--with-chrome-c4` #CDB9A4, `--with-chrome-edge` #F4F7FC, `--with-chrome-ink` #10131B, `--with-chrome-shadow` #1A1E2A, `--with-chrome-shine` #FFFFFF, `--with-chrome-tint` #DCE5F2 |
| `soft3d` | `--with-soft3d-accent` #FF6A4D, `--with-soft3d-c1` #E5483F, `--with-soft3d-c2` #EEF1F5, `--with-soft3d-c3` #3A404C, `--with-soft3d-c4` #BFC7D2, `--with-soft3d-edge` #FFF8EE, `--with-soft3d-ink` #2A2226, `--with-soft3d-shadow` #1D2130, `--with-soft3d-shine` #FFFFFF, `--with-soft3d-tint` #A9D8F2 |
| `brutal` | `--with-brutal-accent` #FF8A3D, `--with-brutal-c1` #FFD23F, `--with-brutal-c2` #FF6BA8, `--with-brutal-c3` #4D7CFE, `--with-brutal-c4` #3DDC97, `--with-brutal-ink` currentColor, `--with-brutal-shine` #FFFFFF, `--with-brutal-tint` #DDB89C |
| `utsav` | `--with-utsav-accent` #D4A017, `--with-utsav-c1` #F59E0B, `--with-utsav-c2` #F97316, `--with-utsav-c3` #E11D74, `--with-utsav-c4` #0F766E, `--with-utsav-edge` #F4C95D, `--with-utsav-ink` #3B0A45, `--with-utsav-shadow` #5E3518, `--with-utsav-shine` #FFF4DC, `--with-utsav-tint` #E8B48C |
| `rangoli` | `--with-rangoli-accent` #FFC21A, `--with-rangoli-c1` #FFB21F, `--with-rangoli-c2` #F2462C, `--with-rangoli-c3` #E81F7A, `--with-rangoli-c4` #7B2FE0, `--with-rangoli-edge` #7B2FE0, `--with-rangoli-ink` #2B1660, `--with-rangoli-shadow` #5A1240, `--with-rangoli-shine` #FFFFFF, `--with-rangoli-tint` #FFF3D8 |
| `halloween` | `--with-halloween-accent` #FFB52E, `--with-halloween-c1` #FF9F2E, `--with-halloween-c2` #E5530F, `--with-halloween-c3` #8B55E0, `--with-halloween-c4` #86D13A, `--with-halloween-edge` #7344C9, `--with-halloween-ink` #1D1029, `--with-halloween-shadow` #2A1642, `--with-halloween-shine` #FFF6E2, `--with-halloween-tint` #FFF1B8 |
| `christmas` | `--with-christmas-accent` #F4C24D, `--with-christmas-c1` #C8203A, `--with-christmas-c2` #1F6E46, `--with-christmas-c3` #E2A93B, `--with-christmas-c4` #FFF5E6, `--with-christmas-edge` #FFB347, `--with-christmas-ink` #3A0F17, `--with-christmas-shadow` #4A0716, `--with-christmas-shine` #FFFFFF, `--with-christmas-tint` #C9DAEC |
| `lunar` | `--with-lunar-accent` #E8B030, `--with-lunar-c1` #E8282E, `--with-lunar-c2` #B0101E, `--with-lunar-c3` #11896A, `--with-lunar-c4` #E8B030, `--with-lunar-edge` #A8700F, `--with-lunar-ink` #4A0A10, `--with-lunar-shadow` #5E3518, `--with-lunar-shine` #FFEBA6, `--with-lunar-tint` #FFF1D6 |
| `valentine` | `--with-valentine-accent` #5DB86A, `--with-valentine-c1` #FF6B8E, `--with-valentine-c2` #E8304F, `--with-valentine-c3` #8B4A36, `--with-valentine-c4` #FFF3E3, `--with-valentine-edge` #FF8FB0, `--with-valentine-ink` #6A1B3A, `--with-valentine-shadow` #A3163F, `--with-valentine-shine` #FFFFFF, `--with-valentine-tint` #F5C451 |

Inline SVG (components, `<with-icon>`, sprites, IconNode data) keeps the variables. Standalone `.svg` files have them
flattened to the defaults, because `<img>`, design tools and rasterizers cannot see CSS.

`glass`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` draw real SVG gradients: a `<defs>` of `linearGradient` / `radialGradient` whose stop
colours are the same CSS variables, so palettes and `--with-*` overrides recolour them too. Every inline copy gets its own
gradient ids (components, `<with-icon>`, `with-icons.js`), so one page can show the same icon many times in different
colours. When you inline SVG strings yourself, pass `idSuffix` (`toSvg` in `@withicons/core`, `svg` / `loadSvg` in
`@withicons/web`, `render` in `@withicons/dynamic`) with a different value per copy. Files and `<img>` need nothing.

### Change every colour in Vue

The palette variables are inherited CSS custom properties, so a `:style` binding (or any CSS rule) re-themes one icon,
and `color` sets the outline:

```vue
<script setup>
import { Pizza } from '@withicons/vue/retro'
</script>

<template>
  <Pizza :size="48" color="#3b1f12"
         :style="{ '--with-retro-1': '#f4b942', '--with-retro-2': '#d9412b', '--with-retro-3': '#2f8f4e' }" />
</template>
```

Every icon also has 20-30 colour palettes picked for it in [`@withicons/core`](https://www.npmjs.com/package/@withicons/core)
(`npm i @withicons/core`). Every component carries its drawing as `iconNode`, and `applyPalette` maps a palette onto
the variables that icon uses, in any style:

```vue
<script setup>
import { Pizza } from '@withicons/vue/retro'
import pizza from '@withicons/core/palettes/pizza.json'
import { applyPalette } from '@withicons/core/palettes/palette-map.js'

const looks = pizza.palettes.map(p => ({ id: p.id, name: p.name, ...applyPalette(JSON.stringify(Pizza.iconNode), p.colors) }))
</script>

<template>
  <Pizza v-for="p in looks" :key="p.id" :size="40" :style="p.vars" :color="p.color ?? undefined" :title="p.name" />
</template>
```

## Animation (optional)

Animations ship separately in [`@withicons/motion`](https://www.npmjs.com/package/@withicons/motion), so icons never pay for them.
They work with every style and every package because they animate the element that holds the icon:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">
<!-- each animated icon's own motion: one small file per icon (icons.css has all of them) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/icons/bell.css">

<span class="wm wm-loop" data-wm="bell"><!-- any bell icon --></span>          <!-- continuous -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>  <!-- on hover/focus -->
<span class="wm-swap wm-fx-flip"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>  <!-- icon to icon -->
```

`prefers-reduced-motion` turns every animation off. JS API: `import { motion, swap, motionFor } from '@withicons/motion'`.

### Animation in Vue

Import the two stylesheets once (for example in `main.js`), then wrap the icon. `motionAttrs` builds the wrapper's
attributes for you, and works in SSR (Nuxt) because it only returns classes and a style string:

```vue
<script setup>
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { motionAttrs } from '@withicons/motion'
import { Bell, Loader } from '@withicons/vue'
</script>

<template>
  <span class="wm wm-loop" data-wm="bell"><Bell /></span>
  <button class="wm-trigger"><span v-bind="motionAttrs('bell', { trigger: 'hover' })"><Bell /></span> Alerts</button>
  <span v-bind="motionAttrs(null, { preset: 'spin', duration: 1.2 })" class="wm-force"><Loader title="Loading" /></span>
</template>
```

For the JS-only triggers (`inview`, a hover that always finishes) call `motion(el, name, options)` from `@withicons/motion`
in `onMounted` on a template ref, and `destroy()` the handle in `onBeforeUnmount`.

### Right-to-left

Icons are drawn for left-to-right text. In Arabic, Hebrew, Persian or Urdu layouts, mirror the directional ones (arrows,
chevrons, undo/redo, reply, send, log-in/out) with a class; symmetric icons and logos stay as they are:

```css
[dir="rtl"] .with-rtl { transform: scaleX(-1); }   /* every browser */
.with-rtl:dir(rtl) { transform: scaleX(-1); }      /* also follows inherited direction (Chrome 120+, Safari 16.4+, Firefox) */
```

```vue
<ChevronRight class="with-rtl" />

<!-- animated: mirror the icon, and point nudge / pass the other way on the wrapper -->
<span class="wm wm-hover" data-wm="arrow-right" :style="{ '--wm-dx': isRtl ? -1 : 1 }">
  <ArrowRight class="with-rtl" />
</span>
```

## Generic icon (dynamic names)

```vue
<script setup>
import { Icon } from '@withicons/vue'
</script>

<template>
  <Icon name="home" :size="20" />                     <!-- line: renders at once -->
  <Icon name="home" variant="solid" :size="20" />     <!-- solid: loaded on first use -->
</template>
```

`name` accepts canonical names and unambiguous aliases (`bin` -> `trash`); unknown names warn with the 3 nearest names and render nothing.

**How `Icon` loads styles.** The root `Icon` renders the **line** style at once (a dynamic name needs every line icon,
so using `Icon` brings that style). Any other `variant` is loaded the first time it renders: one dynamic import per
style (one chunk in a bundle, one file in Node), shared by every `Icon` of that style.
Until a style has loaded, its `Icon` is an async component (`defineAsyncComponent`) that renders nothing, then the
icon; Vue's `renderToString` and Nuxt SSR wait for it, so server HTML is complete. With `require()` (CommonJS) styles
load synchronously.

To have other styles ready up front, `await preloadStyles('solid', 'duo')` (no argument = every style). Or import
`Icon` from `@withicons/vue/icon`: it imports every icon of every style (734 x 34, heavy) and always renders synchronously.
`Icon` is tree-shaken away when unused; prefer named imports wherever the name is static.

## Custom icons

`createWithIcon(name, style, displayName, iconNode)` builds a component from IconNode data (`[tag, attrs][]`, 24x24 grid).

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, 34 deterministic styles, 24,956 icons. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
