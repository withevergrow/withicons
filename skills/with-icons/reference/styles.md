# with icons: the 15 styles

All styles render the same 500 skeletons, so `home` looks like the same house in every style. The seven mono styles
are single-colour `currentColor` unless you opt into their CSS variables; the five palette styles and the three studio
styles ship a default palette whose colours are CSS variables, while their ink still follows `currentColor`.

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

## Choosing

1. Building application UI? Use **line**. Need emphasis or an "on" state? Use **solid** for that one icon.
2. Want warmth without leaving the UI family? Use **duo**, and tint it to the brand: `style="--with-duo: #fde68a"`.
3. Making marketing pages, illustrations, slides or empty states? Pick **one** creative or palette style for the whole page,
   matched to the brand's tone: playful: gloss or sticker; premium: luxe, engrave or glass; technical: blueprint or pixel;
   human: sketch; cute and cozy: kawaii; nostalgic: retro, pixel or skeuo; bold and designed: bauhaus.
4. Never put creative or palette styles inside dense controls or below their minimum size, because their detail turns to noise.
5. Palette styles are designed to read on white and on near-black (`#0B0B12`). On a strong brand colour, re-theme their variables.

## Colour

- Default: `currentColor`. Set `color` on the icon or any parent (`text-blue-600`, `color: var(--brand)`). In palette
  styles this recolours the ink (outline, face, pixels drawn in the ink colour).
- `--with-duo`: the tint colour of duo (defaults to translucent currentColor).
- `--with-accent`: a second colour for blueprint construction lines.
- Palette styles: `--with-<style>-<role>` per colour (table below). Set them on any parent, a theme class or one icon:
  `.cozy { --with-kawaii-fill-1: #fbcfe8; --with-kawaii-blush: #f472b6 }`.
- Studio styles (luxe, bauhaus, skeuo) name each variable after its palette role: `--with-<style>-<role>` with role one of
  `ink c1 c2 c3 c4 tint accent shadow shine edge` (`.vip { --with-luxe-c1: #0f766e; --with-luxe-accent: #e3ae47 }`), so a
  per-icon palette (`withicons palettes <icon>`, the editor on withicons.com) recolours all three the same way.
- Icon classes (CSS masks) show palette styles in their default colours; the variables need components, the web
  component, sprites or `with-icons.js`. Standalone `.svg` files have the defaults baked in (for `<img>`, Figma, slides).

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
<!-- palettes:end -->

## Sizing

- 16px for dense tables and inline text, 20px for buttons and inputs, 24px (default) for nav and toolbars, and 32-64px for feature cards.
- `absoluteStrokeWidth` keeps a 1.75px stroke at 48px, which matches line icons of different sizes in one row.
- Pixel icons look sharpest at 16, 32 and 48px (whole multiples of their grid).
