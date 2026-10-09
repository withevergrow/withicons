# withicons

**with icons** from the terminal — search {{icons}} icons x {{styles}} styles in plain English, print SVG, framework or animation code,
and get import lines. Works offline; everything ships in the package.

```sh
npx withicons search "throw away"
#   trash         actions       matched related word "throw away"
npx withicons get home --style solid --format react
npx withicons add home settings delete --framework react
#   import { Home, Settings, Trash } from '@withicons/react'
npx withicons get trash --size 32 > trash.svg
npx withicons animate bell --trigger hover --format react
npx withicons get heart --style kawaii --flat > heart.svg   # palette colours baked in
npx withicons palettes heart --style retro                  # the colour palettes picked for this icon
npx withicons get heart --style retro --palette classic-red --format react
npx withicons get heart --style sticker --c1 "#16a34a" --ink navy --flat > heart.svg
npx withicons export home settings --format svg,pdf,png --out icons   # files, for designers, apps and CI
```

| command | |
|---|---|
| `search <words...>` | ranked icons, typo-tolerant (`settigns`), synonyms (`bin`), phrases (`recycle bin`), natural language (`money`) |
| `get <name...>` | code for one or more icons; names or aliases (`delete` -> trash) |
| `add <name...>` | import line + usage for `--framework` react (default), vue, svelte, angular, solid, web-component, html-class, svg |
| `palettes <name>` | the colour palettes picked for that icon (swatches in the terminal); `--style` shows the CSS variables each one sets and marks the main role (the colour of the icon's body: set it for a brand colour), `--tag pastel` filters |
| `animate <name>` | animation code (`@withicons/motion`): `--trigger` loop (default), hover, once, inview, swap; `--preset`, `--to <name[@style]>`, `--effect`, `--duration`; `--format` html (default), react, vue, svelte, solid, angular, web-component, js. `animate <name> --list` (or `motions <name>`) shows that icon's loop and hover motions, its alternates and swaps; `animate --list` shows every preset and effect. With `--style` a 3D style (clay, glass, liquid, chrome, soft3d, luxe, skeuo, dock, plush) plays the motion in 3D (`wm-3d`), and `motions <name> --style soft3d` lists the 3-5 moves the icon offers in soft3d |
| `export <name...>` | save files: SVG, PDF, EPS, PNG, ICO, favicon pack, Android, iOS, React/Vue/Svelte/Angular components, PowerPoint, Word, Lottie, animated GIF / APNG / SVG / PowerPoint ([below](#export-files)) |
| `resolve <name>` | does a name/alias map to one icon? |
| `styles` · `categories [category]` | the catalogue; `styles` groups the styles (Essentials, Product & brand, 3D & glass, Playful, Artistic, Holidays) with their colour variables; `categories` includes the festival categories (`indian-festivals`, `christmas`, `lunar-new-year`, `valentines`, `halloween`) and `avatars` |
| `styles --for <words>` | the best styles for a job (`--for "diwali sale banner"`, `"kids avatar picker"`, `"AI landing page"`, or `--use app|slides|saas|ai|brand|kids|print|festive`): each with its React import, `<with-icon>` snippet, raw-file packages, download zip, holiday palettes and Duo presets |
| `mcp` | run the MCP server over stdio (same as `npx -y @withicons/mcp`) |
| `init [tool...]` | add the agent skill + MCP server to your AI coding tools (below) |
| `skill` | print the agent skill; `--zip` (upload to Claude / Lovable), `--out <dir>`, `--path` |

Options: `--style/-s`, `--format/-f` (svg, react, vue, svelte, angular, solid, html-class, web-component, data-uri),
`--framework/--fw`, `--size`, `--stroke-width`, `--color`, `--flat` (bake palette colours into the SVG), `--limit/-n`, `--category/-c`,
`--no-color`, and **`--json`** for scripts and AI agents (stable JSON on stdout; exit code 0 = found, 1 = not found / ambiguous,
2 = usage error: an unknown option, a missing value or a value that is not allowed).

## Colours

Every style except line, solid, gloss, engrave and sketch paints with more than one colour (`duo` and `blueprint` add an
accent; `withicons styles` lists every variable). Every colour
is a CSS variable with a default, and `get` can set **all of them**, not just one:

- `--palette <id>`: one of the palettes picked for that icon (`withicons palettes <name>` lists them).
- `--ink`, `--c1`, `--c2`, `--c3`, `--c4`, `--tint`, `--accent`, `--shadow`, `--shine`, `--edge`: one colour role each (on top of
  a palette, or alone). `c1` is always the icon's main colour; the CLI maps roles to the variables this icon uses in this style.
- `--colors "c1=#e11d48,ink=#111,retro-2=#0ea5e9"`: several at once, by role or by variable name.

What you get depends on `--format`: `svg` keeps the variables and sets them on the root `<svg style>` (add `--flat` to bake
plain hex colours in, for files, `<img>`, Figma and slides); `data-uri` is always baked; `web-component` sets them on
`<with-icon style>`; react, vue, svelte, solid and angular add a class and print its CSS rule. One-colour styles (line, solid,
gloss, engrave, sketch) and `html-class` take only the ink.

- Duo: `--with-duo` (tint) and `--with-duo-accent` (one accent detail). "Duo with an accent":
  `withicons get bell --style duo --colors "duo=#6B70F7,duo-accent=#6B70F7" --stroke-width 1.5`. "Duo gradient" is made on
  withicons.com (studio) only.
- Holiday styles (`utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine`) also have festival palettes (CSS variable
  sets: `withicons styles --for christmas` lists them); people avatars (`avatar-*`) have true-to-life skin-tone and hair
  palettes: `withicons palettes avatar-woman --tag true-to-life`.
- Every style as one zip of SVGs plus an offline viewer: `https://withicons.com/downloads/with-icons-<style>.zip`.

## Export files

`withicons export` writes the same files as the download button on withicons.com, so designers, app builds and CI
can make them without a browser:

```sh
npx withicons export home settings --format svg,pdf,png --out icons
npx withicons export star --style sticker --format favicon-pack --background "#ffffff" --out public
npx withicons export bell --format lottie --motion hover          # bell-line-ring-hover.json
npx withicons export bell --format gif --background "#ffffff"      # bell-line-ring.gif, for slides
npx withicons export rocket --style luxe --format pptx-animated    # a slide with the moving icon
npx withicons export heart --style retro --palette classic-red --format android,ios --out app/icons
npx withicons export heart --all-styles --format png --size 256 --out hearts
npx withicons export trash --format jsx --out - > src/icons/Trash.jsx
npx withicons export home --format all --out everything            # every format below
```

| `--format` | you get |
|---|---|
| `svg` (default) | SVG that keeps `currentColor` and the `--with-*` colour variables (your colours as defaults), for code |
| `svg-flat` | SVG with every colour baked in: Figma, Illustrator, Canva, Keynote, `<img>` |
| `pdf` · `eps` | true vector files for print and older design tools (EPS has no transparency) |
| `png` | a PNG, 512 px unless `--size` |
| `png-set` | ZIP: @1x, @2x, @3x, @4x (`--size` is the 1x size, default 24) + a README on which file goes where |
| `ico` | `.ico` with 16, 32, 48, 64 and 256 px inside |
| `favicon-pack` | ZIP: favicon.ico, favicon.svg, Apple touch icon, PWA icons, site.webmanifest and the `<link>` tags to paste |
| `android` | VectorDrawable XML for `res/drawable` |
| `ios` | ZIP: an Xcode `.imageset` with a vector PDF (one-colour icons tint like SF Symbols) |
| `jsx` · `tsx` · `vue` · `svelte` · `react-native` · `angular` | a ready component file with size, color and title props |
| `html` · `css` · `data-uri` · `base64` | an inline SVG snippet, a CSS class (+ a `-mask` class that takes the text colour), or one line of text |
| `pptx` · `pptx-sheet` · `docx` | a PowerPoint slide, a deck with the icon in every style, a Word document (vector in Office 365, PNG elsewhere) |
| `lottie` · `dotlottie` | the icon's animation as Lottie JSON or a `.lottie` package |
| `gif` | the animation as a looping GIF (256 px): plays in PowerPoint, Keynote, Google Slides, Slack, email, Notion |
| `apng` | an animated PNG with smooth see-through edges, for web pages (`.apng.png`) |
| `animated-svg` | one small SVG that animates by itself (CSS keyframes inside), for browsers and `<img>` |
| `pptx-animated` | a ready 16:9 PowerPoint slide with the animated GIF (also opens in Keynote and Google Slides) |

Options: `--style`, `--all-styles` (one file per style), `--size <px>`, `--background transparent|#hex`,
`--padding <0-0.4>` (space around the icon), colours exactly as for `get` (`--palette <id>`, `--color` = the ink,
`--c1` … `--edge`, `--colors`), `--motion loop|hover|once|none|swap|<preset>` (e.g. `ring`, `hover:ring`; for the
animated formats and the code formats; `--duration <s>`), `--out <folder>` (default: here; `-` prints one file to stdout),
and `--json` (the list of files written, for scripts). Several formats at once: `--format svg,png,android`, or `all`.

### Animated icons for slides

```sh
npx withicons export bell --format gif --background "#ffffff"                  # match your slide colour
npx withicons export bell --format gif --matte "#0f172a"                       # transparent, edges blended for a dark slide
npx withicons export play --format gif --motion swap --to pause --effect morph # play turns into pause and back
npx withicons export heart --style kawaii --format gif --motion beat --size 512 --fps 30
npx withicons export heart --format pptx-sheet --motion loop                   # every style, all moving
```

Frames come from the same keyframes as the website (`@withicons/motion`), so the file moves exactly like the icon page.
Icons with a tuned motion use it; `--motion hover` / `once` play the one-shot and rest; `--motion swap` turns the icon into its
suggested partner (or `--to <name[@style]>`, `--effect fade|flip|scale|morph|…`, `--hold <s>`). `--fps`, `--seconds`
(length of one loop) and `--loop` (0 = forever) tune the file; long or large animations are refused with a hint
(600 frames, 1024 px). GIF transparency is on or off per pixel, so give it the colour it will sit on: `--background`
(solid) or `--matte` (transparent, soft edges blended with that colour). Colours are baked in: choose `--palette` /
`--c1` … before exporting. Apps that cannot play GIF but take Lottie (After Effects, Canva, apps): `--format lottie`.

PNG-based and animated formats (`png`, `png-set`, `ico`, `favicon-pack`, `pptx`, `pptx-sheet`, `docx`, `gif`, `apng`,
`pptx-animated`) are drawn by [`@resvg/resvg-js`](https://www.npmjs.com/package/@resvg/resvg-js), an optional dependency
that npm installs with withicons wherever it has a prebuilt binary. If it is missing, those formats say so and tell you to
run `npm install --save-dev @resvg/resvg-js`; everything else works without it. WebP, JPG, AVIF, animated WebP and video
(WebM, MP4) use your browser's encoders: download them from the icon's page on withicons.com.

## Add with icons to your AI coding tool

```sh
npx withicons init                 # every tool found in this project
npx withicons init cursor          # or name them: claude-code codex cursor opencode vscode windsurf claude-desktop lovable
npx withicons init claude-code codex --global --mcp local
```

| tool | skill goes to | MCP server goes to |
|---|---|---|
| Claude Code | `.claude/skills/with-icons/` | `.mcp.json` (`--global`: runs `claude mcp add --scope user`) |
| Codex | `.agents/skills/with-icons/` | `.codex/config.toml` (`--global`: `~/.codex/config.toml`) |
| Cursor | `.agents/skills/with-icons/` | `.cursor/mcp.json` (`--global`: `~/.cursor/mcp.json`) |
| OpenCode | `.agents/skills/with-icons/` | `opencode.json` (`--global`: `~/.config/opencode/opencode.json`) |
| VS Code (Copilot) | `.agents/skills/with-icons/` | `.vscode/mcp.json` (`--global`: runs `code --add-mcp`) |
| Windsurf / Devin Desktop | `.agents/skills/with-icons/` | user `mcp_config.json` (`~/.config/devin/`, `%APPDATA%\devin\`; an existing `~/.codeium/windsurf/` one too) |
| Claude Desktop | upload `npx withicons skill --zip` | `claude_desktop_config.json` (local server); remote: Customize > Connectors |
| Lovable | import from GitHub (printed) | Connectors > + > MCP server (printed) |

`--global` uses your home folder (`~/.agents/skills`, `~/.claude/skills`). `--mcp remote` (default) points at
`https://withicons.com/mcp`; `--mcp local` runs `npx -y @withicons/mcp`; `--no-mcp` / `--no-skill` skip a half.
It is safe to re-run: JSON is merged key by key (other servers and settings are kept, files with comments are never
rewritten — you get the snippet instead), TOML is only appended to, an existing `withicons` entry is kept unless
`--force`, and `--dry-run` shows every change first. `.agents/skills` is the shared Agent Skills folder that Codex,
Cursor, VS Code, OpenCode and Windsurf all read, so one copy serves them all.

MIT © with icons — powered by Evergrow · https://withicons.com
