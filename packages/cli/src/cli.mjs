// `withicons` — with icons from the terminal. Data, search and code generation come from @withicons/mcp/lib.
import fs from 'node:fs'
import path from 'node:path'
import { TOOLS, init, env, findTool, installSkill, skillText, zipSkill } from './init.mjs'

const HELP = ({ icons = 'all', styles = [], palettes } = {}) => `withicons: ${icons} icons x ${styles.length || 'every'} styles from the terminal (https://withicons.com)

Usage
  withicons search <words...>        find icons by meaning ("throw away", "settigns", "money")
  withicons get <name...>            print icons (SVG by default) or framework code
  withicons add <name...>            print import lines + usage for a framework
  withicons export <name...>         save files: svg, pdf, png, ico, favicons, android, ios, jsx, pptx, lottie,
                                     animated gif / apng / svg, animated PowerPoint, …
  withicons palettes <name>          the colour palettes picked for an icon${palettes ? ` (${palettes} in all)` : ''}
  withicons animate <name>           animation code (@withicons/motion): loop, hover, once, inview, swap
                                     (--list: the icon's tuned motions and alternates)
  withicons resolve <name>           check a name or alias
  withicons styles                   list the styles (and the colour variables of multi-colour ones)
  withicons categories [category]    list categories, or the icons in one
  withicons mcp                      run the MCP server over stdio (same as npx -y @withicons/mcp)
  withicons init [tool...]           add the with-icons skill + MCP server to your AI coding tools
  withicons skill                    print the agent skill (SKILL.md); --zip, --out <dir>, --path

AI tools (init)
  claude-code, codex, cursor, opencode, vscode, windsurf, claude-desktop, lovable
  No tool given: the ones found in this project (or in your home folder with --global).
  --global                  install for your user instead of this project
  --mcp <remote|local|none> remote = https://withicons.com/mcp (default), local = npx -y @withicons/mcp
  --no-skill, --no-mcp      skip one half
  --dry-run                 show what would change, write nothing
  --force                   replace an existing "withicons" MCP entry

Options
  --style, -s <style>       ${styles.length ? styles.join(', ') : 'line (default) …'} (default line)
  --format, -f <format>     get: svg (default), react, vue, svelte, angular, solid, html-class, web-component, data-uri
  --framework, --fw <name>  add: react (default), vue, svelte, angular, solid, web-component, html-class, svg
  --size <px>               get: pixel size (default 24)
  --stroke-width <n>        get: stroke width of outline styles (line default 1.75)
  --color <css color>       get: replace currentColor, the ink (svg, data-uri)
  --flat                    get: bake palette / CSS-variable colours into the SVG (files, <img>, Figma, slides)

Colours (multi-colour styles: duo, blueprint, glass, kawaii, sticker, pixel, retro, luxe, bauhaus, skeuo, anime, gothic, pastel, coquette, plush)
  --palette <id>            get: apply one of the icon's palettes (withicons palettes <name>)
  --ink, --c1 … --c4, --tint, --accent, --shadow, --shine, --edge <color>
                            get: set any colour role (on top of --palette, or alone)
  --colors <k=v,...>        get: several at once: "c1=#e11d48,ink=#111" or a variable "retro-2=#0ea5e9"
  --tag <tag>               palettes: only palettes with this tag (pastel, neon, retro, …)

Motion
  --trigger, -t <t>         animate: loop (default), hover, once, inview, swap
  --preset, -p <preset>     animate: override the motion (spin, ring, beat, float, pop, …; animate --list)
  --to <name[@style]>       animate --trigger swap, export --motion swap: the icon to turn into (default: its suggestion)
  --effect <effect>         swaps: fade, flip, scale, rotate, slide-up, morph, …
  --duration <s>            animate: seconds per cycle

Export (files for designers, apps and CI)
  --format, -f <list>       export: one or more, comma separated (default svg), or all:
                              vector  svg (keeps CSS variables), svg-flat (colours baked in), pdf, eps
                              images  png, png-set (@1x-@4x zip), ico, favicon-pack (zip)
                              apps    android (VectorDrawable xml), ios (Xcode imageset zip)
                              code    jsx, tsx, vue, svelte, react-native, angular, html, css, data-uri, base64
                              office  pptx, pptx-sheet (every style), docx
                              motion  gif, apng, animated-svg, pptx-animated (a slide with the animated GIF),
                                      lottie, dotlottie
  --out, -o <dir>           export: folder to write to (default: here); "-" prints one file to stdout
  --name <template>         export: file names. Default <name>-<style>[-<variant>].<ext>: home-line.svg (svg-flat),
                              home-line-themable.svg (svg), home-line-512.png, bell-line-ring.gif.
                              Placeholders {name} {style} {format} {variant} {default}; the extension is added:
                              --name "{name}" -> home.svg, --name "{name}-{style}" -> home-solid.png
  --name-map <icon=name,…>  export: a file name per icon: --name-map receipt=orders,heart=favourites
  --palette <id>            export: a palette id is per icon; icons without it borrow the colours of the first icon
                              that has it (a warning says which). --strict: fail instead (nothing is written)
  --size <n>                export: pixels (png 512, png-set base 24, svg 24, pdf/eps 512, lottie 512,
                              gif/apng/animated-svg 256, pptx-animated 480); animated formats up to 2048
  --background <color>      export: transparent (default) or a hex colour, e.g. "#ffffff"
  --color, --c1 …           export: colours, as for get (--color is the ink)
  --motion <m>              export: loop (default), hover, once, none, swap, or a preset (ring, spin, …; hover:ring)
                              for the motion formats and code; with pptx-sheet: every style animated
  --fps <n>                 gif/apng/pptx-animated: frames per second (gif 25, apng 30; gif at most 50)
  --seconds <s>             gif/apng/pptx-animated: length of one loop (default: the motion's own cycle)
  --loop <n>                gif/apng: 0 = repeat forever (default), n = play n times
  --matte <color>           gif: transparent GIF, soft edges blended with this colour (your slide's)
  --hold <s>                --motion swap: rest on each icon between turns
  --all-styles              export: every style, one file each
  --padding <0-0.6>         export: empty space around the icon, as a share of its size (a minimum: animated
                              formats grow it to fit the motion)
  --stroke-width <n>        export: stroke width of outline styles (line default 1.75), e.g. thinner for print
  Animated files for slides: GIF plays in PowerPoint, Keynote, Google Slides, Slack, email; APNG has smooth
  see-through edges for web pages; pass your slide colour as --background (GIF transparency is 1-bit).
  PNG-based and animated formats (png, png-set, ico, favicon-pack, pptx, pptx-sheet, docx, gif, apng, pptx-animated)
  use @resvg/resvg-js:
  installed with withicons when your platform supports it, else: npm install -D @resvg/resvg-js

Output
  --limit, -n <n>           search, palettes: max results (default 10 for search)
  --category, -c <name>     search: only this category
  --json                    machine-readable output (for scripts and agents)
  --no-color                plain text (also NO_COLOR=1, or when piped)
  --version, -v | --help, -h
  Exit codes: 0 found, 1 not found / ambiguous, 2 usage error (unknown option or value)

Examples
  npx withicons search "throw away"
  npx withicons get home --style solid --format react
  npx withicons add home settings --framework react
  npx withicons palettes heart --style retro
  npx withicons get heart --style sticker --palette classic-red --flat > heart.svg
  npx withicons get pizza --style retro --c1 "#f4b942" --shadow "#5a2a14" --format react
  npx withicons animate bell --trigger hover --format react
  npx withicons animate play --trigger swap --to pause --effect morph
  npx withicons get trash --format svg --size 32 > trash.svg
  npx withicons export home settings --format svg,pdf,png --out icons
  npx withicons export star --style sticker --format favicon-pack --background "#ffffff"
  npx withicons export bell --format lottie --motion hover
  npx withicons export bell --format gif --background "#ffffff" --size 256
  npx withicons export rocket --style luxe --format pptx-animated --background "#0f172a"
  npx withicons export play --format gif,apng --motion swap --to pause --effect morph
  npx withicons export heart --all-styles --format png --palette classic-red --out hearts
  npx withicons init cursor
  npx withicons init claude-code codex --global --mcp local`

// `withicons <command> --help` (or `withicons help <command>`): that command's options only
const COLOUR_OPTS = `  --palette <id>            one of the icon's palettes (withicons palettes <name>)
  --ink, --c1 … --c4, --tint, --accent, --shadow, --shine, --edge <color>
                            set one colour role (on top of --palette, or alone)
  --colors <k=v,...>        several at once: "c1=#e11d48,ink=#111" or a variable "retro-2=#0ea5e9"
  --color <css color>       the ink (currentColor)
  A role the style does not paint the icon with changes nothing. With several icons, one line per colour says
  which icons use it ("--accent applies to: phone-call (14 others don't use it)"); a warning only when none do.
  withicons palettes <name> --style <style> marks the main role (the colour of the icon's body).`
const COMMAND_HELP = ({ styles = [] } = {}) => {
  const st = styles.length ? styles.join(', ') : 'line (default), solid, duo, …'
  return {
    search: `withicons search <words...>: find icons by meaning ("throw away", "settigns", "money")

Options
  --limit, -n <n>           max results (default 10)
  --category, -c <name>     only this category (withicons categories)
  --style, -s <style>       style for the suggested command: ${st}
  --format, -f <format>     snippet format in --json (default react)
  --json                    machine-readable output
Exit codes: 0 found, 1 nothing found, 2 usage error

Examples
  withicons search "throw away"
  withicons search money -n 5 --json`,
    get: `withicons get <name...>: print icons as SVG (default) or framework code

Options
  --style, -s <style>       ${st}
  --format, -f <format>     svg (default), react, vue, svelte, angular, solid, html-class, web-component, data-uri
  --size <px>               pixel size (default 24)
  --stroke-width <n>        stroke width of outline styles (line default 1.75)
  --flat                    bake palette / CSS-variable colours into the SVG (files, <img>, Figma, slides)
  --json                    machine-readable output (includes warnings)

Colours (multi-colour styles; withicons styles lists them)
${COLOUR_OPTS}

Examples
  withicons get home --style solid --format react
  withicons get heart --style sticker --palette classic-red --flat > heart.svg
  withicons get pizza --style retro --c1 "#f4b942" --shadow "#5a2a14" --format react`,
    add: `withicons add <name...>: import lines + usage for a framework

Options
  --framework, --fw <name>  react (default), vue, svelte, angular, solid, web-component, html-class, svg
  --style, -s <style>       ${st}
  --json                    machine-readable output

Example
  withicons add home settings --framework react`,
    export: `withicons export <name...>: save files for designers, apps, slides and CI

Every file is made before any is written: an unknown icon, palette or option writes nothing.

Options
  --format, -f <list>       one or more, comma separated (default svg), or all:
                              vector  svg (keeps CSS variables), svg-flat (colours baked in), pdf, eps
                              images  png, png-set (@1x-@4x zip), ico, favicon-pack (zip)
                              apps    android (VectorDrawable xml), ios (Xcode imageset zip)
                              code    jsx, tsx, vue, svelte, react-native, angular, html, css, data-uri, base64
                              office  pptx, pptx-sheet (every style), docx
                              motion  gif, apng, animated-svg, pptx-animated, lottie, dotlottie
  --style, -s <style>       ${st}
  --all-styles              every style, one file each
  --out, -o <dir>           folder to write to (default: here); "-" prints one file to stdout
  --name <template>         file names. Default <name>-<style>[-<variant>].<ext>:
                              svg-flat home-line.svg, svg home-line-themable.svg, png home-line-512.png,
                              gif bell-line-ring.gif, apng play-line-to-pause.apng.png
                            placeholders {name} {style} {format} {variant} {default}; the extension is added:
                              --name "{name}" -> home.svg   --name "{name}-{style}" -> home-solid.png
                            two files with the same name are refused (add {style} or {format})
  --name-map <icon=name,…>  a file name per icon in one call: --name-map receipt=orders,heart=favourites
                              -> orders.svg, favourites.svg ({name} in --name is the mapped name)
  --size <n>                pixels (png 512, png-set base 24, svg 24, pdf/eps 512, lottie 512,
                              gif/apng/animated-svg 256, pptx-animated 480); animated formats up to 2048
  --background <color>      transparent (default) or a hex colour, e.g. "#ffffff"
  --padding <0-0.6>         empty space around the icon, as a share of its size (a minimum: animated formats
                            grow it to fit the motion)
  --stroke-width <n>        stroke width of outline styles (line default 1.75); other styles ignore it
  --json                    list the files as JSON (with notes and warnings)

Colours
${COLOUR_OPTS}
  --strict                  with --palette and several icons: fail (writing nothing) when an icon lacks the
                            palette. Default: such icons borrow the palette's colours from the first icon that
                            has it, and a warning names them.

Motion (gif, apng, animated-svg, pptx-animated, lottie, dotlottie, code formats)
  --motion <m>              loop (default), hover, once, none, swap, or a preset (ring, spin, …; hover:ring)
  --to <name[@style]>       --motion swap: the icon to turn into (default: its suggestion)
  --effect <effect>         swaps: fade, flip, scale, rotate, slide-up, morph, …
  --hold <s>                --motion swap: rest on each icon between turns
  --duration <s>            seconds per motion cycle
  --fps <n>                 gif/apng/pptx-animated frames per second (gif 25, apng 30)
  --seconds <s>             gif/apng/pptx-animated length of one loop
  --loop <n>                gif/apng: 0 = forever (default), n = play n times
  --matte <color>           gif: transparent, soft edges blended with this colour
PNG-based and animated formats need @resvg/resvg-js (npm install -D @resvg/resvg-js if it is missing).

Examples
  withicons export home settings --format svg,pdf,png --out icons
  withicons export home settings --format svg --name "{name}" --out icons      # home.svg, settings.svg
  withicons export receipt heart --format svg-flat --name-map receipt=orders,heart=favourites
  withicons export coffee flame leaf --style retro --palette seventies-diner --format png
  withicons export bell --format gif --background "#ffffff" --size 256`,
    palettes: `withicons palettes <name>: the colour palettes picked for an icon

Options
  --style, -s <style>       show the CSS variables each palette sets in this style
  --tag <tag>               only palettes with this tag (pastel, neon, retro, on-dark, …)
  --limit, -n <n>           max palettes
  --json                    machine-readable output

Example
  withicons palettes heart --style retro --tag pastel`,
    animate: `withicons animate <name>: animation code (@withicons/motion)

Options
  --trigger, -t <t>         loop (default), hover, once, inview, swap
  --preset, -p <preset>     override the motion (spin, ring, beat, float, pop, …; withicons animate --list)
  --to <name[@style]>       --trigger swap: the icon to turn into (default: its suggestion)
  --effect <effect>         swaps: fade, flip, scale, rotate, slide-up, morph, …
  --duration <s>            seconds per cycle
  --style, -s <style>       ${st}
  --format, -f <format>     html (default), react, vue, svelte, solid, angular, web-component, js
  --list                    with a name: the icon's loop and hover motions, its alternates and swaps
                            (also: withicons motions <name>); alone: triggers, presets, effects and formats
  --json                    machine-readable output
For an animated FILE (GIF, APNG, PowerPoint, Lottie) use withicons export --format gif --motion …

Examples
  withicons animate bell --trigger hover --format react
  withicons animate bell --list                        # its motions: loop ring, hover ring, alternates shake, pop
  withicons animate bell --preset shake                # an alternate
  withicons animate bell --format web-component        # <with-icon name="bell" motion="loop">
  withicons animate play --trigger swap --to pause --effect morph`,
    resolve: `withicons resolve <name>: check a name or alias (exit 0 resolved, 1 unknown or ambiguous)

Options
  --json                    machine-readable output`,
    styles: `withicons styles: list the styles and the colour variables of multi-colour ones

Options
  --json                    machine-readable output (with minSize and onDark hints)`,
    categories: `withicons categories [category]: list categories, or the icons in one

Options
  --json                    machine-readable output`,
    init: `withicons init [tool...]: add the with-icons skill + MCP server to your AI coding tools

Tools
  claude-code, codex, cursor, opencode, vscode, windsurf, claude-desktop, lovable
  No tool given: the ones found in this project (or in your home folder with --global).

Options
  --global                  install for your user instead of this project
  --mcp <remote|local|none> remote = https://withicons.com/mcp (default), local = npx -y @withicons/mcp
  --no-skill, --no-mcp      skip one half
  --dry-run                 show what would change, write nothing
  --force                   replace an existing "withicons" MCP entry
  --list                    the tools init knows
  --json                    machine-readable output

Examples
  withicons init cursor
  withicons init claude-code codex --global --mcp local`,
    skill: `withicons skill: print the agent skill (SKILL.md)

Options
  --zip [--out <file>]      write with-icons.zip (upload to claude.ai and other chat apps)
  --out <dir>               install the skill folder into <dir>/with-icons
  --path [tool...]          where each tool reads skills from (--global for your user)`,
    mcp: `withicons mcp: run the with icons MCP server over stdio (same as npx -y @withicons/mcp)`,
  }
}
const COMMAND_ALIASES = { s: 'search', find: 'search', g: 'get', svg: 'get', import: 'add', palette: 'palettes', colors: 'palettes', colours: 'palettes',
  motion: 'animate', anim: 'animate', motions: 'animate', x: 'export', save: 'export', r: 'resolve', category: 'categories', list: 'categories', setup: 'init', skills: 'skill', serve: 'mcp' }

const ROLES = ['ink', 'c1', 'c2', 'c3', 'c4', 'tint', 'accent', 'shadow', 'shine', 'edge']
const FLAGS = { s: 'style', f: 'format', n: 'limit', c: 'category', fw: 'framework', v: 'version', h: 'help', t: 'trigger', p: 'preset', g: 'global', colours: 'colors', colour: 'color',
  o: 'out', formats: 'format', bg: 'background', 'all-style': 'all-styles', 'every-style': 'all-styles' }
const BOOL = new Set(['json', 'version', 'help', 'raw', 'no-color', 'global', 'dry-run', 'force', 'no-mcp', 'no-skill', 'print', 'path', 'zip', 'list', 'flat', 'all-styles', 'strict'])
const VALUE = new Set(['style', 'format', 'framework', 'size', 'stroke-width', 'color', 'trigger', 'preset', 'to', 'effect', 'duration', 'limit',
  'category', 'mcp', 'out', 'palette', 'colors', 'tag', 'background', 'motion', 'padding', 'fps', 'seconds', 'loop', 'matte', 'hold', 'name', 'name-map', ...ROLES])
class UsageError extends Error {}
const near = (k, list) => list.find(x => x.startsWith(k.slice(0, 3)) || k.startsWith(x.slice(0, 3)))
function parseArgs(argv) {
  const args = [], o = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--') { args.push(...argv.slice(i + 1)); break }
    const m = a.match(/^--?([a-z][a-z0-9-]*)(?:=([\s\S]*))?$/i)
    if (!m) { args.push(a); continue }
    const k = FLAGS[m[1]] || m[1].toLowerCase()
    if (!BOOL.has(k) && !VALUE.has(k)) {
      const all = [...BOOL, ...VALUE], hint = near(k, all)
      throw new UsageError(`unknown option "${a}"${hint ? ` (did you mean --${hint}?)` : ''}. See withicons --help`)
    }
    if (m[2] !== undefined) o[k] = m[2]
    else if (BOOL.has(k)) o[k] = true
    else if (i + 1 >= argv.length) throw new UsageError(`${a} needs a value`)
    else o[k] = argv[++i]
  }
  return { args, o }
}
function num(o, k, { min = 0, int = false } = {}) {
  if (o[k] === undefined) return undefined
  const v = Number(o[k])
  if (!Number.isFinite(v) || v <= min || (int && !Number.isInteger(v))) throw new UsageError(`--${k} must be a ${int ? 'whole ' : ''}number above ${min}, got "${o[k]}"`)
  return v
}
// --colors "c1=#e11d48, ink=#111" + --c1 #… flags -> { c1: '#e11d48', ink: '#111', '--with-retro-2': '#0ea5e9' }
function colorArgs(o) {
  const out = {}
  const key = k => {
    k = k.trim()
    if (ROLES.includes(k.toLowerCase())) return k.toLowerCase()
    if (k.startsWith('--')) return k
    return '--with-' + k.replace(/^with-/, '')
  }
  if (o.colors !== undefined) {
    for (const part of String(o.colors).split(/[,;]\s*|\s+(?=[\w-]+\s*[=:])/)) {
      if (!part.trim()) continue
      const mm = part.match(/^\s*([\w-]+)\s*[=:]\s*(\S+)\s*$/)
      if (!mm) throw new UsageError(`--colors: "${part.trim()}" is not role=colour (e.g. --colors "c1=#e11d48,ink=#111")`)
      out[key(mm[1])] = mm[2]
    }
  }
  for (const r of ROLES) if (o[r] !== undefined) out[r] = o[r]
  return out
}

async function load(sub) {
  try { return await import('@withicons/mcp/' + sub) } catch (e) {
    if (e && e.code !== 'ERR_MODULE_NOT_FOUND' && e.code !== 'MODULE_NOT_FOUND') throw e
    const rel = `../../mcp/dist/${sub}.mjs` // monorepo checkout
    return await import(new URL(rel, import.meta.url).href)
  }
}

const forced = process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0'
const tty = (!!process.stdout.isTTY || !!forced) && !process.env.NO_COLOR && !process.argv.includes('--no-color')
const c = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s)
const bold = s => c(1, s), dim = s => c(2, s), green = s => c(32, s), yellow = s => c(33, s), cyan = s => c(36, s)
// a colour swatch (24-bit background) in a terminal; the hex value when piped
const swatch = hex => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!tty || !m) return hex || ''
  const n = parseInt(m[1], 16)
  return `\x1b[48;2;${n >> 16};${(n >> 8) & 255};${n & 255}m  \x1b[0m`
}
// bad option values are usage errors (2); a missing icon / palette / swap target is "not found" (1)
const USAGE_CODES = new Set(['unknown_style', 'unknown_format', 'unknown_category', 'unknown_trigger', 'unknown_preset', 'unknown_effect', 'unknown_tag', 'unknown_role', 'invalid_color'])

async function run(argv) {
  let parsed
  try { parsed = parseArgs(argv) } catch (e) {
    if (!(e instanceof UsageError)) throw e
    if (argv.includes('--json')) console.log(JSON.stringify({ error: e.message, code: 'usage' }, null, 2))
    else console.error(`withicons: ${e.message}`)
    return 2
  }
  const { args, o } = parsed
  const cmd = (args.shift() || '').toLowerCase()
  if (o.version) { const lib = await load('lib'); console.log(lib.info().version); return 0 }
  if (!cmd || o.help || cmd === 'help') {
    const meta = await load('lib').then(l => l.info(), () => ({}))
    // withicons <command> --help, withicons help <command>: that command's options
    const which = cmd === 'help' ? String(args[0] || '').toLowerCase() : cmd
    const page = which && COMMAND_HELP(meta)[COMMAND_ALIASES[which] || which]
    console.log(page || HELP(meta))
    return 0
  }
  if (cmd === 'mcp' || cmd === 'serve') { await load('stdio'); return null }
  if (cmd === 'init' || cmd === 'setup') return initCmd(args, o)
  if (cmd === 'skill' || cmd === 'skills') return skillCmd(args, o)
  const lib = await load('lib')
  const out = v => console.log(JSON.stringify(v, null, 2))
  // colours are applied by `get` only: say so instead of silently dropping them
  const colourFlags = ['palette', 'colors', ...ROLES].filter(k => o[k] !== undefined)
  if (colourFlags.length && !['get', 'g', 'svg', 'export', 'x', 'save'].includes(cmd) && !o.json)
    console.error(dim(`note: ${colourFlags.map(k => '--' + k).join(', ')} ${colourFlags.length > 1 ? 'apply' : 'applies'} to "withicons get" only (e.g. withicons get ${args[0] || 'heart'} --style ${o.style || 'retro'} --palette <id> --format ${o.framework || o.format || 'react'})`))
  const usage = msg => { if (o.json) out({ error: msg, code: 'usage' }); else console.error(msg); return 2 }
  try {
    switch (cmd) {
      case 'search': case 's': case 'find': {
        const query = args.join(' ')
        if (!query.trim()) return usage('withicons search: give some words, e.g. withicons search "throw away"')
        const r = lib.searchIcons({ query, limit: num(o, 'limit', { int: true }) || 10, style: o.style, category: o.category, format: o.format || o.framework || 'react' })
        if (o.json) { out(r); return r.count ? 0 : 1 }
        if (!r.count) {
          console.log(`No icons for "${query}".` + (r.suggestions.length ? ` Did you mean: ${r.suggestions.map(cyan).join(', ')}?` : ''))
          return 1
        }
        const w = Math.max(...r.results.map(x => x.name.length))
        for (const x of r.results) console.log(`  ${bold(x.name.padEnd(w))}  ${dim(x.category.padEnd(13))} ${dim(x.reason)}`)
        console.log(dim(`\n  withicons get ${r.results[0].name}${r.style !== 'line' ? ' --style ' + r.style : ''} --format react   ·   ${r.results[0].url}`))
        return 0
      }
      case 'get': case 'g': case 'svg': {
        if (!args.length) return usage('withicons get: which icon? e.g. withicons get home --format react')
        const colors = colorArgs(o)
        const recolour = o.palette !== undefined || Object.keys(colors).length > 0
        if (recolour && typeof lib.listPalettes !== 'function') return usage('withicons get: --palette and colour roles need a newer @withicons/mcp (npm i withicons@latest)')
        // with a palette or roles, --color is the ink (unless --ink is given)
        if (recolour && o.color !== undefined && colors.ink === undefined) colors.ink = o.color
        const size = num(o, 'size'), strokeWidth = num(o, 'stroke-width')
        const results = args.map(name => lib.getIcon({
          name, style: o.style, format: o.format || 'svg', size, strokeWidth, color: o.color, flat: !!o.flat,
          ...(recolour ? { palette: o.palette, colors } : {}),
        }))
        if (o.json) { out(results.length === 1 ? results[0] : results); return 0 }
        // several icons: the colour notes once for the command (which icons a colour applies to), not once per icon
        const summary = results.length > 1 && recolour && typeof lib.colorSummary === 'function'
          ? lib.colorSummary(results.map(r => ({ name: r.name, style: r.style, applied: r.appliedPalette || null })), { keys: Object.keys(colors).filter(k => k !== 'ink'), palette: o.palette !== undefined })
          : null
        const seen = new Set()
        for (const r of results) {
          if (r.requested) console.error(dim(`"${r.requested}" -> ${r.name}`))
          for (const n of r.notes || []) if (!(summary && / in one colour /.test(n)) && !seen.has(n)) { seen.add(n); console.error(dim(`note: ${n}`)) }
          if (!summary) for (const w of r.warnings || []) console.error(yellow(`warning: ${w}`))
          console.log(r.code)
        }
        if (summary) {
          for (const n of summary.notes) console.error(dim(`note: ${n}`))
          for (const w of summary.warnings) console.error(yellow(`warning: ${w}`))
        }
        // one hint (terminal only) when the icon is multi-coloured and was not recoloured
        const first = results[0]
        if (tty && !recolour && first.colors && first.colors.palettes && results.length === 1)
          console.error(dim(`\n${first.colors.palettes} palettes for ${first.name}: withicons palettes ${first.name} --style ${first.style}  ·  recolour: --palette <id>, --c1 <color>, --ink <color>`))
        return 0
      }
      case 'add': case 'import': {
        if (!args.length) return usage('withicons add: which icons? e.g. withicons add home settings --framework react')
        const want = String(o.framework || o.format || 'react').toLowerCase()
        if (lib.FRAMEWORKS && !lib.FRAMEWORKS.includes(want)) return usage(`withicons add: unknown framework "${want}". Frameworks: ${lib.FRAMEWORKS.join(', ')}`)
        const fw = lib.checkFormat(want)
        const style = lib.checkStyle(o.style || 'line')
        const names = args.flatMap(a => a.split(',')).filter(Boolean)
        const resolved = names.map(n => ({ requested: n, name: lib.resolveName(n) }))
        const uniq = [...new Set(resolved.map(r => r.name))]
        for (const r of resolved) if (!o.json && r.requested !== r.name) console.error(dim(`"${r.requested}" -> ${r.name}`))
        if (fw === 'svg') {
          const files = uniq.map(n => ({ name: n, svg: lib.getIcon({ name: n, style, format: 'svg' }).code }))
          if (o.json) { out({ framework: fw, style, icons: files }); return 0 }
          for (const f of files) console.log(`<!-- ${f.name} -->\n${f.svg}`)
          return 0
        }
        const install = fw === 'web-component' || fw === 'html-class' ? null : `npm install @withicons/${fw}`
        const importLine = lib.importLine(uniq, fw, style)
        const lines = uniq.map(n => lib.usageLine(n, fw, style)).filter(Boolean)
        if (o.json) { out({ framework: fw, style, install, import: importLine, usage: lines, icons: resolved }); return 0 }
        if (install) console.log(dim(`# ${install}`))
        console.log(green(importLine))
        console.log('')
        for (const u of lines) console.log(u)
        return 0
      }
      case 'palettes': case 'palette': case 'colors': case 'colours': {
        if (typeof lib.listPalettes !== 'function') { console.error('withicons palettes: this @withicons/mcp has no palette data (npm i withicons@latest)'); return 1 }
        if (!args.length) return usage('withicons palettes: which icon? e.g. withicons palettes heart --style retro')
        if (args.length > 1) console.error(dim(`palettes takes one icon; showing ${args[0]}`))
        const limit = num(o, 'limit', { int: true })
        const r = lib.listPalettes({ name: args[0], style: o.style, tag: o.tag, limit })
        if (o.json) { out(r); return r.count ? 0 : 1 }
        if (r.requested) console.error(dim(`"${r.requested}" -> ${r.name}`))
        const multi = r.multiColourStyles || []
        // which roles to show: the ones the chosen style paints with (+ ink), else the main five
        const shown = r.variables ? ['ink', ...ROLES.filter(x => x !== 'ink' && r.variables.some(v => v.role === x))] : ['ink', 'c1', 'c2', 'c3', 'c4']
        console.log(`${bold(r.name)}  ${dim(`${r.total} palette${r.total === 1 ? '' : 's'}${r.auto ? ' (general set)' : ''}${o.tag ? ` · ${r.count} tagged ${o.tag}` : ''}`)}`)
        if (r.variables) {
          if (r.variables.length) {
            console.log(dim(`${r.style}: ${r.variables.map(v => `${v.var}${v.role ? ` (${v.role}${v.role === r.mainRole ? ', main body' : ''})` : ''}`).join(', ')}`))
            if (r.mainRole && r.mainRole !== 'ink') console.log(`${bold('main role: ' + r.mainRole)}${dim(` (main body${r.mainRoleShare ? `, ~${Math.round(r.mainRoleShare * 100)}% of the drawn area` : ''}): set it for a brand colour, e.g. --${r.mainRole} "#e11d48"`)}`)
          }
          else console.log(yellow(`${r.style} draws ${r.name} in one colour (the ink).`) + dim(` Multi-colour styles: ${multi.join(', ')}`))
        } else console.log(dim(`multi-colour styles: ${multi.join(', ')}  (add --style to see the variables each palette sets)`))
        if (!r.count) { console.log(`No palettes${o.tag ? ` tagged "${o.tag}"` : ''}.`); return 1 }
        const w = Math.max(...r.palettes.map(p => p.id.length)), wn = Math.max(...r.palettes.map(p => p.name.length))
        const cw = x => tty ? Math.max(3, x.length + 1) : 8   // a 2-cell swatch (terminal) or a hex value (piped) per role
        console.log(dim(`\n  ${''.padEnd(w)}  ${shown.map(x => x.padEnd(cw(x))).join('')}`))
        for (const p of r.palettes) {
          const sw = shown.map(x => tty ? swatch(p.colors[x]) + ' '.repeat(cw(x) - 2) : (p.colors[x] || '-').padEnd(8)).join('')
          console.log(`  ${bold(p.id.padEnd(w))}  ${sw} ${p.name.padEnd(wn)}  ${dim(p.tags.join(', '))}`)
        }
        const st = (r.variables && r.variables.length ? r.style : null) || (multi.includes('sticker') ? 'sticker' : multi[0] || 'retro')
        console.log(dim(`\n  withicons get ${r.name} --style ${st} --palette ${r.palettes[0].id}   ·   tweak one colour: --${r.mainRole && r.mainRole !== 'ink' ? r.mainRole : 'c1'} "#e11d48"`))
        return 0
      }
      case 'animate': case 'motion': case 'anim': case 'motions': {
        // withicons animate <name> --list (or withicons motions <name>): that icon's tuned motions and alternates
        if (args.length && (o.list || cmd === 'motions')) {
          if (typeof lib.iconMotions !== 'function') { console.error('withicons animate --list: needs a newer @withicons/mcp (npm i withicons@latest)'); return 1 }
          if (args.length > 1) console.error(dim(`animate --list takes one icon; showing ${args[0]}`))
          const r = lib.iconMotions(args[0])
          if (o.json) { out(r); return 0 }
          const n = r.name
          const desc = x => x ? `${bold(x.preset.padEnd(8))}${dim([x.duration != null ? x.duration + 's' : '', x.amount != null ? 'amount ' + x.amount : '', x.dir != null ? 'dir ' + x.dir : ''].filter(Boolean).join(', '))}` : '-'
          const cmdl = s => dim(s)
          console.log(`${bold(n)}${r.intent ? `  ${r.intent}` : dim('  (no tuned motion: generic presets)')}`)
          console.log(`  loop      ${desc(r.loop)}  ${cmdl(`withicons animate ${n}`)}`)
          console.log(`  hover     ${desc(r.hover)}  ${cmdl(`withicons animate ${n} --trigger hover`)}`)
          for (const [k, p] of Object.entries(r.parts || {})) console.log(`  part ${k.padEnd(4)} ${desc(p)}${p.delay ? dim(`, ${p.delay}s behind`) : ''}`)
          if (r.alternates.length) {
            console.log(`
  ${bold('alternates')} ${dim("(the icon's other tuned motions; any trigger)")}`)
            for (const a of r.alternates) console.log(`  ${desc(a)}  ${cmdl(`withicons animate ${n} --preset ${a.preset}   ·   export --motion ${a.preset}`)}`)
          }
          if (r.swaps.length) console.log(`
  ${bold('swaps')}      ${r.swaps.map(x => `${x.to} (${x.effect})`).join(', ')}  ${cmdl(`withicons animate ${n} --trigger swap --to ${r.swaps[0].to}`)}`)
          console.log(dim(`
  livelier (title slides, celebrations): ${r.lively.join(', ')}   ·   every preset: withicons animate --list`))
          console.log(dim(`  as a file: withicons export ${n} --format gif --motion ${r.alternates[0] ? r.alternates[0].preset : r.lively[0]} --background "#ffffff"`))
          return 0
        }
        if (o.list || !args.length) {
          const m = lib.listMotion()
          if (o.json) { if (!args.length && !o.list) return usage('withicons animate: which icon? e.g. withicons animate bell --trigger hover'); out(m); return 0 }
          if (!args.length && !o.list) console.error('withicons animate: which icon? e.g. withicons animate bell --trigger hover')
          console.log(`${bold('triggers')}  ${m.triggers.join(', ')}
${bold('presets')}   ${m.presets.join(', ')}
${bold('effects')}   ${m.effects.join(', ')}  ${dim('(swap)')}
${bold('formats')}   ${m.formats.join(', ')}
${dim(`${m.animated} icons have a tuned animation · ${m.install.npm}`)}`)
          return o.list ? 0 : 2
        }
        if (args.length > 1) console.error(dim(`animate takes one icon; animating ${args[0]} (for a swap target use --to ${args[1]})`))
        const r = lib.animateIcon({ name: args[0], trigger: o.trigger, preset: o.preset, to: o.to, effect: o.effect, style: o.style, format: o.format || o.framework || 'html', duration: num(o, 'duration') })
        if (o.json) { out(r); return 0 }
        if (r.intent) console.error(dim(`${r.name}: ${r.intent}`))
        for (const n of r.notes || []) console.error(dim(`note: ${n}`))
        console.log(r.code)
        return 0
      }
      case 'export': case 'x': case 'save': return await exportCmd(lib, args, o, usage)
      case 'resolve': case 'r': {
        if (!args.length) return usage('withicons resolve: which name? e.g. withicons resolve bin')
        const r = lib.resolveIcon(args.join(' '))
        // a synonym ("favourites" -> star) is a match by meaning: exit 0, with the note and the other candidates
        const found = r.status === 'resolved' || r.status === 'synonym'
        if (o.json) { out(r); return found ? 0 : 1 }
        if (r.status === 'resolved') console.log(`${bold(r.name)}${r.via === 'alias' ? dim(`  (alias "${r.alias}")`) : ''}`)
        else if (r.status === 'synonym') {
          console.log(`${bold(r.name)}${dim(`  (${r.via} "${r.term}")`)}`)
          if (r.candidates && r.candidates.length > 1) console.log(dim(`also: ${r.candidates.filter(n => n !== r.name).join(', ')}`))
          if (r.note) console.error(dim(`note: ${r.note}`))
        } else if (r.status === 'ambiguous') console.log(`${yellow('ambiguous')}: ${r.candidates.join(', ')}`)
        else {
          console.log(`${yellow('unknown')}${r.nearest.length ? `, nearest: ${r.nearest.join(', ')}` : ''}`)
          if (r.didYouMean) console.log(`did you mean: ${cyan(r.didYouMean)}`)
          if (r.hint) console.log(dim(r.hint))
        }
        return found ? 0 : 1
      }
      case 'styles': {
        const s = lib.listStyles()
        if (o.json) { out({ styles: s }); return 0 }
        for (const x of s) {
          console.log(`  ${bold(x.name.padEnd(10))} ${dim(x.description || '')}`)
          const vars = Object.entries(x.vars || {})
          if (vars.length) console.log(`  ${''.padEnd(10)} ${vars.map(([k, v]) => `${swatch(v)} ${cyan(k)}`).join('  ')}`)
        }
        console.log(dim(`\n  Colour variables have defaults; override them in CSS, or: withicons get <name> --style retro --palette <id> | --c1 <color>`))
        return 0
      }
      case 'categories': case 'category': case 'list': {
        const r = lib.listCategories(args[0])
        if (o.json) { out(r); return 0 }
        if (r.icons) for (const i of r.icons) console.log(`  ${bold(i.name)}  ${dim(i.description || '')}`)
        else for (const x of r.categories) console.log(`  ${bold(x.name.padEnd(14))} ${String(x.count).padStart(3)}  ${dim(x.examples.join(', '))}`)
        return 0
      }
      default:
        return usage(`withicons: unknown command "${cmd}". Try: withicons --help`)
    }
  } catch (e) {
    if (e instanceof UsageError) return usage(`withicons: ${e.message}`)
    if (e && e.name === 'IconError') {
      if (o.json) { const { message, name, stack, ...rest } = e; out({ error: e.message, ...rest }) }
      else console.error(`withicons: ${e.message}`)
      return USAGE_CODES.has(e.code) ? 2 : 1
    }
    throw e
  }
}

const kb = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`
async function exportCmd(lib, args, o, usage) {
  const X = await import('./export.mjs')
  if (!args.length) return usage('withicons export: which icons? e.g. withicons export home settings --format svg,png --out icons')
  if (typeof lib.applyColors !== 'function' || typeof lib.svgOf !== 'function') { console.error('withicons export: needs a newer @withicons/mcp (npm i withicons@latest)'); return 1 }
  const colors = colorArgs(o)
  if (o.color !== undefined && colors.ink === undefined) colors.ink = o.color
  if (o.strict && o.palette === undefined) console.error(dim('note: --strict applies to --palette only'))
  let r
  try {
    const padding = o.padding === undefined ? undefined : Number(o.padding)
    if (padding !== undefined && !(padding >= 0 && padding <= 0.6)) throw new UsageError(`--padding must be between 0 and 0.6 (a share of the icon size), got "${o.padding}"`)
    r = await X.exportIcons(lib, {
      names: args, format: o.format, style: o.style, allStyles: !!o['all-styles'], size: num(o, 'size', { int: true }), padding, strokeWidth: num(o, 'stroke-width'),
      background: o.background, palette: o.palette, colors, motion: o.motion, duration: num(o, 'duration'), out: o.out,
      filename: o.name, nameMap: o['name-map'], strictPalette: !!o.strict,
      fps: o.fps, seconds: o.seconds, loop: o.loop, matte: o.matte, to: o.to, effect: o.effect, hold: o.hold === undefined ? undefined : num(o, 'hold', { min: -1 }),
    })
  } catch (e) {
    if (e instanceof X.ExportError) {
      if (o.json) { const { message, name, stack, usage, ...rest } = e; console.log(JSON.stringify({ error: e.message, ...rest }, null, 2)) }
      else console.error(`withicons export: ${e.message}`)
      return e.usage ? 2 : 1
    }
    throw e
  }
  for (const n of r.notes) if (!o.json) console.error(dim(`note: ${n}`))
  for (const w of r.warnings || []) if (!o.json) console.error(yellow(`warning: ${w}`))
  if (o.out === '-') {
    if (r.files.length !== 1) return usage(`withicons export: --out - prints one file, but this makes ${r.files.length}. Give a folder: --out icons`)
    process.stdout.write(r.files[0].data)
    return 0
  }
  if (o.json) {
    console.log(JSON.stringify({ count: r.files.length, notes: r.notes, warnings: r.warnings || [], files: r.files.map(({ data, ...f }) => f) }, null, 2))
    return 0
  }
  const w = Math.max(...r.files.map(f => path.relative(process.cwd(), f.file).length))
  for (const f of r.files) console.log(`  ${green('+')} ${bold(path.relative(process.cwd(), f.file).padEnd(w))}  ${dim(kb(f.bytes).padStart(8))}  ${dim(f.label)}`)
  console.log(dim(`
  ${r.files.length} file${r.files.length === 1 ? '' : 's'} saved in ${path.resolve(o.out || '.')}`))
  return 0
}

const MARK = { created: '+', added: '+', updated: '~', replaced: '~', unchanged: '=', shared: '=', kept: '=', skipped: '-', manual: '>', 'would run': '?' }
function initCmd(args, o) {
  if (o.list) {
    for (const t of TOOLS) console.log(`  ${bold(t.id.padEnd(15))} ${dim(t.name + (t.aliases.length ? '  (' + t.aliases.join(', ') + ')' : ''))}`)
    return 0
  }
  const mcp = o['no-mcp'] ? 'none' : o.mcp
  if (mcp && !['remote', 'local', 'none'].includes(mcp)) { console.error('withicons init: --mcp must be remote, local or none'); return 2 }
  let r
  try {
    r = init({ tools: args, global: !!(o.global || o.g), mcp, skill: !o['no-skill'], dryRun: !!o['dry-run'], force: !!o.force })
  } catch (e) { if (e.usage) { console.error(`withicons init: ${e.message}`); return 2 } throw e }
  if (o.json) { console.log(JSON.stringify(r, null, 2)); return r.tools.length ? 0 : 2 }
  if (!r.tools.length) {
    console.error(`No AI tools found ${r.global ? 'in your home folder' : 'in this project'}. Name one or more:\n` +
      `  npx withicons init ${TOOLS.map(t => t.id).join(' | ')}${r.global ? '' : '\n  (or add --global to install for your user)'}`)
    return 2
  }
  if (r.detected) console.log(dim(`found: ${r.tools.join(', ')}`))
  let last = ''
  for (const x of r.log) {
    const name = TOOLS.find(t => t.id === x.tool).name
    if (x.tool !== last) { console.log(bold(name)); last = x.tool }
    const status = x.status
    const mark = MARK[status] || (status.startsWith('would') ? '?' : ' ')
    const col = /created|added|updated|replaced/.test(status) ? green : /manual|kept/.test(status) ? yellow : dim
    const [first, ...rest] = String(x.note || '').split('\n')
    console.log(`  ${col(mark + ' ' + x.what.padEnd(5) + ' ' + status.padEnd(11))} ${x.where ? x.where + '  ' + dim(first) : first}`)
    for (const line of rest) console.log('      ' + line)
  }
  if (r.dryRun) console.log(dim('\ndry run: nothing was written'))
  else if (r.log.some(x => /created|added|updated|replaced/.test(x.status))) console.log(dim('\nRestart the tool (or reload its MCP servers) to pick up the changes.'))
  return 0
}

function skillCmd(args, o) {
  if (o.zip) {
    const file = path.resolve(typeof o.out === 'string' ? o.out : 'with-icons.zip')
    fs.writeFileSync(file, zipSkill())
    console.log(file)
    return 0
  }
  if (o.out) {
    const c = installSkill(path.resolve(o.out), false)
    console.log(`${path.join(path.resolve(o.out), 'with-icons')}  ${dim(`${c.created} created, ${c.updated} updated, ${c.unchanged} unchanged`)}`)
    return 0
  }
  if (o.path) {
    const e = env(), g = !!(o.global || o.g)
    const tools = args.length ? args.map(findTool).filter(Boolean) : TOOLS
    for (const t of tools) {
      const dir = t.skill.manual ? null : t.skill[g || t.globalOnly ? 'global' : 'project']
      console.log(`  ${t.id.padEnd(15)} ${dir ? e.show(e.abs(dir + '/with-icons/SKILL.md')) : dim('upload: npx withicons skill --zip')}`)
    }
    return 0
  }
  process.stdout.write(skillText())
  return 0
}

run(process.argv.slice(2)).then(code => { if (code !== null) process.exitCode = code }, e => { console.error(e); process.exitCode = 1 })
