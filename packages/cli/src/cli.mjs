// `withicons` — with icons from the terminal. Data, search and code generation come from @withicons/mcp/lib.
import fs from 'node:fs'
import path from 'node:path'
import { TOOLS, init, env, findTool, installSkill, skillText, zipSkill } from './init.mjs'

const HELP = ({ icons = 'all', styles = [], palettes } = {}) => `withicons — ${icons} icons x ${styles.length || 'every'} styles from the terminal (https://withicons.com)

Usage
  withicons search <words...>        find icons by meaning ("throw away", "settigns", "money")
  withicons get <name...>            print icons (SVG by default) or framework code
  withicons add <name...>            print import lines + usage for a framework
  withicons export <name...>         save files: svg, pdf, png, ico, favicons, android, ios, jsx, pptx, lottie, …
  withicons palettes <name>          the colour palettes picked for an icon${palettes ? ` (${palettes} in all)` : ''}
  withicons animate <name>           animation code (@withicons/motion): loop, hover, once, inview, swap
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

Colours (multi-colour styles: duo, blueprint, glass, kawaii, sticker, pixel, retro)
  --palette <id>            get: apply one of the icon's palettes (withicons palettes <name>)
  --ink, --c1 … --c4, --tint, --accent, --shadow, --shine, --edge <color>
                            get: set any colour role (on top of --palette, or alone)
  --colors <k=v,...>        get: several at once: "c1=#e11d48,ink=#111" or a variable "retro-2=#0ea5e9"
  --tag <tag>               palettes: only palettes with this tag (pastel, neon, retro, …)

Motion
  --trigger, -t <t>         animate: loop (default), hover, once, inview, swap
  --preset, -p <preset>     animate: override the motion (spin, ring, beat, float, pop, …; animate --list)
  --to <name[@style]>       animate --trigger swap: the icon to turn into (default: the icon's suggestion)
  --effect <effect>         animate --trigger swap: fade, flip, scale, rotate, slide-up, morph, …
  --duration <s>            animate: seconds per cycle

Export (files for designers, apps and CI)
  --format, -f <list>       export: one or more, comma separated (default svg), or all:
                              vector  svg (keeps CSS variables), svg-flat (colours baked in), pdf, eps
                              images  png, png-set (@1x-@4x zip), ico, favicon-pack (zip)
                              apps    android (VectorDrawable xml), ios (Xcode imageset zip)
                              code    jsx, tsx, vue, svelte, react-native, angular, html, css, data-uri, base64
                              office  pptx, pptx-sheet (every style), docx
                              motion  lottie, dotlottie
  --out, -o <dir>           export: folder to write to (default: here); "-" prints one file to stdout
  --size <n>                export: pixels (png 512, png-set base 24, svg 24, pdf/eps 512, lottie 512)
  --background <color>      export: transparent (default) or a hex colour, e.g. "#ffffff"
  --palette, --color, --c1 … export: colours, as for get (--color is the ink)
  --motion <m>              export: loop, hover, once, none, or a preset (ring, spin, …; hover:ring)
                              for lottie, dotlottie and the code formats
  --all-styles              export: every style, one file each
  --padding <0-0.4>         export: empty space around the icon, as a share of its size
  PNG-based formats (png, png-set, ico, favicon-pack, pptx, pptx-sheet, docx) use @resvg/resvg-js:
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
  npx withicons export heart --all-styles --format png --palette classic-red --out hearts
  npx withicons init cursor
  npx withicons init claude-code codex --global --mcp local`

const ROLES = ['ink', 'c1', 'c2', 'c3', 'c4', 'tint', 'accent', 'shadow', 'shine', 'edge']
const FLAGS = { s: 'style', f: 'format', n: 'limit', c: 'category', fw: 'framework', v: 'version', h: 'help', t: 'trigger', p: 'preset', g: 'global', colours: 'colors', colour: 'color',
  o: 'out', formats: 'format', bg: 'background', 'all-style': 'all-styles', 'every-style': 'all-styles' }
const BOOL = new Set(['json', 'version', 'help', 'raw', 'no-color', 'global', 'dry-run', 'force', 'no-mcp', 'no-skill', 'print', 'path', 'zip', 'list', 'flat', 'all-styles'])
const VALUE = new Set(['style', 'format', 'framework', 'size', 'stroke-width', 'color', 'trigger', 'preset', 'to', 'effect', 'duration', 'limit',
  'category', 'mcp', 'out', 'palette', 'colors', 'tag', 'background', 'motion', 'padding', ...ROLES])
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
  if (!cmd || o.help || cmd === 'help') { console.log(HELP(await load('lib').then(l => l.info(), () => ({})))); return 0 }
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
        for (const r of results) {
          if (r.requested) console.error(dim(`"${r.requested}" -> ${r.name}`))
          for (const n of r.notes || []) console.error(dim(`note: ${n}`))
          console.log(r.code)
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
          if (r.variables.length) console.log(dim(`${r.style}: ${r.variables.map(v => `${v.var}${v.role ? ` (${v.role})` : ''}`).join(', ')}`))
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
        console.log(dim(`\n  withicons get ${r.name} --style ${st} --palette ${r.palettes[0].id}   ·   tweak one colour: --c1 "#e11d48"`))
        return 0
      }
      case 'animate': case 'motion': case 'anim': {
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
        if (o.json) { out(r); return r.status === 'resolved' ? 0 : 1 }
        if (r.status === 'resolved') console.log(`${bold(r.name)}${r.via === 'alias' ? dim(`  (alias "${r.alias}")`) : ''}`)
        else if (r.status === 'ambiguous') console.log(`${yellow('ambiguous')}: ${r.candidates.join(', ')}`)
        else console.log(`${yellow('unknown')}${r.nearest.length ? ` — nearest: ${r.nearest.join(', ')}` : ''}`)
        return r.status === 'resolved' ? 0 : 1
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
  let r
  try {
    const padding = o.padding === undefined ? undefined : Number(o.padding)
    if (padding !== undefined && !(padding >= 0 && padding <= 0.4)) throw new UsageError(`--padding must be between 0 and 0.4 (a share of the icon size), got "${o.padding}"`)
    r = await X.exportIcons(lib, {
      names: args, format: o.format, style: o.style, allStyles: !!o['all-styles'], size: num(o, 'size', { int: true }), padding,
      background: o.background, palette: o.palette, colors, motion: o.motion, duration: num(o, 'duration'), out: o.out,
    })
  } catch (e) {
    if (e instanceof X.ExportError) {
      if (o.json) console.log(JSON.stringify({ error: e.message, code: e.code }, null, 2))
      else console.error(`withicons export: ${e.message}`)
      return e.usage ? 2 : 1
    }
    throw e
  }
  for (const n of r.notes) if (!o.json) console.error(dim(`note: ${n}`))
  if (o.out === '-') {
    if (r.files.length !== 1) return usage(`withicons export: --out - prints one file, but this makes ${r.files.length}. Give a folder: --out icons`)
    process.stdout.write(r.files[0].data)
    return 0
  }
  if (o.json) {
    console.log(JSON.stringify({ count: r.files.length, notes: r.notes, files: r.files.map(({ data, ...f }) => f) }, null, 2))
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
