# with icons: the 20 styles

All styles render the same 500 skeletons, so `home` looks like the same house in every style. The seven mono styles
are single-colour `currentColor` unless you opt into their CSS variables; the five palette styles, the three studio
styles and the five storybook styles ship a default palette whose colours are CSS variables, while their ink still follows `currentColor`.

| style | kind | look | use it for | min size | `strokeWidth` |
|---|---|---|---|---|---|
| `line` | universal | precise 1.75px outline, round caps/joins | default UI: nav, buttons, inputs, tables, menus | 14px | yes |
| `solid` | universal | filled mass with crisp knockouts | active/selected states, dense or tiny UI, mobile tab bars | 12px | no |
| `duo` | universal | line over a soft tonal fill (`--with-duo`) | friendly dashboards, cards, onboarding, settings pages | 18px | yes |
| `gloss` | creative | inflated, glossy, pillowy, carved highlights | hero art, app-store style feature grids, playful brands | 32px | no |
| `engrave` | creative | banknote intaglio hatching | finance, legal, premium, editorial, certificates | 40px | no |
| `blueprint` | creative | drafting lines, centre lines, nodes (`--with-accent`) | docs, developer tools, engineering, "how it works" | 32px | yes |
| `sketch` | creative | loose double marker strokes, light hachure | whiteboards, education, empty states, informal products | 32px | yes |
| `glass` | palette | layered frosted glass panes with a bright rim (glassmorphism) | modern SaaS heroes, fintech, OS-like UIs, dark gradient backgrounds | 32px | no |
| `kawaii` | palette | chubby pastel shapes, soft thick outline, a tiny blushing face | cozy and wellness apps, journaling, kids, stickers, Gen Z audiences | 32px | yes |
| `sticker` | palette | Y2K die-cut sticker: thick white border, candy colours, sparkles | social, creator tools, scrapbooks, fandom, playful marketing | 32px | no |
| `pixel` | palette | hand-tuned 16-bit pixel art: one-pixel outline, shaded body, highlight pixel | games, retro tech, playful dev tools, achievements | 16px (sharpest at 16, 32, 48) | no |
| `retro` | palette | 70s sunset stripes, chunky outline, hard offset shadow | vintage brands, music, food, posters, merch | 32px | no |
| `luxe` | studio | premium multi-layered 3D: sapphire enamel slab, extruded wall, polished gold, jewel, lit chamfers | heroes, pricing tiers, fintech, luxury brands, launch moments | 48px | no |
| `bauhaus` | studio | pure geometry (circles, squares, bars) in red, yellow and blue, overprinted where inks meet | posters, portfolios, galleries, design studios, editorial | 32px | no |
| `skeuo` | studio | skeuomorphic objects in real materials (paper, leather, metal, brass, glass), bevels, soft shadows | app icons, music/photo/note apps, tactile dashboards, nostalgic UIs | 48px | no |
| `anime` | storybook | anime cel shading: tapered plum ink lines, flat cel colour (sky blue, sakura pink, warm gold), one hard shadow, specular shine, sparkles | games, streaming, fan sites, creators, Gen Z apps | 32px | no |
| `gothic` | storybook | cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery | fantasy and RPG games, books, music, Halloween, dark-luxe brands | 48px | no |
| `pastel` | storybook | soft pastel colour fields (lavender, peach, mint, baby blue, butter, blush) with gentle tonal depth | wellness, planners and journals, baby and lifestyle brands, aesthetic home screens | 32px | no |
| `coquette` | storybook | ballet-pink satin objects tied with ribbon-red bows, pearls, lace and delicate gold | beauty, fashion, weddings, boutiques, feminine brands, social posts | 32px | no |
| `plush` | storybook | stuffed toys sewn from felt: puffy panels, dark piping, running stitches, buttons, embroidery | kids' apps, learning, toy shops, nurseries, family brands | 48px | no |

## Choosing

1. Building application UI? Use **line**. Need emphasis or an "on" state? Use **solid** for that one icon.
2. Want warmth without leaving the UI family? Use **duo**, and tint it to the brand: `style="--with-duo: #fde68a"`.
3. Making marketing pages, illustrations, slides or empty states? Pick **one** creative or palette style for the whole page,
   matched to the brand's tone: playful: gloss or sticker; premium: luxe, engrave or glass; technical: blueprint or pixel;
   human: sketch; cute and cozy: kawaii or pastel; nostalgic: retro, pixel or skeuo; bold and designed: bauhaus;
   games and fandom: anime; fantasy and dark: gothic; feminine and romantic: coquette; for children: plush.
4. Never put creative or palette styles inside dense controls or below their minimum size, because their detail turns to noise.
5. Palette styles are designed to read on white and on near-black (`#0B0B12`). On a strong brand colour, re-theme their variables.

## Colour

- Default: `currentColor`. Set `color` on the icon or any parent (`text-blue-600`, `color: var(--brand)`). In palette
  styles this recolours the ink (outline, face, pixels drawn in the ink colour).
- `--with-duo`: the tint colour of duo (defaults to translucent currentColor).
- `--with-accent`: a second colour for blueprint construction lines.
- Palette styles: `--with-<style>-<role>` per colour (table below). Set them on any parent, a theme class or one icon:
  `.cozy { --with-kawaii-fill-1: #fbcfe8; --with-kawaii-blush: #f472b6 }`.
- Studio and storybook styles (luxe, bauhaus, skeuo, anime, gothic, pastel, coquette, plush) name each variable after its palette role: `--with-<style>-<role>` with role one of
  `ink c1 c2 c3 c4 tint accent shadow shine edge` (`.vip { --with-luxe-c1: #0f766e; --with-luxe-accent: #e3ae47 }`), so a
  per-icon palette (`withicons palettes <icon>`, the editor on withicons.com) recolours all of them the same way.
- The five palette styles (glass, kawaii, sticker, pixel, retro) keep their own variable names, but every one of them maps
  to a palette role too, so the same per-icon palettes apply to them: fixed variables map to one role
  (`--with-kawaii-face` -> ink, `--with-kawaii-blush` -> accent, `--with-glass-back` -> c1, `--with-glass-pane` -> tint,
  `--with-sticker-edge` -> edge, `--with-pixel-fill` -> c1, `--with-retro-shadow` -> shadow …), and the colour families
  (`--with-kawaii-fill-N`, the sticker candies `--with-sticker-bubblegum/grape/lemon/mint/peach/sky`, `--with-retro-N`)
  map to c1, c2, c3, c4 in the order they first appear in that icon. `withicons palettes heart --style kawaii` prints the
  exact mapping for one icon (`kawaii: --with-kawaii-fill-1 (c1), --with-kawaii-blush (accent), … --with-kawaii-face (ink)`);
  MCP `list_palettes(name, style)` and `/api/palettes/<name>?style=` return it as JSON. `--with-duo` and `--with-accent` map to c1.
- Some variables default to `currentColor` (the ink), so the table below leaves them out: `--with-kawaii-face` (eyes and
  mouth), `--with-pixel-fill`, `--with-bauhaus-ink`, `--with-skeuo-edge`, plus `--with-duo` and `--with-accent`.
- Apply a named palette without a build step: `withicons get heart --style kawaii --palette classic-red --format web-component`
  (or MCP `get_icon` with `palette`) returns a `<with-icon>` with the palette's variables in its `style` attribute, ready for
  the CDN script; there is no `palette` attribute on `<with-icon>` itself. For an image, use
  `https://withicons.com/api/icon/heart.svg?style=kawaii&palette=classic-red` (colours baked in) or `--flat` on `get`.
- **Brand colours with no build**: `get` takes the same role flags as `export` (`--ink`, `--c1` to `--c4`, `--tint`,
  `--accent`, `--shadow`, `--shine`, `--edge`, or `--colors "c1=#6d28d9,tint=#c4b5fd"`) and writes the variables that
  icon uses: `withicons get rocket --style glass --c1 "#6d28d9" --tint "#c4b5fd" --format web-component` gives
  `<with-icon style="--with-glass-back: #6d28d9; --with-glass-pane: #c4b5fd" name="rocket" variant="glass">`.
  (`--color` only changes `svg` / `data-uri` output; for the element, set CSS `color` on a parent.)
- **Put the brand colour on the main role.** c1 is the first colour family the drawing uses, not necessarily its
  biggest part. `withicons palettes <icon> --style <style>` marks the body colour and its share:
  `--with-glass-pane (tint, main body)` and `main role: tint (main body, ~93% of the drawn area): set it for a brand
  colour, e.g. --tint "#e11d48"` (MCP `list_palettes`: `mainRole`, `mainRoleShare`, `mainRoleNote`; `get_icon`:
  `colors.mainRole`). The main role changes per icon and style, and the palette styles' variables map to different
  roles per icon (kawaii `heart`: `--with-kawaii-fill-1` is c1, `home`: `--with-kawaii-fill-3`; sticker `heart`:
  bubblegum, `home`: sky), so one hand-written CSS rule does not recolour a set evenly. For one brand colour across a
  set, set each icon's main role with role flags (`get` / `export` map them to variables), or use solid / line with
  `color`. Look at the result.
- Icon classes (CSS masks) show palette styles in their default colours (with a palette, only its ink applies); the
  variables need components, the web component, sprites or `with-icons.js`. Standalone `.svg` files have the defaults
  baked in (for `<img>`, Figma, slides).

### Palette variables

<!-- palettes:start -->
| style | CSS variables (default) |
|---|---|
| `glass` | `--with-glass-accent` #FF4D8D, `--with-glass-back` #3D5AFE, `--with-glass-etch` #1B2390, `--with-glass-frost` #FFFFFF, `--with-glass-pane` #C7D0FF, `--with-glass-shine` #FFFFFF |
| `kawaii` | `--with-kawaii-accent` #FF5C9A, `--with-kawaii-blush` #FF6F9C, `--with-kawaii-fill-1` #FF6FA5, `--with-kawaii-fill-2` #FF9A66, `--with-kawaii-fill-3` #FFD23A, `--with-kawaii-fill-4` #45D99A, `--with-kawaii-fill-5` #5AB4FF, `--with-kawaii-fill-6` #A98BFF, `--with-kawaii-shine` #FFFFFF, `--with-kawaii-sparkle` #FFB627 |
| `sticker` | `--with-sticker-bubblegum` #FF6FB5, `--with-sticker-edge` #FFFFFF, `--with-sticker-grape` #A98BFF, `--with-sticker-ink` #1D1530, `--with-sticker-lemon` #FFD43B, `--with-sticker-mint` #3FDDA4, `--with-sticker-peach` #FF9563, `--with-sticker-shadow` #1D1530, `--with-sticker-shine` #FFFFFF, `--with-sticker-sky` #5BC6FF |
| `pixel` | `--with-pixel-shine` #FFFFFF |
| `retro` | `--with-retro-1` #F4B53F, `--with-retro-2` #EF7D2D, `--with-retro-3` #DE4B3A, `--with-retro-4` #178A86, `--with-retro-shadow` #6B3323 |
| `luxe` | `--with-luxe-accent` #E3AE47, `--with-luxe-c1` #2039B4, `--with-luxe-c2` #C0174F, `--with-luxe-c3` #16206E, `--with-luxe-c4` #7B4A12, `--with-luxe-edge` #9CC2FF, `--with-luxe-ink` #0B1033, `--with-luxe-shadow` #0A0B26, `--with-luxe-shine` #FFFFFF, `--with-luxe-tint` #FFEFC4 |
| `bauhaus` | `--with-bauhaus-accent` #2E7A5E, `--with-bauhaus-c1` #E0412E, `--with-bauhaus-c2` #F2B33D, `--with-bauhaus-c3` #2A6BC2, `--with-bauhaus-c4` #E9772E, `--with-bauhaus-shadow` #151515, `--with-bauhaus-tint` #F3EBDD |
| `skeuo` | `--with-skeuo-accent` #F1CF98, `--with-skeuo-c1` #2F72E4, `--with-skeuo-c2` #BFC7D0, `--with-skeuo-c3` #E0483A, `--with-skeuo-c4` #1E2B3B, `--with-skeuo-ink` #4F4638, `--with-skeuo-shadow` #15110D, `--with-skeuo-shine` #FFFFFF, `--with-skeuo-tint` #FFFFFF |
| `anime` | `--with-anime-accent` #FF5D78, `--with-anime-c1` #4BA8F5, `--with-anime-c2` #FF8DB6, `--with-anime-c3` #FFC740, `--with-anime-c4` #5FCF8C, `--with-anime-edge` #BFE6FF, `--with-anime-ink` #2B2148, `--with-anime-shadow` #4B2C8F, `--with-anime-shine` #FFFFFF, `--with-anime-tint` #FFF5EC |
| `gothic` | `--with-gothic-accent` #C79A38, `--with-gothic-c1` #B3163B, `--with-gothic-c2` #2552B4, `--with-gothic-c3` #E6A421, `--with-gothic-c4` #1C8A5F, `--with-gothic-edge` #837A6F, `--with-gothic-ink` #221A26, `--with-gothic-shadow` #140F18, `--with-gothic-shine` #FFF6DE, `--with-gothic-tint` #D3CDC0 |
| `pastel` | `--with-pastel-c1` #CDBBF7, `--with-pastel-c2` #CDBBF7, `--with-pastel-c3` #FFE29C, `--with-pastel-c4` #B7D6FA, `--with-pastel-edge` #B6A1EF, `--with-pastel-ink` #6A55B8, `--with-pastel-shadow` #9E87E6, `--with-pastel-shine` #FFFFFF, `--with-pastel-tint` #ECE5FC |
| `coquette` | `--with-coquette-accent` #D9A45B, `--with-coquette-c1` #F8BCCB, `--with-coquette-c2` #EC8DA6, `--with-coquette-c3` #D7385F, `--with-coquette-c4` #FCEADD, `--with-coquette-edge` #FFFBF6, `--with-coquette-ink` #7E2443, `--with-coquette-shadow` #A8345C, `--with-coquette-shine` #FFFFFF, `--with-coquette-tint` #FFE4EB |
| `plush` | `--with-plush-accent` #FF8DB4, `--with-plush-c1` #F4695E, `--with-plush-c2` #FFC53D, `--with-plush-c3` #4C9FE6, `--with-plush-c4` #4FBF8A, `--with-plush-edge` #FFF9F0, `--with-plush-ink` #4A2C3D, `--with-plush-shadow` #3A1E46, `--with-plush-shine` #FFFFFF, `--with-plush-tint` #FFF0D9 |
<!-- palettes:end -->

## Sizing

- 16px for dense tables and inline text, 20px for buttons and inputs, 24px (default) for nav and toolbars, and 32-64px for feature cards.
- `absoluteStrokeWidth` keeps a 1.75px stroke at 48px, which matches line icons of different sizes in one row.
- Pixel icons look sharpest at 16, 32 and 48px (whole multiples of their grid).
