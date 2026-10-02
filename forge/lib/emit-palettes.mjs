#!/usr/bin/env node
// emit-palettes — per-icon colour palette suggestions (forge/PALETTES.md) for the site and @withicons/core.
//
//   site/data/palettes/<name>.js           (window.WITH_PALETTES=window.WITH_PALETTES||{})["<name>"]=[palette, …]
//                                          lazy, one small file per icon (the editor loads it on demand; icon pages include it)
//   site/js/palette-map.js                 classic-script copy of forge/lib/palette-map.mjs -> window.WithPalette
//                                          (generated, never hand-edited: the mapping logic lives only in the .mjs)
//   packages/core/dist/palettes/<name>.json  { name, auto, palettes: [palette, …] }
//   packages/core/dist/palettes/index.json   { roles, roleLabels, tags, icons: { <name>: { count, auto, tags } } }
//   packages/core/dist/palettes/palette-map.{mjs,cjs,d.ts}   rolesFor / applyPalette / bakePalette for consumers
//
// A palette is { id, name, tags[], colors: { ink, c1, c2, c3, c4, tint, accent, shadow, shine, edge } } (hex #RRGGBB).
// Source: forge/palettes/<name>.json (hand-picked, 20-30 per icon). An icon without a valid file gets a small automatic
// set derived from the palette styles' default colours (auto: true). Output is deterministic (input order, sorted keys).
// Runs inside forge/build.mjs (after emit-core, which owns the rest of packages/core/dist), or standalone:
//   node forge/lib/emit-palettes.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

export const after = ['core']

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC_DIR = path.join(ROOT, 'forge', 'palettes')
const MAP_SRC = path.join(ROOT, 'forge', 'lib', 'palette-map.mjs')
const SITE_DIR = 'site/data/palettes'
const CORE_DIR = 'packages/core/dist/palettes'
const ROLES = ['ink', 'c1', 'c2', 'c3', 'c4', 'tint', 'accent', 'shadow', 'shine', 'edge']
const TAGS = ['true-to-life', 'pastel', 'vivid', 'neon', 'earthy', 'retro', 'vintage', 'mono', 'grayscale', 'dark', 'on-dark', 'luxe',
  'seasonal', 'nature', 'ocean', 'sunset', 'candy', 'accessible', 'corporate', 'y2k']

// Automatic set for icons without a hand-picked file: the five palette styles' defaults first, then general moods.
const P = (id, name, tags, ink, c1, c2, c3, c4, tint, accent, shadow, shine, edge) => ({ id, name, tags, colors: { ink, c1, c2, c3, c4, tint, accent, shadow, shine, edge } })
const FALLBACK = [
  P('retro-sunset', 'Retro sunset', ['retro', 'sunset'], '#2A1A12', '#F4B53F', '#EF7D2D', '#DE4B3A', '#178A86', '#FCE9C2', '#DE4B3A', '#6B3323', '#FFF6E0', '#FFF8EC'),
  P('candy-sticker', 'Candy sticker', ['candy', 'vivid'], '#1D1530', '#FF6FB5', '#A98BFF', '#FFD43B', '#3FDDA4', '#FFE0F0', '#5BC6FF', '#1D1530', '#FFFFFF', '#FFFFFF'),
  P('kawaii-pastel', 'Kawaii pastel', ['pastel', 'candy'], '#3A2E4A', '#FF6FA5', '#FF9A66', '#FFD23A', '#45D99A', '#FFE3EE', '#FF6F9C', '#8A3B5C', '#FFFFFF', '#FFFFFF'),
  P('cobalt-glass', 'Cobalt glass', ['vivid', 'corporate'], '#1B2390', '#3D5AFE', '#5AB4FF', '#A98BFF', '#FF4D8D', '#C7D0FF', '#FF4D8D', '#141A5C', '#FFFFFF', '#FFFFFF'),
  P('pixel-meadow', 'Pixel meadow', ['nature', 'vivid'], '#1E3A10', '#4FAE0C', '#F2C14E', '#3D8BD9', '#E2522F', '#E5F7D3', '#F2C14E', '#23410A', '#D9F99D', '#FFFFFF'),
  P('deep-ocean', 'Deep ocean', ['ocean'], '#0B2540', '#1E88E5', '#26C6DA', '#80DEEA', '#FFB74D', '#D6ECFB', '#FFB74D', '#0D3B66', '#E3F6FF', '#FFFFFF'),
  P('forest-walk', 'Forest walk', ['nature', 'earthy'], '#1F2A1C', '#4C8C4A', '#A3C46C', '#8C5A3C', '#E9C46A', '#E1EDD5', '#E9C46A', '#2C3E26', '#F1F7E8', '#FFFDF5'),
  P('berry-jam', 'Berry jam', ['vivid'], '#2B0F24', '#C2185B', '#7B1FA2', '#F06292', '#FFB300', '#F8D7E6', '#FFB300', '#4A1036', '#FFE3F0', '#FFF8FB'),
  P('citrus-pop', 'Citrus pop', ['vivid', 'seasonal'], '#2E2A0E', '#FFC107', '#FF7043', '#8BC34A', '#FFF176', '#FFF4C7', '#FF7043', '#7A5A00', '#FFFDE7', '#FFFFFF'),
  P('sage-clay', 'Sage & clay', ['earthy', 'vintage'], '#3B2F2A', '#9CAF88', '#D08C60', '#E8D5B5', '#6B705C', '#EEF1E8', '#D08C60', '#5B4636', '#F7F3EA', '#FFFCF5'),
  P('luxe-gold', 'Luxe gold', ['luxe', 'dark'], '#0E0E10', '#C9A227', '#2B2B30', '#E7D38A', '#8C6D1F', '#F5EBC9', '#E7D38A', '#000000', '#FFF6D5', '#FFFDF5'),
  P('graphite', 'Graphite', ['mono', 'grayscale'], '#111318', '#5C6270', '#8A909C', '#B9BEC7', '#2E323B', '#E4E6EA', '#8A909C', '#1B1E24', '#F4F5F7', '#FFFFFF'),
  P('midnight-neon', 'Midnight neon', ['neon', 'on-dark'], '#E8F7FF', '#00E5FF', '#FF2BD6', '#B6FF3B', '#7C4DFF', '#0E2A3A', '#FF2BD6', '#05060A', '#FFFFFF', '#0B0B12'),
]

const isHex = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v.trim())
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Validate + normalise one source file. Returns { list, problems }.
export function normalise(name, json) {
  const problems = []
  const src = json && Array.isArray(json.palettes) ? json.palettes : []
  if (json && json.name && json.name !== name) problems.push(`name "${json.name}" != file name`)
  const ids = new Set(), list = []
  for (const p of src) {
    if (!p || typeof p !== 'object') continue
    const colors = {}
    for (const r of ROLES) if (p.colors && isHex(p.colors[r])) colors[r] = p.colors[r].trim().toUpperCase()
    if (!colors.c1) { problems.push(`${p.id || '?'}: no valid c1`); continue }
    let id = slug(p.id || p.name || 'palette') || 'palette'
    while (ids.has(id)) id += '-2'
    ids.add(id)
    const tags = [...new Set((Array.isArray(p.tags) ? p.tags : []).map(String).filter(t => TAGS.includes(t)))].slice(0, 3)
    list.push({ id, name: String(p.name || id).trim().slice(0, 32), tags, colors })
  }
  return { list: list.slice(0, 30), problems }
}

function readSource(name) {
  const f = path.join(SRC_DIR, name + '.json')
  if (!fs.existsSync(f)) return null
  try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { return { error: e.message } }
}

// palette-map.mjs -> classic script (window.WithPalette) / CommonJS, by stripping `export` (the logic is never forked)
function mapSources() {
  const src = fs.readFileSync(MAP_SRC, 'utf8').replace(/\r\n/g, '\n')
  const names = [...src.matchAll(/^export\s+(?:const|function|let)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1])
  const body = src.replace(/^export\s+(?=(?:const|function|let)\b)/gm, '')
  const head = '// GENERATED by forge/lib/emit-palettes.mjs from forge/lib/palette-map.mjs. Do not edit: change the .mjs and re-run.\n'
  const browser = head + '(function () {\n' + body.trim() + '\nwindow.WithPalette = { ' + names.join(', ') + ' }\n})()\n'
  const cjs = head + "'use strict'\n" + body.trim() + '\n' + names.map(n => `exports.${n} = ${n}`).join('\n') + '\n'
  return { esm: head + src, browser, cjs, names }
}

const MAP_DTS = `// Palette roles -> each style's CSS variables (see the @withicons/core README, "Colour palettes").
export type PaletteRole = 'ink' | 'c1' | 'c2' | 'c3' | 'c4' | 'tint' | 'accent' | 'shadow' | 'shine' | 'edge'
export type PaletteColors = Partial<Record<PaletteRole, string>>
export interface Palette { id: string; name: string; tags: string[]; colors: PaletteColors }
export interface IconPalettes { name: string; auto: boolean; palettes: Palette[] }
export declare const ROLES: PaletteRole[]
export declare const ROLE_LABELS: Record<PaletteRole, string>
/** Ordered unique --with-* variables used in a piece of SVG markup. */
export declare function varsIn(markup: string): string[]
/** { '--with-x': role } for the variables this markup uses. */
export declare function rolesFor(markup: string): Record<string, PaletteRole>
/** CSS variables (and the ink colour) that apply a palette to this markup. */
export declare function applyPalette(markup: string, palette: PaletteColors): { vars: Record<string, string>; color: string | null }
/** Standalone markup with the palette baked in (var(--with-x, d) -> hex, currentColor -> ink). For files and rasterizers. */
export declare function bakePalette(markup: string, palette: PaletteColors): string
`

function writeIfChanged(rel, text, stats) {
  const f = path.join(ROOT, rel)
  let old = null
  try { old = fs.readFileSync(f, 'utf8') } catch { }
  if (old === text) return
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, text)
  stats.written++
}
function pruneDir(rel, keep, stats) {
  const d = path.join(ROOT, rel)
  if (!fs.existsSync(d)) return
  for (const f of fs.readdirSync(d)) if (!keep.has(f)) { fs.unlinkSync(path.join(d, f)); stats.removed++ }
}

export default async function emit(ctx) {
  const names = ctx && ctx.icons ? ctx.icons.map(i => i.name) : fs.readdirSync(path.join(ROOT, 'forge', 'icons')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort()
  const stats = { written: 0, removed: 0 }
  const index = {}, keepSite = new Set(), keepCore = new Set(['index.json', 'palette-map.mjs', 'palette-map.cjs', 'palette-map.d.ts'])
  let hand = 0, auto = 0, total = 0
  const warn = []
  for (const name of names) {
    const json = readSource(name)
    let list = []
    if (json && json.error) warn.push(`${name}: ${json.error}`)
    else if (json) { const r = normalise(name, json); list = r.list; if (r.problems.length) warn.push(`${name}: ${r.problems.slice(0, 2).join('; ')}`) }
    const isAuto = list.length < 8   // a missing, broken or half-written file falls back to the automatic set
    if (isAuto) list = FALLBACK; else hand++
    if (isAuto) auto++
    total += list.length
    const tags = [...new Set(list.flatMap(p => p.tags))].sort((a, b) => TAGS.indexOf(a) - TAGS.indexOf(b))
    index[name] = { count: list.length, auto: isAuto, tags }
    writeIfChanged(`${SITE_DIR}/${name}.js`, `(window.WITH_PALETTES=window.WITH_PALETTES||{})[${JSON.stringify(name)}]=${JSON.stringify(list)}\n`, stats)
    writeIfChanged(`${CORE_DIR}/${name}.json`, JSON.stringify({ name, auto: isAuto, palettes: list }, null, 1) + '\n', stats)
    keepSite.add(name + '.js'); keepCore.add(name + '.json')
  }
  const map = mapSources()
  const { ROLE_LABELS } = await import(pathToFileURL(MAP_SRC).href)
  writeIfChanged(`${CORE_DIR}/index.json`, JSON.stringify({ roles: ROLES, roleLabels: ROLE_LABELS, tags: TAGS, icons: index }, null, 1) + '\n', stats)
  // .mjs, not .js: the icon named `package` writes palettes/package.json, which Node would read as this folder's
  // package settings (no "type") and then refuse ESM syntax in a .js file next to it
  writeIfChanged(`${CORE_DIR}/palette-map.mjs`, map.esm, stats)
  writeIfChanged(`${CORE_DIR}/palette-map.cjs`, map.cjs, stats)
  writeIfChanged(`${CORE_DIR}/palette-map.d.ts`, MAP_DTS, stats)
  writeIfChanged('site/js/palette-map.js', map.browser, stats)
  pruneDir(SITE_DIR, keepSite, stats)
  pruneDir(CORE_DIR, keepCore, stats)
  if (warn.length) console.log(`  palettes: ${warn.length} file(s) skipped or trimmed, e.g. ${warn.slice(0, 3).join(' | ')}`)
  return `${names.length} icons (${hand} hand-picked, ${auto} automatic), ${total} palettes; ${stats.written} files written, ${stats.removed} removed`
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  emit(null).then(r => console.log('emit-palettes: ' + r), e => { console.error(e); process.exit(1) })
}
