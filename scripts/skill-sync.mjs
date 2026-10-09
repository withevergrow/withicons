#!/usr/bin/env node
// Regenerates the agent-skill name list and the website copy of the skill.
//   skills/with-icons/reference/icons.md    <- forge/icons/*.json (name, category, aliases)
//   skills/with-icons/reference/styles.md   <- the block between <!-- palettes:start/end --> (palette variables, from
//                                              packages/core/dist/styles.json written by the build) and the block between
//                                              <!-- groups:start/end --> (style groups, from forge/tools/style-groups.mjs)
//   skills/with-icons/reference/motion.md   <- the block between <!-- motion:start/end --> (animated icons, from forge/motion/*.json)
//   skills/with-icons/reference/live.md     <- the block between <!-- live:start/end --> (live icons + params, from forge/dynamic/*.mjs)
//                                              and the blocks <!-- uses -->, <!-- duo -->, <!-- holiday -->, <!-- downloads -->
//                                              (site/js/site.js USES + INFO, forge/styles/_duo-presets.mjs, _<style>-palettes.mjs)
//   site/skill/SKILL.md                     <- skills/with-icons/SKILL.md (relative links -> GitHub URLs)
//   packages/mcp/src/style-guide.mjs        <- style groups, USES, FEATURED, per-style info and packages, Duo presets,
//                                              holiday palettes, download zips: the data behind the MCP recommend_styles
//                                              tool (run this BEFORE the MCP build so the bundle carries it)
// Run after adding/renaming icons or editing aliases (scripts/deploy.mjs runs it after the build).
//   node scripts/skill-sync.mjs [--check]   --check: exit 1 if any file is out of date (CI)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { styleRank, cdnPkg, cdnDir, STYLE_PACKAGE, STYLE_ORDER } from '../forge/lib/emit-core.mjs'
import { STYLE_GROUPS, USES, FEATURED } from '../forge/tools/style-groups.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SKILL = path.join(ROOT, 'skills', 'with-icons')
const GH = 'https://github.com/withevergrow/withicons/blob/main/skills/with-icons/'
const check = process.argv.includes('--check')
const read = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n') : null)

const dir = path.join(ROOT, 'forge', 'icons')
const icons = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()
  .map(f => ({ name: f.slice(0, -5), ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }))
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'manifest.json'), 'utf8'))
const order = [...(manifest.categories || [])]
for (const i of icons) if (i.category && !order.includes(i.category)) order.push(i.category)
const pascal = n => n.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')

// styles: the build's metadata when present, else the renderer files (in the same order as the build)
const rank = styleRank
const builtStyles = (() => { try { return JSON.parse(read(path.join(ROOT, 'packages', 'core', 'dist', 'styles.json'))) } catch { return null } })()
const rendererStyles = fs.readdirSync(path.join(ROOT, 'forge', 'styles')).filter(f => f.endsWith('.mjs') && !f.startsWith('_'))
  .map(f => ({ name: f.slice(0, -4) })).sort((a, b) => rank(a.name) - rank(b.name) || (a.name < b.name ? -1 : 1))
// a build older than the newest renderers (new styles landed since) would undercount: trust the renderer files then
// the roster is STYLE_ORDER (forge/lib/emit-core.mjs): a renderer file or a built style it no longer lists (a retired style
// still on disk, a build from before a roster change) is left out
const onRoster = s => STYLE_ORDER.includes(s.name)
const styles = (builtStyles && rendererStyles.filter(onRoster).every(r => builtStyles.some(b => b.name === r.name)) ? builtStyles : rendererStyles).filter(onRoster)

let md = `# with icons: all ${icons.length} icon names\n\n` +
  `Generated from the icon sources. Do not edit by hand.\n` +
  `Use the **name** (kebab-case) in name-based APIs and the **component** in imports. Aliases resolve in name-based APIs\n` +
  `and search only, and are never exports. Every icon exists in all ${styles.length} styles (${styles.map(s => s.name).join(', ')}).\n\n`
for (const cat of order) {
  const list = icons.filter(i => i.category === cat)
  if (!list.length) continue
  md += `## ${cat} (${list.length})\n\n| name | component | aliases |\n|---|---|---|\n`
  for (const i of list) md += `| \`${i.name}\` | \`${pascal(i.name)}\` | ${(i.aliases || []).slice(0, 8).join(', ')} |\n`
  md += '\n'
}

// generated blocks inside hand-written reference files
const block = (text, key, body) => {
  const a = `<!-- ${key}:start -->`, b = `<!-- ${key}:end -->`
  const i = text.indexOf(a), j = text.indexOf(b)
  return i >= 0 && j > i ? text.slice(0, i + a.length) + '\n' + body + text.slice(j) : text
}
const pal = (builtStyles || []).filter(s => s.palette && onRoster(s))
const palBody = pal.length
  ? `| style | CSS variables (default) |\n|---|---|\n` +
    pal.map(s => `| \`${s.name}\` | ${Object.entries(s.vars || {}).filter(([, v]) => v !== 'currentColor').map(([k, v]) => `\`${k}\` ${v}`).join(', ')} |`).join('\n') + '\n'
  : `_Run \`node forge/build.mjs\` to list the palette variables._\n`
// style groups (Everyday, Crafted, Playful, Studio, Storybook, AI, Product, Trend …): one source of truth, site/js/site.js GROUPS
const styleNames = new Set(styles.map(s => s.name))
const groupsBody = '| group | styles |\n|---|---|\n' + STYLE_GROUPS
  .map(g => [g, g.styles.filter(s => styleNames.has(s))]).filter(([, l]) => l.length)
  .map(([g, l]) => `| ${g.title} | ${l.map(s => '`' + s + '`').join(', ')} |`).join('\n') + '\n'
// where each style's files live: @withicons/core and @withicons/classes keep the older styles, the newest ones are in
// companion packages (jsDelivr serves at most 150 MB per package; forge/lib/emit-core.mjs cdnPkg / cdnDir)
const companion = styles.map(s => s.name).filter(n => cdnPkg(n) !== 'core' || cdnPkg(n, 'classes') !== 'classes')
const tick = '`'
const code = x => tick + x + tick
const nodesImport = n => cdnPkg(n) === n ? '@withicons/' + n : '@withicons/' + cdnPkg(n) + '/nodes/' + n
const packagesBody = companion.length
  ? "The newest styles' files live in companion packages (jsDelivr serves at most 150 MB per package). The framework packages\n" +
    '(react, vue, svelte, angular, solid) hold every style. ' + code('@withicons/web') + ' installs ' + code('@withicons/web-plus') +
    ' and loads it by itself (CDN or bundler), and the classes loader and runtime find the class companions by themselves,\n' +
    'so pages never name a companion. Name one only for direct file URLs, ' + code('@withicons/core') + ' node imports or self-hosting.\n' +
    'The two SVG columns hold the same standalone files (colours baked in): take files and sprites from the static package,\n' +
    'node data for ' + code('toSvg') + ' from the core companion.\n\n' +
    '| style | SVG files + IconNode data | prebuilt SVG + sprites | CSS class files |\n|---|---|---|---|\n' +
    companion.map(n => `| ${code(n)} | ${code('@withicons/' + cdnPkg(n))} (${code(cdnDir(n) + '/svg/' + n + '/<name>.svg')}, import ${code(nodesImport(n))}) | ${code('@withicons/' + cdnPkg(n, 'static'))} (${code('dist/svg/' + n + '/<name>.svg')}, ${code('dist/sprite-' + n + '.svg')}) | ${code('@withicons/' + cdnPkg(n, 'classes'))} (${code(cdnDir(n, 'classes') + '/' + n + '/<name>.css')}) |`).join('\n') + '\n\n' +
    'CDN file URL of any style: ' + code('https://cdn.jsdelivr.net/npm/@withicons/<package>@latest/dist/svg/<style>/<name>.svg') +
    ' with the package from this table (' + code('static') + ' / ' + code('core') + ' for the styles not listed).\n\n' +
    'In short, by package (every other style is in ' + code('@withicons/core') + ', ' + code('@withicons/static') + ' and ' + code('@withicons/classes') + '):\n\n' +
    (() => {
      const by = (base) => { const m = new Map(); for (const n of companion) { const k = '@withicons/' + cdnPkg(n, base); m.set(k, [...(m.get(k) || []), n]) } return m }
      const lines = []
      for (const [k, l] of by('core')) lines.push(`- ${code(k)}: SVG files and node data of ${l.map(code).join(', ')}`)
      for (const [k, l] of by('static')) lines.push(`- ${code(k)}: prebuilt SVGs and sprites (${code('dist/sprite-<style>.svg')}) of ${l.map(code).join(', ')}`)
      for (const [k, l] of by('classes')) if (!lines.some(x => x.startsWith('- ' + code(k)))) lines.push(`- ${code(k)}: CSS class files of ${l.map(code).join(', ')}`)
        else lines.push(`- ${code(k)} also: CSS class files of ${l.map(code).join(', ')} (${code('dist/classes/')})`)
      return lines.join('\n') + '\n'
    })() + '\n' +
    'Sprite URL: ' + code('https://cdn.jsdelivr.net/npm/@withicons/<static or static-plus>@latest/dist/sprite-<style>.svg') +
    ' (e.g. ' + code('…/@withicons/static-plus@latest/dist/sprite-soft3d.svg') + '). Download it and serve it from your own origin: ' +
    'browsers block a cross-origin ' + code('<use href>') + '.\n'
  : 'Every style lives in ' + code('@withicons/core') + ' and ' + code('@withicons/classes') + '.\n'

// ---- the style guide: what to use for what (site/js/site.js USES + INFO), Duo presets, holiday palettes, zips
const SITE_JS = read(path.join(ROOT, 'site', 'js', 'site.js')) || ''
// the object literal after `var <name> = ` in site.js, evaluated (plain data), or null
function objectLiteral(src, name) {
  const at = src.indexOf(`var ${name} = {`)
  if (at < 0) return null
  const open = src.indexOf('{', at)
  let depth = 0, end = -1, quote = null
  for (let k = open; k < src.length; k++) {
    const c = src[k]
    if (quote) { if (c === '\\') k++; else if (c === quote) quote = null; continue }
    if (c === "'" || c === '"' || c === '`') quote = c
    else if (c === '{') depth++
    else if (c === '}' && --depth === 0) { end = k; break }
  }
  if (end < 0) return null
  try { return new Function(`return ${src.slice(open, end + 1)}`)() } catch { return null }
}
const INFO = objectLiteral(SITE_JS, 'INFO') || {}
const stylesFile0 = path.join(SKILL, 'reference', 'styles.md')
// min sizes from the hand-written styles.md table (`| \`clay\` | group | look | use | 32px |`)
const minSizes = {}
for (const m of (read(stylesFile0) || '').matchAll(/^\| `([a-z]+)` \|[^|]*\|[^|]*\|[^|]*\| (\d+)px/gm)) minSizes[m[1]] = +m[2]
const usesList = USES.map(u => ({ id: u.id, title: u.title, styles: u.styles.filter(s => styleNames.has(s)) })).filter(u => u.styles.length)
const usesBody = '| making | best styles, best first |\n|---|---|\n' +
  usesList.map(u => `| ${u.title} | ${u.styles.map(s => code(s)).join(', ')} |`).join('\n') + '\n'
const { DUO_PRESETS } = await import(pathToFileURL(path.join(ROOT, 'forge', 'styles', '_duo-presets.mjs')).href).catch(() => ({ DUO_PRESETS: {} }))
const duoBody = '| preset | look | CSS variables | strokeWidth | where |\n|---|---|---|---|---|\n' +
  Object.entries(DUO_PRESETS).map(([id, p]) => `| ${p.title} (${code(id)}) | ${String(p.description).replace(/\|/g, '/')} | ${code(Object.entries(p.vars).map(([k, v]) => `${k}: ${v}`).join('; '))} | ${p.strokeWidth || ''} | ${p.render ? 'site and studio only (exports bake it in); no package API yet' : 'every package (CSS variables on the icon or a parent)'} |`).join('\n') + '\n'
// holiday (and any other) style palettes: forge/styles/_<style>-palettes.mjs exports PALETTES [{ id, name, tags, colors }]
const stylePalettes = {}
for (const f of fs.readdirSync(path.join(ROOT, 'forge', 'styles')).filter(f => /^_[a-z]+-palettes\.mjs$/.test(f)).sort()) {
  const st = f.slice(1, -'-palettes.mjs'.length)
  if (!styleNames.has(st)) continue
  try { const m = await import(pathToFileURL(path.join(ROOT, 'forge', 'styles', f)).href); if (Array.isArray(m.PALETTES)) stylePalettes[st] = m.PALETTES.filter(p => p && p.id && p.colors).map(p => ({ id: p.id, name: p.name || p.id, tags: p.tags || [], colors: p.colors })) }
  catch (e) { console.warn(`style palettes ${f}: ${e.message}`) }
}
const holidayBody = Object.keys(stylePalettes).length
  ? '| style | palettes (id: name), the first is the default |\n|---|---|\n' +
    Object.entries(stylePalettes).map(([st, l]) => `| ${code(st)} | ${l.map(p => `${code(p.id)}: ${p.name}`).join(', ')} |`).join('\n') + '\n'
  : '_No style palettes yet._\n'
// every holiday palette's colours as role flags (CLI --colors, MCP colors, or --with-<style>-<role> in CSS)
const ROLE_ORDER = ['ink', 'c1', 'c2', 'c3', 'c4', 'tint', 'accent', 'shadow', 'shine', 'edge']
const roleFlags = c => ROLE_ORDER.filter(r => c[r]).map(r => `${r}=${c[r]}`).join(',')
const holidayColorsBody = Object.keys(stylePalettes).length
  ? '| style | palette | `--colors` (roles: CLI `--colors "…"`, MCP `colors`, CSS `--with-<style>-<role>`) |\n|---|---|---|\n' +
    Object.entries(stylePalettes).flatMap(([st, l]) => l.map(p => `| ${code(st)} | ${code(p.id)} | ${code(roleFlags(p.colors))} |`)).join('\n') + '\n'
  : ''
// people avatars: skin is always c1, hair (or the turban, cap, hoodie fabric) c2 and its shade c3; the tones
// from avatar-person's true-to-life palettes ("<skin>-and-<hair>")
const avatarBody = (() => {
  let pal
  try { pal = JSON.parse(read(path.join(ROOT, 'forge', 'palettes', 'avatar-person.json'))).palettes.filter(p => (p.tags || []).includes('true-to-life')) } catch { return '_No avatar palettes._\n' }
  const skin = new Map(), hair = new Map()
  for (const p of pal) {
    const m = /^(.+?)-and-(.+)$/.exec(p.id)
    if (!m) continue
    if (!skin.has(m[1])) skin.set(m[1], [p.colors.c1, p.colors.tint, p.colors.shadow])
    if (!hair.has(m[2])) hair.set(m[2], [p.colors.c2, p.colors.c3])
  }
  const people = icons.filter(i => i.category === 'avatars').map(i => i.name)
  return `Skin tones (c1 = skin, tint = its light, shadow = its shade), from \`avatar-person\`'s true-to-life palettes:\n\n| skin | c1 | tint | shadow |\n|---|---|---|---|\n` +
    [...skin].map(([k, [c, t, s]]) => `| ${k} | ${c} | ${t} | ${s} |`).join('\n') +
    `\n\nHair (c2 = hair, c3 = its shade):\n\n| hair | c2 | c3 |\n|---|---|---|\n` +
    [...hair].map(([k, [c, s]]) => `| ${k} | ${c} | ${s} |`).join('\n') +
    `\n\nAvatars (${people.length}): ${people.map(n => code(n)).join(', ')}.\n`
})()
const downloadsBody = `Every style as one zip: \`https://withicons.com/downloads/with-icons-<style>.zip\` (all ${icons.length} SVGs with the colours baked in,\n` +
  'an offline searchable viewer `index.html`, LICENSE and README), e.g. ' + [...styleNames].slice(0, 3).map(s => code(`https://withicons.com/downloads/with-icons-${s}.zip`)).join(', ') +
  `. Every style in one: \`https://withicons.com/downloads/with-icons-all.zip\` (svg/<style>/<name>.svg, no viewer). Styles: ${[...styleNames].join(', ')}.\n`

// packages/mcp/src/style-guide.mjs: the same data for the MCP server (bundled into the stdio, lib and Lambda builds)
const pick = (o, ks) => Object.fromEntries(ks.filter(k => o && o[k] != null).map(k => [k, o[k]]))
const guide = {
  groups: STYLE_GROUPS.map(g => ({ id: g.id, title: g.title, blurb: g.blurb || '', styles: g.styles.filter(s => styleNames.has(s)) })).filter(g => g.styles.length),
  uses: usesList,
  featured: FEATURED.filter(s => styleNames.has(s)),
  styles: Object.fromEntries([...styleNames].map(n => [n, {
    ...pick(INFO[n] || {}, ['title', 'plain', 'good', 'who']),
    ...(minSizes[n] ? { minSize: minSizes[n] } : {}),
    packages: { core: '@withicons/' + cdnPkg(n), classes: '@withicons/' + cdnPkg(n, 'classes'), static: '@withicons/' + cdnPkg(n, 'static'), web: '@withicons/' + cdnPkg(n, 'web') },
    nodes: cdnPkg(n) === 'core' ? '@withicons/core/nodes/' + n : nodesImport(n),
    zip: `https://withicons.com/downloads/with-icons-${n}.zip`,
  }])),
  stylePackages: STYLE_PACKAGE,
  duoPresets: DUO_PRESETS,
  stylePalettes,
  downloads: { style: 'https://withicons.com/downloads/with-icons-<style>.zip', all: 'https://withicons.com/downloads/with-icons-all.zip' },
}
const guideJs = '// GENERATED by scripts/skill-sync.mjs from site/js/site.js (GROUPS, USES, FEATURED, INFO), forge/lib/emit-core.mjs\n' +
  '// (STYLE_PACKAGE, cdnPkg), forge/styles/_duo-presets.mjs and forge/styles/_<style>-palettes.mjs. Do not edit by hand.\n' +
  'export default ' + JSON.stringify(guide) + '\n'
const motionDir = path.join(ROOT, 'forge', 'motion')
const specs = fs.existsSync(motionDir) ? fs.readdirSync(motionDir).filter(f => f.endsWith('.json')).sort().map(f => {
  try { return { name: f.slice(0, -5), ...JSON.parse(fs.readFileSync(path.join(motionDir, f), 'utf8')) } } catch { return null }
}).filter(s => s && s.loop && s.hover) : []
const motionBody = `${specs.length} icons have a tuned animation (any icon can use any preset).\n\n| icon | loop | hover | swaps to | what it says |\n|---|---|---|---|---|\n` +
  specs.map(s => `| \`${s.name}\` | ${s.loop.preset} | ${s.hover.preset} | ${(s.swap || []).map(x => `\`${x.to}\``).join(', ')} | ${String(s.intent || '').replace(/\|/g, '/')} |`).join('\n') + '\n'

// live icons (@withicons/dynamic): name, what it shows, params (attribute, range or options, default)
const liveDir = path.join(ROOT, 'forge', 'dynamic')
const lives = []
if (fs.existsSync(liveDir)) for (const f of fs.readdirSync(liveDir).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).sort()) {
  try { const g = (await import(pathToFileURL(path.join(liveDir, f)).href)).default; if (g && g.name && g.params) lives.push(g) }
  catch (e) { console.warn(`live icon ${f}: ${e.message}`) }
}
const cell = t => String(t == null ? '' : t).replace(/\s*—\s*/g, ': ').replace(/\|/g, '/').replace(/\s*\n\s*/g, ' ')
const kebab = k => k.replace(/[A-Z]/g, c => '-' + c.toLowerCase())
const paramText = (k, p) => {
  const t = p.type
  const range = t === 'int' || t === 'number' ? `${p.min} to ${p.max}${p.step ? `, step ${p.step}` : ''}`
    : t === 'enum' ? (p.options || []).join(' / ')
    : t === 'level' ? '0 to 1 (or "80%")'
    : t === 'text' ? `text, up to ${p.maxLength}${p.case === 'upper' ? ', uppercased' : ''}`
    : t === 'time' ? '"HH:MM"' : t === 'bool' ? 'true / false' : t
  // a param called `label` clashes with the accessible-name attribute: param-label on the element, params={{ label }} on LiveIcon
  const attr = k === 'label' ? 'param-label' : kebab(k)
  return `\`${attr}\` ${range} (${JSON.stringify(p.default)})${p.label ? ': ' + cell(p.label) : ''}`
}
const liveBody = `${lives.length} live icons. Params are kebab-case attributes on \`<with-live-icon>\` (as listed) and camelCase props on ` +
  `\`LiveIcon\` / keys for \`render()\`; the default is in brackets.\n\n| name | what it shows | params |\n|---|---|---|\n` +
  lives.map(g => `| \`${g.name}\` | ${cell(g.description || g.title)} | ${Object.entries(g.params).map(([k, p]) => paramText(k, p)).join('<br>')} |`).join('\n') + '\n'

// keep the counts in the hand-written skill text true: "500 icons", "12 styles", "6,000 icons"
const total = (icons.length * styles.length).toLocaleString('en-US')
const counts = text => text
  .replace(/\b\d,\d{3}(?= (?:icons|SVGs)\b)/g, total)
  .replace(/\b\d{3}(?= (?:MIT-licensed |open-source |canonical )?(?:icons|names|skeletons)\b)/g, String(icons.length))
  .replace(/\b(?:\d{1,2}|seven|twelve)(?= (?:visual )?styles\b)/g, String(styles.length))
  .replace(/(?<=in all )\d{1,2}(?= styles)/g, String(styles.length))

const stylesFile = path.join(SKILL, 'reference', 'styles.md'), motionFile = path.join(SKILL, 'reference', 'motion.md')
const liveFile = path.join(SKILL, 'reference', 'live.md')
const skill = counts(read(path.join(SKILL, 'SKILL.md')))
const siteCopy = skill.replace(/\]\((reference\/[^)]+)\)/g, (_, p) => `](${GH}${p})`)

const outputs = [[path.join(SKILL, 'SKILL.md'), skill], [path.join(SKILL, 'reference', 'icons.md'), md], [path.join(ROOT, 'site', 'skill', 'SKILL.md'), siteCopy]]
const blocks = (text, map) => Object.entries(map).reduce((t, [k, v]) => block(t, k, v), text)
for (const f of ['search.md', 'frameworks.md', 'files.md', 'chat.md']) { const p = path.join(SKILL, 'reference', f); if (read(p)) outputs.push([p, blocks(counts(read(p)), { packages: packagesBody, downloads: downloadsBody, uses: usesBody })]) }
if (read(stylesFile)) outputs.push([stylesFile, blocks(counts(read(stylesFile)), { palettes: palBody, groups: groupsBody, uses: usesBody, duo: duoBody, holiday: holidayBody, 'holiday-colors': holidayColorsBody, avatars: avatarBody, downloads: downloadsBody })])
outputs.push([path.join(ROOT, 'packages', 'mcp', 'src', 'style-guide.mjs'), guideJs])
// the per-icon table is long (one row per icon): it lives in its own file so motion.md stays readable
const motionIconsBody = `# with icons: every icon's tuned animation\n\nGenerated, do not edit by hand. How to use these: [motion.md](motion.md). ` +
  `Pass the loop or hover preset as \`preset\` (or \`wm-p-<preset>\`) to play it on another trigger; in a 3D style each plays as its 3D counterpart (motion.md).\n\n` + motionBody
outputs.push([path.join(SKILL, 'reference', 'motion-icons.md'), motionIconsBody])
if (read(motionFile)) outputs.push([motionFile, block(counts(read(motionFile)), 'motion', `${specs.length} icons have a tuned animation (any icon can use any preset). The table (icon, loop, hover, swaps, what it says) is in [motion-icons.md](motion-icons.md); grep it for one icon.\n`)])
if (read(liveFile)) outputs.push([liveFile, block(counts(read(liveFile)), 'live', liveBody)])
let stale = 0
for (const [file, text] of outputs) {
  const cur = read(file)
  if (cur === text) continue
  stale++
  if (check) console.log(`out of date: ${path.relative(ROOT, file)}`)
  else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); console.log(`wrote ${path.relative(ROOT, file)}`) }
}
if (check && stale) { console.log('run: node scripts/skill-sync.mjs'); process.exit(1) }
if (!stale) console.log('skill files up to date')
