# AGENTS.md: working on the with icons repository

This file is for coding agents (Claude Code, Cursor, Codex, Copilot) that change **this repo**. If you only need to
*use* the icons in another project, read `skills/with-icons/SKILL.md` instead.

## What this repo is

500 icons x 20 styles = 10,000 icons, all generated from 500 hand-authored skeletons, plus one optional animation spec and 20-30 colour palettes per icon,
and a separate set of up to 50 **live icons** (content you set: dates, times, counts, labels) whose generators every style renders.

```
forge/icons/<name>.json     the ONLY hand-drawn input: one skeleton per icon (paths + plates, fills, cutouts, aliases, synonyms, tags)
forge/manifest.json         icon list + categories
forge/motion/<name>.json     hand-authored animation spec per icon (loop, hover, alt presets, swaps); contract: forge/MOTION.md
forge/palettes/<name>.json   20-30 colour palettes picked per icon (ten roles: ink c1-c4 tint accent shadow shine edge);
                             contract: forge/PALETTES.md; ships as @withicons/core/palettes/* (+ palette-map.js)
forge/styles/<style>.mjs    20 deterministic renderers, in this order everywhere (STYLE_ORDER in forge/lib/emit-core.mjs):
                            line solid duo gloss engrave blueprint sketch | palette styles: glass kawaii sticker pixel retro
                            | studio styles: luxe bauhaus skeuo (site group "Studio"; role-named vars --with-<style>-<role>)
                            | storybook styles: anime gothic pastel coquette plush (site group "Storybook"; role-named vars)
                            (palette colours are var(--with-<style>-<role>, #hex), ink stays currentColor)
forge/dynamic/<name>.mjs    live icon generators: params -> skeleton, rendered by every style (forge/DYNAMIC.md);
                            ships as @withicons/dynamic (emit-dynamic) and site/vendor/dynamic/dynamic.js (live.html)
forge/kernel/**             geometry + boolean ops shared by renderers
forge/lib/load.mjs          loads/prepares skeletons
forge/lib/emit-*.mjs        one emitter per package -> packages/*/dist (generated, gitignored); emit-motion -> packages/motion
                            emit-core also exports the shared helpers: STYLE_ORDER, flattenVars, countText, paletteDoc, motionDoc
forge/tools/site-data.mjs   site data (site/data/meta.js, style-<name>.js); build.mjs calls its build(ctx)
forge/tools/site-seo.mjs    generated pages: site/icons/*.html, categories/, styles/, sitemap, robots, llms*.txt, icons.json, og/
forge/build.mjs             renders everything once, runs every emitter, then site-data + site-seo
packages/*                  npm packages @withicons/{core,react,vue,svelte,angular,solid,web,classes,static,search,mcp,motion,dynamic} + CLI `withicons`
site/                       zero-build static website (vanilla HTML/CSS/JS), deployed to withicons.com
skills/with-icons/          the agent skill for USERS of the library (reference/icons.md is generated)
infra/                      AWS CloudFormation (S3 + CloudFront + Lambda API + OIDC role + budget)
scripts/                    deploy.mjs, publish.mjs, skill-sync.mjs
docs/                       LAUNCH.md (launch plan), COSTS.md (AWS cost model)
```

## Commands

```bash
npm ci                                   # Node 22+
node forge/build.mjs                     # full build (packages + site), ~1-2 min
node forge/build.mjs react vue           # only some emitters (site data/SEO still regenerate)
node forge/tools/check.mjs               # lint all skeletons + render every style (exit 1 on hard errors)
node forge/tools/check.mjs home lock     # just these icons
node forge/tools/check-motion.mjs [names] # validate forge/motion/*.json against forge/MOTION.md
node forge/tools/check-palettes.mjs [names] [--quiet] # validate forge/palettes/*.json against forge/PALETTES.md
node forge/tools/preview.mjs --styles line,solid --icons home,lock --size 56 --small --out .preview/<agent>-x.png   # add --dark for palette styles
node forge/tools/serve.mjs               # http://localhost:4321 (site/)
npm test --workspaces --if-present       # package tests (incl. packages/search)
node scripts/skill-sync.mjs [--check]    # regenerate the skill's icons.md, palette + motion tables, counts, site/skill/SKILL.md
node scripts/deploy.mjs --dry-run        # deploy plan; never run without --dry-run unless asked
node scripts/publish.mjs --dry-run       # npm pack check (warns if v<version> is already tagged elsewhere); never publish unless asked
```

**Look at your output.** For any drawing or renderer change, render a preview PNG and inspect it at 56px and at
real 16/24px (`--small`), on light and `--dark`.

## Rules

- **Read `forge/CONTRACT.md` before touching icons or styles.** Grid, keylines, plates, fills/cutouts, renderer contract.
  Reuse the shared parts in `forge/PARTS.md` exactly.
- **Adding a style** touches more than its renderer: `STYLE_ORDER`/`PALETTE_STYLES` (forge/lib/emit-core.mjs), the site lists
  (`ORDER`, `GROUPS`, `INFO`, `ROOTS` in site/js/site.js; `ORDER`/`GROUPS`/`HEX`/`SAY` in library.js; `ORDER`/`HEX`/`CLABEL`
  in editor.js), its colour trio + `-on` in site/css/tokens.css (light and dark) and library.css, forge/tools/site-seo.mjs,
  forge/tools/site-pages/lib.mjs, the home packs (`LANES` in forge/tools/site-data.mjs) and the search words
  (packages/search/src/engine.mjs `STYLE_WORDS` + test). Counts and copy are data-driven; never hard-code "15".
- **Originality**: never copy path data from Lucide, Feather, Heroicons, Tabler, Phosphor, Material, Font Awesome
  or any other set.
- **Deterministic**: same input, byte-identical output. Use the kernel `rng(seed)`, never `Math.random()` or dates.
- **Colour**: renderers paint `currentColor`. Only the palette styles may add colours, and only as `var(--with-<style>-<role>, #hex)`
  (no defs, ids, gradients, filters, masks, text or images). Standalone `.svg` outputs flatten the variables (`flattenVars`);
  inline outputs keep them.
- **Counts are data**: never hard-code "500 icons" / "12 styles" in generators; use `countText(ctx)` / `ctx.styles.length`.
- **Palettes**: per-icon palettes live only in `forge/palettes/<name>.json` and set colour *roles*, never style variables;
  each style maps roles to its own `--with-*` variables (`palette-map`), so one palette recolours every multi-colour style.
- **Motion**: animations live only in `forge/motion/<name>.json` (closed preset vocabulary, `forge/MOTION.md`) and ship in
  `@withicons/motion`; icons never depend on it.
- **Generated files are not edited by hand**: `packages/*/dist`, `site/data/*`, `site/icons/*.html`, `site/categories/`,
  `site/styles/`, `site/og/`, `sitemap.xml`, `llms*.txt`, `icons.json`, `skills/with-icons/reference/icons.md`,
  `site/skill/SKILL.md`, `packages/motion/dist`, `site/vendor/motion/*`, `site/data/motion.js`, `packages/cli/src/skill-data.mjs`,
  `packages/mcp/src/data-inline.mjs`. Change the generator and rebuild.
- **Names**: kebab-case canonical names. `aliases` (3-15) are what people guess. An alias may not equal another icon's name.
  `synonyms` are extra search words. Renaming an icon is a breaking change: keep the old name as an alias.
- **Brand**: the product is **with icons** (lowercase wordmark), domain withicons.com, "Powered by Evergrow".
  The old names *egopenicons* / *Evergrow Open Icons* / `eg-` prefixes are retired, so never reintroduce them.
  Public identifiers: npm `@withicons/*`, element `<with-icon>`, classes `with with-<name>`, CSS vars `--with-*`.
- **Site**: zero build, relative links (works from `file://` and S3), `.html` URLs, every page works without JS for
  reading. Design contract: `site/DESIGN.md`.
- Previews go to `.preview/<agent-name>-*.png` (gitignored). Temporary files go to `.tmp/`.
- Never run `npm publish`, `scripts/deploy.mjs` without `--dry-run`, AWS mutations, or `git push` unless the user asks.

## Ownership (parallel agents)

When several agents work at once, each owns specific files. **Do not edit files you do not own.** Ask the coordinator instead.

| area | owner | files |
|---|---|---|
| icon skeletons | icon authors (per batch, see `forge/.claims/`) | `forge/icons/<name>.json` |
| animation specs | motion authors (per icon) | `forge/motion/<name>.json` |
| colour palettes | palette authors (per icon) | `forge/palettes/<name>.json` |
| motion package | motion owner | `forge/lib/emit-motion.mjs`, `packages/motion/**` |
| style renderers | one agent per style | `forge/styles/<style>.mjs`, `forge/styles/_<style>-*.mjs` |
| packages | packages owner | `forge/build.mjs`, `forge/lib/emit-*.mjs` (not emit-motion), `packages/**` (not motion), `forge/tools/site-data.mjs`, `forge/tools/site-integrations.mjs` |
| site brand + home (D1) | D1 | `site/fonts/**`, `css/tokens.css`, `css/chrome.css`, `js/site.js`, `index.html`, home css/js, `404.html`, `site/brand/**` |
| library + generated pages (D2) | D2 | `icons.html`, library css/js, `forge/tools/site-seo.mjs` and all it generates |
| content pages (D3) | D3 | `guides/**`, `developers.html`, `ai.html`, `about.html`, `license.html`, `faq.html`, pages css/js |
| launch, infra, CI, skill | launch owner | `infra/**`, `scripts/**`, `.github/**`, `docs/LAUNCH.md`, `docs/COSTS.md`, `skills/**`, `site/skill/SKILL.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`, `CHANGELOG.md`, `.cursor/rules/**` |
| frozen | nobody | `forge/kernel/**`, `forge/lib/load.mjs`, `forge/tools/check.mjs`, `forge/tools/check-motion.mjs`, `forge/manifest.json`, `forge/CONTRACT.md`, `forge/MOTION.md` (lead only) |

## Deploy and release (maintainers)

- Site: push to `main` and `.github/workflows/deploy-site.yml` runs `scripts/deploy.mjs` with an OIDC role. It uploads changed
  files with per-class Cache-Control, updates the API Lambda (`packages/mcp/dist/lambda.mjs`, which must be a
  self-contained bundle wrapped by `infra/lambda/index.mjs`), and invalidates changed paths.
- npm: bump the root version (`withiconsVersion`; `v0.1.0` is already tagged, so the next release is 0.2.0), build, then tag `vX.Y.Z`. `.github/workflows/release.yml` publishes all packages in lockstep,
  `@withicons/motion` included (Trusted Publishing + provenance; `scripts/publish.mjs` fails if one is missing). See `docs/LAUNCH.md`.
- The API Lambda must never answer with HTTP 403: CloudFront maps origin 403s to the site's `/404.html`.
