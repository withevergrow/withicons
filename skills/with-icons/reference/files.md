# with icons: icon files (slides, print, email, social, docs)

When the result is a file (a deck, a PDF, an email, a post), export files with the CLI (`npx withicons export`, Node 18+,
no browser) or the MCP `export_icon` tool (same options in snake_case, `out_dir` to save). Several icons and formats in
one call: `npx withicons export rocket shield chart-bar --format svg-flat,png --out icons`. Every file is made before any is
written: an unknown icon, palette or option writes nothing. `npx withicons export --help` lists every option
(each command has its own `--help`); `--json` lists the files with notes and warnings.

## Which format for which job

| job | format | why |
|---|---|---|
| slides (PowerPoint, Keynote, Google Slides) | `svg-flat` (recolour and resize in the app) or `png` 256 to 512 px | baked colours; PNG when the app mangles SVG |
| moving icon on a slide, doc, chat or post | `gif` | plays almost everywhere (section "Animated files") |
| print (PDF, posters, packaging, merch) | `pdf`, `eps` or `svg-flat` (vector) | sharp at any size; never PNG for print |
| HTML email | `png` at 2x the display size, hosted on https | the only format every mail client shows (section "Email") |
| web page `<img>` | `svg-flat` | one small file; `<img>` cannot follow `currentColor` |
| design tools (Figma, Canva, Illustrator) | `svg-flat` (`eps` for old print pipelines) | editable vectors |
| apps | `android` (VectorDrawable), `ios` (imageset zip), `png-set` (@1x to @4x), `favicon-pack`, `ico` | |
| motion for apps / After Effects | `lottie`, `dotlottie` | vector animation |
| a whole style (designers, no-code, offline) | `https://withicons.com/downloads/with-icons-<style>.zip` | every icon as SVG (colours baked in) + an offline searchable viewer; `with-icons-all.zip` = every style |
| a festive campaign (banner, email, post) | `png` / `gif` in the holiday style: `--style rangoli`, `christmas`, `halloween`, `lunar`, `valentine`, `utsav` | one style for the whole campaign; festival icons in [icons.md](icons.md); switch festivals with a palette ([styles.md](styles.md#holiday-palettes)) |

## File names

The CLI and MCP name files `<name>-<style>[-<suffix>].<ext>`:

| format | file |
|---|---|
| `svg` | `bell-line-themable.svg` (keeps `currentColor` and the `--with-*` variables: for inline use and theming) |
| `svg-flat` | `bell-line.svg` (colours baked in) |
| `png` | `bell-line-512.png` (the suffix is the pixel size) |
| `pdf`, `eps`, `pptx`, `docx`, `ico` | `bell-line.pdf`, `bell-line.eps`, `bell-line.pptx`, `bell-line.docx`, `bell-line.ico` |
| `png-set`, `favicon-pack` | `bell-line-24px-set.zip`, `bell-line-favicons.zip` |
| `gif`, `apng`, `animated-svg`, `lottie`, `dotlottie` | `bell-line-ring.gif`, `bell-line-ring.apng.png`, `bell-line-ring.svg`, `bell-line-ring.json`, `bell-line-ring.lottie` (the suffix is the motion preset) |
| swap animation | `play-line-to-pause.gif` |
| `pptx-animated` | `bell-line-animated.pptx` |

Choose names with `--name <template>` (MCP `filename`): placeholders `{name}` `{style}` `{format}` `{variant}` (the
suffix above) and `{default}` (the default name); the extension is added. `--name "{name}"` gives `home.svg`,
`--name "{name}-{style}"` gives `home-solid.png`. A name per icon: `--name-map receipt=orders,heart=favourites` gives
`orders.svg` and `favourites.svg` (`{name}` in `--name` is then the mapped name; MCP `export_icon` takes
`names: { receipt: "orders", heart: "favourites" }`). Two files with the same name are refused, so keep `{style}` or
`{format}` when exporting several. The palette and colours are not in the default name: exporting the same icon twice
with other colours overwrites the file, so use another `--out` folder or `--name "{default}-dark"`.

Exported SVGs contain `<title>Bell</title>`, so screen readers announce them. Next to visible text (a label, a heading),
add `aria-hidden="true"` (inline) or `alt=""` (`<img>`), or delete the `<title>`; keep it only when the icon is the content.

## Colours are baked in

Files cannot follow `currentColor`, so exports bake the ink as **black** (`#000000`) unless you set it.

- **Dark slide or page**: pass `--color "#ffffff"` (the ink: outlines of line, solid, duo and the outline of every
  multi-colour style). For multi-colour styles also pick a palette made for dark backgrounds:
  `npx withicons palettes <icon> --tag on-dark` (every icon has at least one), then
  `--palette <id> --color "#ffffff"`. On-dark palettes keep a dark ink, so add `--color` when the outline must be light.
  Quote colours: an unquoted `#` starts a shell comment.
- **GIF on a coloured slide**: also pass that colour as `--background` (solid) or `--matte` (transparent, soft edges
  blended for it). A GIF made for white shows a light fringe on a dark slide.

## One colour set for many icons

Palettes are picked per icon, so palette ids differ between icons (`classic-red` exists for `heart`, not for `home`).
With `--palette` and several icons, an icon that lacks the palette borrows its colours from the first icon that has it,
and a warning names it; `--strict` (MCP `strict_palette: true`) fails instead, writing nothing.
For a matching set you control, set the colour **roles** directly; they apply to every icon in the call:

```bash
npx withicons export rocket shield chart-bar users --style glass --format png --size 512 \
  --color "#ffffff" --c1 "#6d28d9" --tint "#c4b5fd" --shine "#ffffff" --out icons
```

Roles: `--ink` (same as `--color`), `--c1` to `--c4`, `--tint`, `--accent`, `--shadow`, `--shine`, `--edge`
(`--colors "c1=#6d28d9,tint=#c4b5fd"` sets several). Each style reads only some roles; see which with
`npx withicons palettes <icon> --style <style>` (first line: `glass: --with-glass-back (c1), --with-glass-pane (tint), …`).
A role the style does not paint changes nothing. The CLI prints one line per command on stderr, per role:
`note: --accent applies to: phone-call (2 others don't use it)`; `--color` / `--ink` alone prints nothing (MCP
`get_icon` / `export_icon`: `warnings`). One-colour styles (line, solid, gloss, engrave, sketch) use only the ink.

- **Keep the roles distinct.** Parts that are told apart by colour merge when you give every role the same hex (kawaii
  `target` paints its rings with c1 and c2). Use two or three shades of the brand colour instead of one.
- **Some styles draw fills see-through, so a brand hex shows lighter**: duo's tint is 20% opacity, glass panes 35%
  (frost 20%), kawaii bodies 55 to 72%, pixel fills 28% and 55%, and pastel, plush, coquette, anime, gothic, luxe and
  skeuo lay translucent shading over their fills. For the **exact hex** use `solid` or `line` with `--color`, or
  `bauhaus`, `retro` or `sticker`, whose colour fills are opaque (sticker's drop shadow is translucent).
- **Put the brand colour on the main role.** c1 is the first colour family drawn, not necessarily the biggest part.
  `npx withicons palettes <icon> --style <style>` marks the body colour (`--with-glass-pane (tint, main body)`) and
  prints `main role: tint (main body, ~93% of the drawn area): set it for a brand colour, e.g. --tint "#e11d48"`
  (MCP `list_palettes`: `mainRole`, `mainRoleShare`, `mainRoleNote`; `get_icon`: `colors.mainRole`). It changes per
  icon and style, and the palette styles map their variables to different roles per icon (kawaii `heart`:
  `--with-kawaii-fill-1` is c1, `home`: `--with-kawaii-fill-3`; sticker `heart`: bubblegum, `home`: sky). Role flags
  do the variable mapping per icon, a hand-written CSS variable does not; for a mixed set, check each icon's main role.
- Check the result: export one PNG and look at it before exporting the whole set.

## Animated files (GIF, APNG, PowerPoint)

```bash
npx withicons export bell --format gif --background "#ffffff" --out slides      # bell-line-ring.gif
npx withicons export rocket --style luxe --format gif --size 512 --background "#0f172a" --color "#ffffff"
npx withicons export rocket --style luxe --format pptx-animated --background "#0f172a"   # a ready 16:9 slide, icon moving
npx withicons export play --format gif --motion swap --to pause --effect morph            # play turns into pause and back
```

MCP: `export_icon({ name: 'bell', style: 'luxe', format: 'gif', background: '#ffffff', out_dir: 'slides' })` writes the
file (without `out_dir` a small GIF comes back as image content). The remote server (`https://withicons.com/mcp`) cannot
render frames: it answers GIF / APNG / PowerPoint requests with the exact `npx withicons export ...` command to run.
Large remote exports come in pages: a result with `next: { cursor, remaining }` has more to come, so call `export_icon` again with the same arguments plus `cursor`. Plain `svg-flat` files (no colour or size options) then come back as `urls[]` to the prebuilt `@withicons/static` SVGs on jsDelivr (colours baked in, ink follows `currentColor`, no `<title>`).

- **Which animated format.** `gif` plays in PowerPoint (slide show and editor), Keynote, Google Slides, Word, Gmail,
  Apple Mail, Outlook on the web, Slack, Teams and Notion (classic Outlook for Windows shows the first frame).
  `pptx-animated`: one slide with that GIF (opens in PowerPoint, Keynote, Google Slides). `apng` (`.apng.png`): smooth
  see-through edges on web pages; Office and Google Slides show only its first frame. `animated-svg`: tiny, browsers
  only. `lottie` / `dotlottie`: vector, for apps, After Effects, Canva, LottieFiles.
- **Background.** GIF transparency is on or off per pixel, so soft edges are blended with a colour. Pass the slide's
  colour as `--background` (solid tile, cleanest) or `--matte` (transparent, edges blended for that colour).
- Pixel size: default 256 px (pptx-animated 480), sharp up to ~1.75 in / 4.5 cm wide on a 1080p slide; `--size 512`
  for full-screen or 4K, `--size 1080` for Instagram and other social posts.

- **`pptx-animated` is one sample slide** (a 16:9 slide with the GIF on it). For a real deck, export `gif` files and insert them
  into your own slides (Insert > Pictures, or drag in): GIFs play in PowerPoint, Keynote and Google Slides.
  In code, python-pptx `slide.shapes.add_picture('bell-line-ring.gif', left, top, width)` keeps the animation.
- **A more noticeable move** (a title slide): the tuned loops are calm. `npx withicons motions <icon>` (or
  `animate <icon> --list`) shows the icon's alternates with commands and the livelier picks (tada, jelly, bounce, beat,
  wiggle, pop), e.g. `export bell --format gif --motion shake`; `npx withicons animate --list` lists every preset.
- Exported files (svg, svg-flat, pdf, png, pptx ...) carry no motion part classes; the code formats (jsx, vue, html ...)
  keep them for `@withicons/motion`.
- **Sizes.** Default 256 px. GIF size depends on the style and on how much of the icon moves. Measured with
  `--background "#ffffff"` at the default 25 fps, from a small ring (`bell`) to a long steam loop (`coffee`):

  | GIF | line, solid, duo | glass, luxe | sticker, gothic |
  |---|---|---|---|
  | 256 px | 45-185 KB | 180-560 KB | 330-630 KB |
  | 512 px | 95-390 KB | 0.4-1.3 MB | 0.7-1.5 MB |
  | 1080 px (Instagram) | 0.2-0.95 MB | 0.95-3.2 MB | 1.6-3.4 MB |

  Lower `--fps` (12 roughly halves the file) or `--seconds` to shrink one. Animated files go up to 2048 px (a larger `--size` is an error, never a silent
  resize). Frames are held in memory until encoded, so very large sizes or long loops can be refused with a message that
  says the frame rate or size that fits: lower `--fps` (GIF default 25) or `--seconds`. 1080 px at the default frame
  rate fits every icon's own loop.
- **Padding.** `--padding` (MCP `padding`) is empty space around the icon as a share of its size, 0 to 0.6. Static
  exports (svg, png, pdf) put the icon edge to edge on its 24 grid by default; pass `0.1` to `0.2` for app tiles, round
  avatars or when the icon looks cramped. For animated formats it is a minimum: the export measures how far the motion
  travels (cast shadows move with the object) and grows the padding so nothing is cut off.
- **Motion**: the icon's tuned loop by default; `--motion hover|once` plays the one-shot then rests, `--motion <preset>`,
  `--motion swap --to pause --effect morph`; `--loop 1` plays once.
- Video (MP4, WebM) and animated WebP come from the icon page on withicons.com (browser encoders).

## Print

Use vectors: `pdf`, `eps` or `svg-flat`. They stay sharp at any size, so the pixel `--size` hardly matters
(PDF/EPS default 512).

```bash
npx withicons export truck package home --format pdf --color "#1f2937" --stroke-width 1.25 --out print
```

- `--color` sets the line colour (default black). For CMYK jobs, convert in the print tool; the files are RGB.
- **Stroke weight.** Outline strokes scale with the icon (1.75 on the 24 grid), so a poster-size icon gets
  proportionally bold lines. Pass `--stroke-width 1.25` (above 0, at most 4; MCP `stroke_width`) for a lighter line.
  It applies to the outline styles line, duo, engrave, blueprint, sketch and kawaii; other styles ignore it (with a note).
- Never PNG for print (a 1024 px PNG is about 8.7 cm / 3.4 in at 300 dpi).

## Email

Mail clients strip or block SVG, `data:` URIs, sprites, web components, scripts and CSS classes. Use **PNG** images:

```bash
npx withicons export check-circle truck gift --format png --size 96 --color "#0f766e" --out email
```

```html
<img src="https://cdn.example.com/email/truck-line-96.png" width="48" height="48" alt="" style="display:block;border:0">
```

- Export at 2x the display size (96 px file shown at 48), set `width` and `height` attributes, and give `alt` text
  (`alt=""` when the text next to it says the same).
- Email HTML is table layout with inline styles: put each icon in its own `<td>` (with `style="vertical-align:middle"`)
  next to the text cell rather than relying on CSS classes or flexbox. For signatures (Gmail, Outlook, Apple Mail) follow
  https://withicons.com/guides/email-signatures.html.
- Host the PNGs yourself on absolute `https://` URLs (or attach them as CID inline images). The with icons CDN serves
  SVG only; there are no hosted PNGs, so export them.
- Colours are baked in: export a separate set for a dark email theme.
- Animated: a `gif` plays in Gmail, Apple Mail, Outlook on the web and Mac; classic Outlook for Windows shows only the
  first frame, so check that the first frame reads on its own (`--motion once` or `hover` plays the move once, then rests).

## Social posts (Instagram, LinkedIn, X)

`gif` (moving) or `png` (still) with `--background` set to the post colour, e.g.
`npx withicons export rocket --style kawaii --format gif --size 1080 --background "#fff7ed"` for a square Instagram post.
For a multi-colour look use a palette style (glass, kawaii, sticker, luxe …); add `--padding 0.2` when the icon should
not fill the whole frame.

## Brand and social logos

The set has **no brand or company logos** (no Instagram, X, GitHub, LinkedIn, YouTube, Apple logo …). For "follow us"
rows use a neutral stand-in with the brand name as text or `aria-label` (`camera` for photos, `video-camera` or `play`
for video, `message-circle` for chat, `code` for code hosting, `rss`, `at-sign`, `share-2`, `globe`, `link`), or the
brand's own official asset from its press kit. Never draw a look-alike logo.
