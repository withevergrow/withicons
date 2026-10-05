// @withicons/mcp — icon library logic shared by the MCP server (stdio + Lambda), the JSON API and the `withicons` CLI.
// No MCP SDK in here. Data comes from '#data' (files on disk for npm, inlined JSON for the Lambda bundle).
import { create, titleOf } from '../../search/src/engine.mjs'
import { loadData } from '#data'
import { rolesFor, ROLES, ROLE_LABELS } from '../../../forge/lib/palette-map.mjs'

export const FORMATS = ['svg', 'react', 'vue', 'svelte', 'angular', 'solid', 'html-class', 'web-component', 'data-uri']
export const FRAMEWORKS = ['react', 'vue', 'svelte', 'angular', 'solid', 'web-component', 'html-class', 'svg']
export const SITE = 'https://withicons.com'
const CDN = 'https://cdn.jsdelivr.net/npm/@withicons'

let state = null
export function data() {
  if (state) return state
  const d = loadData()
  const byName = new Map(d.meta.icons.map(i => [i.name, i]))
  state = { ...d, byName, engine: create(d.index), styleNames: d.meta.styles.map(s => s.name) }
  return state
}

export class IconError extends Error {
  constructor(message, extra) { super(message); this.name = 'IconError'; Object.assign(this, extra) }
}

const pascal = n => n.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
const cap = s => s[0].toUpperCase() + s.slice(1)

export function checkStyle(style) {
  const { styleNames } = data()
  const s = (style || 'line').toLowerCase()
  if (!styleNames.includes(s)) throw new IconError(`Unknown style "${style}". Styles: ${styleNames.join(', ')}`, { code: 'unknown_style', styles: styleNames })
  return s
}
export function checkFormat(format) {
  const f = (format || 'svg').toLowerCase().replace(/^(html|class|classes|css)$/, 'html-class').replace(/^(wc|webcomponent|web)$/, 'web-component').replace(/^(datauri|data-url|uri)$/, 'data-uri').replace(/^(jsx|tsx|next|nextjs|preact)$/, 'react').replace(/^(solidjs|solid-js)$/, 'solid')
  if (!FORMATS.includes(f)) throw new IconError(`Unknown format "${format}". Formats: ${FORMATS.join(', ')}`, { code: 'unknown_format', formats: FORMATS })
  return f
}

// name or alias -> canonical name; throws IconError with candidates otherwise
export function resolveName(name) {
  const r = data().engine.resolve(String(name || ''))
  if (r.name) return r.name
  if (r.ambiguous) throw new IconError(`"${name}" is ambiguous: ${r.ambiguous.join(', ')}`, { code: 'ambiguous', candidates: r.ambiguous })
  throw new IconError(`No icon named "${name}".${r.nearest && r.nearest.length ? ` Did you mean: ${r.nearest.join(', ')}?` : ''}`, { code: 'unknown_icon', nearest: r.nearest || [] })
}

// CSS variables -> their defaults (palette colours, --with-duo, --with-accent): for files, <img>, data URIs and rasterizers
export function flatten(s) {
  let p
  do { p = s; s = s.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1').replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor') } while (s !== p)
  return s
}
export const isPaletteStyle = style => !!(data().meta.styles.find(s => s.name === style) || {}).palette

export function svgOf(name, style, { size, color, strokeWidth, flat } = {}) {
  const d = data()
  let svg = d.svg(style)[name]
  if (!svg) throw new IconError(`"${name}" is not available in style "${style}"`, { code: 'missing_style' })
  if (flat) svg = flatten(svg)
  if (size && +size !== 24) svg = svg.replace(/^<svg([^>]*?) width="24" height="24"/, `<svg$1 width="${+size}" height="${+size}"`)
  if (color) svg = svg.replace(/currentColor/g, String(color).replace(/[^#\w(),.%\s-]/g, ''))
  if (strokeWidth) svg = svg.replace(/stroke-width="[\d.]+"/, `stroke-width="${+strokeWidth}"`)
  return svg
}

// Ready-to-paste code for one icon in one format.
export function snippet(name, style = 'line', format = 'svg', opts = {}) {
  style = checkStyle(style); format = checkFormat(format)
  const size = opts.size ? +opts.size : 24
  const P = pascal(name)
  const sub = style === 'line' ? '' : '/' + style
  const local = style === 'line' ? P : P + cap(style)
  const imp = pkg => style === 'line' ? `import { ${P} } from '@withicons/${pkg}'` : `import { ${P} as ${local} } from '@withicons/${pkg}${sub}'`
  const sizeAttr = size !== 24
  switch (format) {
    case 'svg': return svgOf(name, style, opts)
    case 'data-uri': {
      const svg = svgOf(name, style, { ...opts, color: opts.color || '#000', flat: true })
      return 'data:image/svg+xml,' + svg.replace(/"/g, "'").replace(/[\r\n%#{}<>]/g, c => encodeURIComponent(c))
    }
    case 'react':
    case 'solid':
      return `${imp(format)}\n\n<${local}${sizeAttr ? ` size={${size}}` : ''} />`
    case 'vue':
      return `<script setup>\n${imp('vue')}\n</script>\n\n<template>\n  <${local}${sizeAttr ? ` :size="${size}"` : ''} />\n</template>`
    case 'svelte':
      return `<script>\n  ${imp('svelte')}\n</script>\n\n<${local}${sizeAttr ? ` size={${size}}` : ''} />`
    case 'angular':
      return (style === 'line' ? `import { WithIconComponent, ${P} } from '@withicons/angular'` : `import { WithIconComponent } from '@withicons/angular'\nimport { ${P} as ${local} } from '@withicons/angular${sub}'`) +
        `\n\n// @Component({ imports: [WithIconComponent], ... })  then in the class: ${local} = ${local}\n<with-icon [icon]="${local}"${sizeAttr ? ` [size]="${size}"` : ''} />`
    case 'html-class':
      return `<script src="${CDN}/classes/dist/with-loader.js" defer></script>\n\n<i class="with with-${name}${style === 'line' ? '' : ' with-' + style}"${sizeAttr ? ` style="font-size:${size}px"` : ''}></i>`
    case 'web-component':
      return `<script type="module" src="${CDN}/web/dist/cdn.js"></script>\n\n<with-icon name="${name}"${style === 'line' ? '' : ` variant="${style}"`}${sizeAttr ? ` size="${size}"` : ''}></with-icon>`
  }
}

// one-line import for `withicons add` / snippets for several icons at once
export function importLine(names, framework = 'react', style = 'line') {
  style = checkStyle(style)
  const f = checkFormat(framework)
  const sub = style === 'line' ? '' : '/' + style
  const spec = names.map(n => style === 'line' ? pascal(n) : `${pascal(n)} as ${pascal(n)}${cap(style)}`).join(', ')
  switch (f) {
    case 'react': case 'vue': case 'svelte': case 'solid': return `import { ${spec} } from '@withicons/${f}${sub}'`
    case 'angular': return `import { WithIconComponent } from '@withicons/angular'\nimport { ${spec} } from '@withicons/angular${sub}'`
    case 'web-component': return `<script type="module" src="${CDN}/web/dist/cdn.js"></script>`
    case 'html-class': return `<script src="${CDN}/classes/dist/with-loader.js" defer></script>`
    default: return null
  }
}
export function usageLine(name, framework = 'react', style = 'line') {
  const f = checkFormat(framework)
  const local = style === 'line' ? pascal(name) : pascal(name) + cap(style)
  switch (f) {
    case 'react': case 'solid': case 'svelte': case 'vue': return `<${local} />`
    case 'angular': return `<with-icon [icon]="${local}" />`
    case 'web-component': return `<with-icon name="${name}"${style === 'line' ? '' : ` variant="${style}"`}></with-icon>`
    case 'html-class': return `<i class="with with-${name}${style === 'line' ? '' : ' with-' + style}"></i>`
    default: return null
  }
}

const REASON = { name: 'name', alias: 'alias', synonym: 'related word', tag: 'tag', category: 'category', description: 'description' }
export function searchIcons({ query, limit = 10, style, category, format = 'react' } = {}) {
  const d = data()
  const st = style ? checkStyle(style) : null
  const lim = Math.max(1, Math.min(100, +limit || 10))
  if (category && !d.meta.categories.some(c => c.name === category)) throw new IconError(`Unknown category "${category}". Categories: ${d.meta.categories.map(c => c.name).join(', ')}`, { code: 'unknown_category' })
  const parsed = d.engine.parse(String(query || ''))
  const useStyle = st || parsed.style || 'line'
  const results = d.engine.search(String(query || ''), { limit: lim, category, style: st || undefined })
  return {
    query, style: useStyle, count: results.length,
    results: results.map(r => ({
      name: r.name, title: r.title, category: r.category, score: r.score,
      reason: `matched ${REASON[r.match.field]} "${r.match.term}"${r.match.typo ? ' (typo-tolerant)' : ''}`,
      match: r.match,
      snippet: snippet(r.name, useStyle, format),
      url: `${SITE}/icons/${r.name}.html`,
    })),
    suggestions: results.length ? [] : d.engine.suggest(String(query || ''), 5),
  }
}

export function getIcon({ name, style = 'line', format = 'svg', size, color, strokeWidth, flat, palette, colors } = {}) {
  const canonical = resolveName(name)
  style = checkStyle(style); format = checkFormat(format)
  const m = data().byName.get(canonical)
  const mo = motionFor(canonical)
  const pal = isPaletteStyle(style)
  const vars = colorVars(canonical, style)
  const custom = colors && typeof colors === 'object' && Object.keys(colors).length
  // with a palette, `color` is the ink (unless colors.ink says otherwise)
  const applied = palette || custom ? applyColors(canonical, style, { palette, colors: color ? { ink: color, ...(colors || {}) } : colors }) : null
  const notes = []
  let code
  if (applied) {
    code = paletteSnippet(canonical, style, format, { size, strokeWidth, flat }, applied)
    if (format === 'html-class' && vars.length) notes.push('CSS-class icons bake their colours into a data URI, so only the ink (color) applies there; use svg, web-component or a framework format for the full palette.')
    if (!vars.length) notes.push(`The ${style} style draws "${canonical}" in one colour (the ink), so only the palette's ink applies. Multi-colour styles for this icon: ${multiColourStyles(canonical).join(', ')}.`)
  } else code = snippet(canonical, style, format, { size, color, strokeWidth, flat })
  const list = iconPalettes(canonical).list
  return {
    name: canonical, ...(canonical !== String(name) ? { requested: String(name) } : {}),
    title: titleOf(canonical), category: m.category, style, format, size: size ? +size : 24,
    code,
    ...(applied ? { appliedPalette: applied } : {}),
    url: `${SITE}/icons/${canonical}.html`,
    ...(pal ? { palette: (data().meta.styles.find(s => s.name === style) || {}).vars || {} } : {}),
    ...(vars.length ? {
      colors: {
        note: 'Every colour is a CSS variable with a default (override any of them on the icon or a parent); the ink follows currentColor. Recolour with palette: "<id>" (one of suggestions) and/or colors: { c1: "#hex", ink: "#hex", ... }; flat: true bakes the colours into the file (for <img>, Figma, slides). list_palettes shows every palette\'s colours.',
        variables: vars,
        palettes: list.length,
        suggestions: list.map(p => ({ id: p.id, name: p.name, tags: p.tags })),
      },
    } : {}),
    ...(notes.length ? { notes } : {}),
    motion: mo ? {
      intent: mo.intent, loop: mo.loop && mo.loop.preset, hover: mo.hover && mo.hover.preset,
      alt: (mo.alt || []).map(a => a.preset), swap: (mo.swap || []).map(s => s.to + (s.effect ? ` (${s.effect})` : '')),
      howTo: 'animate_icon(name, trigger: loop|hover|once|inview|swap, format) returns paste-ready code (@withicons/motion).',
    } : null,
  }
}

export function resolveIcon(name) {
  const r = data().engine.resolve(String(name || ''))
  if (r.name) {
    const m = data().byName.get(r.name)
    return { status: 'resolved', name: r.name, ...(r.alias ? { via: 'alias', alias: r.alias } : { via: 'name' }), title: titleOf(r.name), category: m.category, aliases: m.aliases }
  }
  if (r.ambiguous) return { status: 'ambiguous', candidates: r.ambiguous }
  return { status: 'unknown', nearest: r.nearest }
}

export function listStyles() {
  return data().meta.styles.map(s => ({
    name: s.name, title: s.title, kind: s.kind, description: s.description, default: s.name === 'line',
    ...(s.palette ? { palette: true, vars: s.vars || {} } : {}),
  }))
}

export function listCategories(category) {
  const d = data()
  if (category) {
    const c = d.meta.categories.find(x => x.name === String(category).toLowerCase())
    if (!c) throw new IconError(`Unknown category "${category}". Categories: ${d.meta.categories.map(c => c.name).join(', ')}`, { code: 'unknown_category' })
    return { category: c.name, count: c.count, icons: d.meta.icons.filter(i => i.category === c.name).map(i => ({ name: i.name, title: titleOf(i.name), description: i.description })) }
  }
  return { total: d.meta.icons.length, categories: d.meta.categories.map(c => ({ name: c.name, count: c.count, examples: d.meta.icons.filter(i => i.category === c.name).slice(0, 6).map(i => i.name) })) }
}

export function info() {
  const d = data()
  const m = motionData()
  const pal = Object.values(paletteStore().icons)
  return { version: d.meta.version, icons: d.meta.icons.length, styles: d.styleNames, formats: FORMATS, site: SITE, animated: Object.keys(m.icons).length, palettes: pal.reduce((n, x) => n + x.p.length, 0) }
}

// ---------------------------------------------------------------- colour palettes (@withicons/core/palettes)
// Data: dist/data/palettes.json, written by forge/lib/emit-mcp.mjs from @withicons/core's dist/palettes/** (20-30 palettes
// picked per icon, forge/PALETTES.md). A palette gives colours to roles (ink, c1..c4, tint, accent, shadow, shine, edge);
// forge/lib/palette-map.mjs maps the roles to the --with-* variables one icon uses in one style.
export const PALETTE_ROLES = ROLES
function paletteStore() {
  const d = data()
  const st = typeof d.palettes === 'function' ? d.palettes() : null
  return st && st.icons ? st : { roles: [], roleLabels: {}, tags: [], icons: {} }
}
const paletteCache = new Map()
function iconPalettes(name) {
  if (paletteCache.has(name)) return paletteCache.get(name)
  const st = paletteStore(), e = st.icons[name]
  const r = e ? {
    auto: !!e.auto,
    list: e.p.map(([id, nm, tags, cols]) => ({ id, name: nm, tags, colors: Object.fromEntries(st.roles.map((role, i) => [role, cols[i]]).filter(([, v]) => v)) })),
  } : { auto: true, list: [] }
  paletteCache.set(name, r)
  return r
}
const DEF_RE = /var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g
// the --with-* colour variables one icon uses in one style: [{ var, role, label, default }] (empty = one colour, the ink)
export function colorVars(name, style) {
  const svg = svgOf(name, style)
  const roles = rolesFor(svg), defaults = {}
  for (const m of svg.matchAll(DEF_RE)) if (!(m[1] in defaults)) defaults[m[1]] = m[2]
  return Object.keys(defaults).map(v => ({ var: v, role: roles[v] || null, label: roles[v] ? ROLE_LABELS[roles[v]] : null, default: defaults[v] }))
}
// styles in which this icon has more than one colour
export function multiColourStyles(name) {
  return data().styleNames.filter(st => { try { return /var\(\s*--with-/.test(svgOf(name, st)) } catch { return false } })
}
const HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
function cleanColor(v, what) {
  const s = String(v == null ? '' : v).trim()
  if (HEX.test(s)) return s[0] === '#' ? s : '#' + s
  if (/^[a-z]{3,24}$/i.test(s)) return s.toLowerCase()   // CSS named colour (red, rebeccapurple, transparent)
  throw new IconError(`Invalid colour for ${what}: "${v}". Use hex (#e11d48) or a CSS colour name.`, { code: 'invalid_color' })
}
// palette id (or name) and/or role colours -> what to apply to one icon in one style
export function applyColors(name, style, { palette, colors } = {}) {
  let base = null
  if (palette) {
    const { list } = iconPalettes(name)
    const want = String(palette).trim().toLowerCase()
    base = list.find(p => p.id === want) || list.find(p => p.name.toLowerCase() === want)
    if (!base) throw new IconError(`"${name}" has no palette "${palette}".${list.length ? ` Palettes: ${list.map(p => p.id).join(', ')}` : ''}`, { code: 'unknown_palette', palettes: list.map(p => p.id) })
  }
  const roleColors = {}, direct = {}
  for (const [k, v] of Object.entries(colors && typeof colors === 'object' ? colors : {})) {
    if (v == null || v === '') continue
    const key = String(k).trim()
    if (ROLES.includes(key.toLowerCase())) roleColors[key.toLowerCase()] = cleanColor(v, key)
    else if (/^--with-[\w-]+$/.test(key)) direct[key] = cleanColor(v, key)
    else throw new IconError(`Unknown colour role "${k}". Roles: ${ROLES.join(', ')} (or a --with-* variable name).`, { code: 'unknown_role', roles: ROLES })
  }
  const merged = { ...(base ? base.colors : {}), ...roleColors }
  const vars = {}
  for (const [v, role] of Object.entries(rolesFor(svgOf(name, style)))) if (merged[role]) vars[v] = merged[role]
  Object.assign(vars, direct)
  const color = merged.ink || null
  const decl = [...(color ? [`color: ${color}`] : []), ...Object.entries(vars).map(([k, v]) => `${k}: ${v}`)].join('; ')
  const tweaked = Object.keys(roleColors).length || Object.keys(direct).length
  const id = base ? base.id + (tweaked ? '-custom' : '') : 'custom'
  const className = `icon-${name}-${id}`
  return { ...(base ? { id: base.id, name: base.name, tags: base.tags } : { id: 'custom' }), colors: merged, vars, color, inlineStyle: decl, className, css: `.${className} { ${decl}; }` }
}
// bake applied colours into SVG markup: var(--with-x, d) -> chosen colour, currentColor -> ink, other variables -> defaults
function bakeColors(svg, applied) {
  let s = svg.replace(DEF_RE, (all, v, d) => applied.vars[v] || d)
  if (applied.color) s = s.replace(/currentColor/g, applied.color)
  return flatten(s)
}
// keep the variables but set them on the root <svg> (inline SVG stays themeable)
const styleOnRoot = (svg, decl) => /^<svg[^>]*\sstyle="/.test(svg) ? svg.replace(/^(<svg[^>]*\sstyle=")/, `$1${decl}; `) : svg.replace(/^<svg/, `<svg style="${decl}"`)
function paletteSnippet(name, style, format, opts, applied) {
  const decl = applied.inlineStyle, cls = applied.className
  const sized = svg => opts.size && +opts.size !== 24 ? svg.replace(/^<svg([^>]*?) width="24" height="24"/, `<svg$1 width="${+opts.size}" height="${+opts.size}"`) : svg
  const base = svgOf(name, style, { strokeWidth: opts.strokeWidth })
  const plain = snippet(name, style, format, opts)
  if (!decl) return plain
  switch (format) {
    case 'svg': return sized(opts.flat ? bakeColors(base, applied) : styleOnRoot(base, decl))
    case 'data-uri': return 'data:image/svg+xml,' + sized(bakeColors(base, { ...applied, color: applied.color || '#000' })).replace(/"/g, "'").replace(/[\r\n%#{}<>]/g, c => encodeURIComponent(c))
    case 'web-component': return plain.replace('<with-icon ', `<with-icon style="${decl}" `)
    case 'html-class': return applied.color ? plain.replace(/<i class="([^"]*)"(?: style="([^"]*)")?/, (a, c, st) => `<i class="${c}" style="${[st, `color: ${applied.color}`].filter(Boolean).join('; ')}"`) : plain
    case 'react': case 'solid': {
      const attr = format === 'react' ? 'className' : 'class'
      return plain.replace(/<(\w+)( [^>]*)? \/>$/, `<$1 ${attr}="${cls}"$2 />`) + `\n\n/* in your CSS */\n${applied.css}`
    }
    case 'vue': return plain.replace(/<(\w+)( [^>]*)? \/>\n<\/template>$/, `<$1 class="${cls}"$2 />\n</template>`) + `\n\n<style>\n${applied.css}\n</style>`
    case 'svelte': return plain.replace(/<(\w+)( [^>]*)? \/>$/, `<$1 class="${cls}"$2 />`) + `\n\n<style>\n  :global(${applied.css.replace(/ \{/, ') {')}\n</style>`
    case 'angular': return plain.replace('<with-icon ', `<with-icon class="${cls}" `) + `\n\n/* in the component styles (or styles.css) */\n${applied.css}`
  }
  return plain
}

// Palettes picked for one icon. With a style: each palette also says which CSS variables it sets on that icon in that style.
export function listPalettes({ name, style, tag, limit } = {}) {
  const canonical = resolveName(name)
  const st = style ? checkStyle(style) : null
  const store = paletteStore()
  if (tag && store.tags.length && !store.tags.includes(String(tag))) throw new IconError(`Unknown tag "${tag}". Tags: ${store.tags.join(', ')}`, { code: 'unknown_tag', tags: store.tags })
  const { auto, list } = iconPalettes(canonical)
  let pals = tag ? list.filter(p => p.tags.includes(String(tag))) : list
  if (limit) pals = pals.slice(0, Math.max(1, +limit || 1))
  return {
    name: canonical, ...(canonical !== String(name) ? { requested: String(name) } : {}),
    auto, count: pals.length, total: list.length,
    roles: Object.fromEntries(ROLES.map(r => [r, ROLE_LABELS[r]])),
    multiColourStyles: multiColourStyles(canonical),
    ...(st ? { style: st, variables: colorVars(canonical, st) } : {}),
    palettes: pals.map(p => {
      if (!st) return p
      const a = applyColors(canonical, st, { palette: p.id })
      return { ...p, vars: a.vars, css: a.css }
    }),
    howTo: 'get_icon(name, style, format, palette: "<id>") returns the code with that palette applied; colors: { c1: "#hex", ink: "#hex", ... } overrides any role (or any --with-* variable).',
    ...(auto && list.length ? { note: 'No hand-picked palettes for this icon yet: these are the general set.' } : {}),
  }
}

// ---------------------------------------------------------------- motion (@withicons/motion)
// Data: dist/data/motion.json, written by forge/lib/emit-mcp.mjs from @withicons/motion (or forge/motion/*.json).
// Animations wrap any icon: <span class="wm wm-loop" data-wm="bell">…icon…</span>. Spec: forge/MOTION.md.
export const TRIGGERS = ['loop', 'hover', 'once', 'inview', 'swap']
export const MOTION_FORMATS = ['html', 'react', 'vue', 'svelte', 'solid', 'angular', 'web-component', 'js']
const FALLBACK_PRESETS = ['spin', 'spin-once', 'tick', 'pulse', 'beat', 'breathe', 'float', 'bounce', 'sway', 'ring', 'wiggle', 'shake', 'nod', 'nudge', 'pass', 'rise', 'drop', 'blink', 'flicker', 'twinkle', 'pop', 'tada', 'jelly', 'flip', 'rock', 'tilt', 'zoom', 'orbit', 'glow', 'draw', 'type', 'fill']
const FALLBACK_EFFECTS = ['fade', 'scale', 'rotate', 'flip', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'blur', 'spin', 'morph', 'draw']
let motionState = null
export function motionData() {
  if (motionState) return motionState
  const raw = data().motion || {}
  motionState = {
    icons: raw.icons || {},
    presets: raw.presets && raw.presets.length ? raw.presets : FALLBACK_PRESETS,
    effects: raw.effects && raw.effects.length ? raw.effects : FALLBACK_EFFECTS,
    css: raw.css || ['@withicons/motion/motion.css', '@withicons/motion/icons.css'],
    // from a CDN: the presets plus each animated icon's own defaults (icons/<name>.css), never the all-icons icons.css
    cdn: (raw.cdn || [`${CDN}/motion/dist/motion.css`]).filter(u => !/\/icons\.css$/.test(u)),
    cdnIcon: raw.cdnIcon || `${CDN}/motion/dist/icons/<name>.css`,
    source: raw.source || 'none',
  }
  return motionState
}
export const motionFor = name => motionData().icons[name] || null

// "pause" | "heart@solid" -> { name, style }
function swapTarget(to, style) {
  const [n, s] = String(to).split('@')
  return { name: resolveName(n), style: s ? checkStyle(s) : style }
}
const fmtMotion = f => {
  const x = String(f || 'html').toLowerCase().replace(/^(jsx|tsx|next|nextjs|preact)$/, 'react').replace(/^(wc|webcomponent|web)$/, 'web-component').replace(/^(javascript|vanilla)$/, 'js').replace(/^(solidjs|solid-js)$/, 'solid').replace(/^(svg|html-class|class)$/, 'html')
  if (!MOTION_FORMATS.includes(x)) throw new IconError(`Unknown format "${f}". Formats: ${MOTION_FORMATS.join(', ')}`, { code: 'unknown_format', formats: MOTION_FORMATS })
  return x
}

// Paste-ready animation code for one icon. trigger: loop (continuous), hover (one-shot on hover/focus of the icon or a
// .wm-trigger ancestor), once (plays on load), inview (JS, plays when scrolled into view), swap (turns into another icon).
export function animateIcon({ name, style = 'line', trigger = 'loop', preset, to, effect, format = 'html', duration } = {}) {
  const canonical = resolveName(name)
  style = checkStyle(style)
  format = fmtMotion(format)
  const m = motionData()
  trigger = String(trigger || 'loop').toLowerCase()
  if (!TRIGGERS.includes(trigger)) throw new IconError(`Unknown trigger "${trigger}". Triggers: ${TRIGGERS.join(', ')}`, { code: 'unknown_trigger', triggers: TRIGGERS })
  if (preset && !m.presets.includes(preset)) throw new IconError(`Unknown preset "${preset}". Presets: ${m.presets.join(', ')}`, { code: 'unknown_preset', presets: m.presets })
  if (effect && !m.effects.includes(effect)) throw new IconError(`Unknown effect "${effect}". Effects: ${m.effects.join(', ')}`, { code: 'unknown_effect', effects: m.effects })
  const spec = motionFor(canonical)
  const dur = duration && +duration > 0 ? Math.min(10, +duration) : null
  const notes = []
  const P = pascal(canonical)
  const comp = (n, st) => (st === 'line' ? pascal(n) : pascal(n) + cap(st))
  const imp = (fw, list) => {
    const by = {}
    for (const [n, st] of list) (by[st] ||= new Set()).add(st === 'line' ? pascal(n) : `${pascal(n)} as ${comp(n, st)}`)
    return Object.entries(by).map(([st, set]) => `import { ${[...set].join(', ')} } from '@withicons/${fw}${st === 'line' ? '' : '/' + st}'`).join('\n')
  }
  const cssImports = m.css.map(c => `import '${c}'`).join('\n')
  // CDN links: motion.css + icons/<name>.css for the icon whose tuned defaults (data-wm) the code uses
  const links = [...m.cdn, ...(spec && trigger !== 'swap' ? [m.cdnIcon.replace('<name>', canonical)] : [])].map(c => `<link rel="stylesheet" href="${c}">`).join('\n')
  const attrCls = format === 'react' ? 'className' : 'class'

  // ---- swap: icon A turns into icon B
  if (trigger === 'swap') {
    const pick = to ? { to: String(to), effect: effect || 'fade' } : (spec && spec.swap && spec.swap[0]) || null
    if (!pick) throw new IconError(`"${canonical}" has no suggested swap target; pass to (an icon name or "name@style", e.g. "${canonical}@solid").`, { code: 'missing_swap_target' })
    const B = swapTarget(pick.to, style)
    const fx = effect || pick.effect || 'fade'
    const wrap = `wm-swap wm-fx-${fx}`
    let code
    if (format === 'html' || format === 'js') {
      const a = svgOf(canonical, style).replace(/^<svg/, '<svg class="wm-a"')
      const b = svgOf(B.name, B.style).replace(/^<svg/, '<svg class="wm-b"')
      code = format === 'js'
        ? `import { swap } from '@withicons/motion'\n${cssImports}\n\n// returns { toggle(on?), destroy() }\nconst s = swap(document.querySelector('#my-icon'), { from: ${JSON.stringify(svgOf(canonical, style))}, to: ${JSON.stringify(svgOf(B.name, B.style))}, effect: '${fx}', trigger: 'click' })`
        : `${links}\n\n<!-- shows ${B.name} on hover/focus of the button; add class "is-on" to the .wm-swap span (a toggle) to keep it -->\n<button type="button" class="wm-trigger" aria-label="${titleOf(canonical)}">\n  <span class="${wrap}">${a}${b}</span>\n</button>`
    } else if (format === 'web-component') {
      code = `<script type="module" src="${CDN}/web/dist/cdn.js"></script>\n${links}\n\n<button type="button" class="wm-trigger" aria-label="${titleOf(canonical)}">\n  <span class="${wrap}">\n    <with-icon class="wm-a" name="${canonical}"${style === 'line' ? '' : ` variant="${style}"`}></with-icon>\n    <with-icon class="wm-b" name="${B.name}"${B.style === 'line' ? '' : ` variant="${B.style}"`}></with-icon>\n  </span>\n</button>`
    } else if (format === 'angular') {
      code = `${imp('angular', [[canonical, style], [B.name, B.style]])}\n// angular.json "styles": [${m.css.map(c => `"${c}"`).join(', ')}]\n\n<button type="button" class="wm-trigger" [class.is-on]="on" (click)="on = !on" aria-label="${titleOf(canonical)}">\n  <span class="${wrap}" [class.is-on]="on">\n    <with-icon class="wm-a" [icon]="${comp(canonical, style)}" />\n    <with-icon class="wm-b" [icon]="${comp(B.name, B.style)}" />\n  </span>\n</button>`
    } else {
      const A = comp(canonical, style), Bc = comp(B.name, B.style)
      const on = format === 'vue' ? `:class="['${wrap}', { 'is-on': on }]"` : format === 'svelte' ? `class="${wrap}" class:is-on={on}` : `${attrCls}={'${wrap}' + (on ? ' is-on' : '')}`
      const click = format === 'vue' ? '@click="on = !on"' : format === 'svelte' ? 'on:click={() => (on = !on)}' : 'onClick={() => setOn(!on)}'
      let body = `<button type="button" ${click} ${format === 'vue' ? ':aria-pressed="on"' : 'aria-pressed={on}'} aria-label="${titleOf(canonical)}">\n  <span ${on}><${A} ${attrCls}="wm-a" /><${Bc} ${attrCls}="wm-b" /></span>\n</button>`
      if (format === 'solid') body = body.replace(/\{on\}/g, '{on()}').replace('(on ?', '(on() ?').replace('setOn(!on)', 'setOn(!on())')
      code = format === 'vue'
        ? `<script setup>\nimport { ref } from 'vue'\n${imp('vue', [[canonical, style], [B.name, B.style]])}\n${cssImports}\nconst on = ref(false)\n</script>\n\n<template>\n  ${body.replace(/\n/g, '\n  ')}\n</template>`
        : format === 'svelte'
          ? `<script>\n  ${imp('svelte', [[canonical, style], [B.name, B.style]]).replace(/\n/g, '\n  ')}\n  ${cssImports.replace(/\n/g, '\n  ')}\n  let on = false\n</script>\n\n${body}`
          : `${imp(format, [[canonical, style], [B.name, B.style]])}\n${cssImports}\n${format === 'solid' ? "import { createSignal } from 'solid-js'\nconst [on, setOn] = createSignal(false)" : "import { useState } from 'react'\nconst [on, setOn] = useState(false)"}\n\n${body}`
    }
    return { name: canonical, style, trigger, format, to: B.name + (B.style !== style ? '@' + B.style : ''), effect: fx, intent: spec ? spec.intent : null, code, motion: spec, effects: m.effects, notes, install: installOf(m) }
  }

  // ---- loop / hover / once / inview on one icon
  const chosen = preset || (spec && spec[trigger === 'loop' ? 'loop' : 'hover'] && spec[trigger === 'loop' ? 'loop' : 'hover'].preset) || (trigger === 'loop' ? 'pulse' : 'pop')
  if (!spec) notes.push(`"${canonical}" has no tuned motion yet; using the generic "${chosen}" preset.`)
  const classes = ['wm', `wm-${trigger}`]
  if (preset || !spec) classes.push(`wm-p-${chosen}`)
  const dataWm = spec ? ` data-wm="${canonical}"` : ''
  const styleVar = dur ? `--wm-dur:${dur}s` : ''
  // inview and the draw preset only run through the JS runtime: motion(el, name, options) from @withicons/motion
  const needsJs = trigger === 'inview' || chosen === 'draw'
  if (trigger === 'inview') notes.push('inview plays when the icon scrolls into view; it needs the JS runtime, so the code calls motion(el, name, { trigger: "inview" }) from @withicons/motion.')
  if (trigger === 'hover') notes.push('Plays on hover/focus of the icon, or of any ancestor with class "wm-trigger" (e.g. the button).')
  if (chosen === 'draw') notes.push('"draw" animates strokes and runs through the JS runtime (motion()): use a stroked style (line, duo, blueprint, sketch, kawaii); other styles fall back to "pop".')
  const span = (inner, c = 'class', extra = '') => `<span${extra} ${c}="${classes.join(' ')}"${dataWm}${styleVar ? (c === 'className' ? ` style={{ '--wm-dur': '${dur}s' }}` : ` style="${styleVar}"`) : ''}>${inner}</span>`
  const button = (inner, c = 'class') => trigger === 'hover' ? `<button type="button" ${c}="wm-trigger" aria-label="${titleOf(canonical)}">${inner}</button>` : inner
  const mArgs = `${spec ? `'${canonical}'` : 'null'}, { trigger: '${trigger}'${preset || !spec ? `, preset: '${chosen}'` : ''}${dur ? `, duration: ${dur}` : ''} }`
  let code
  if (needsJs && format !== 'js') {
    const id = `${canonical}-icon`
    const run = el => `const m = motion(${el}, ${mArgs})`
    const motionImport = "import { motion } from '@withicons/motion'"
    switch (format) {
      case 'html': code = `${links}\n\n${button(span(svgOf(canonical, style), 'class', ` id="${id}"`))}\n\n<script type="module">\n  import { motion } from '${CDN}/motion/dist/runtime.js'\n  motion(document.getElementById('${id}'), ${mArgs})\n</script>`; break
      // on the element itself, so the runtime reaches the SVG inside its shadow root
      case 'web-component': code = `<script type="module" src="${CDN}/web/dist/cdn.js"></script>\n${links}\n\n${button(`<with-icon id="${id}" name="${canonical}"${style === 'line' ? '' : ` variant="${style}"`}></with-icon>`)}\n\n<script type="module">\n  import { motion } from '${CDN}/motion/dist/runtime.js'\n  await customElements.whenDefined('with-icon')\n  motion(document.getElementById('${id}'), ${mArgs})\n</script>`; break
      case 'react': code = `${imp('react', [[canonical, style]])}\n${motionImport}\n${cssImports}\nimport { useEffect, useRef } from 'react'\n\nconst ref = useRef(null)\nuseEffect(() => { ${run('ref.current')}; return () => m.destroy() }, [])\n\n${button(span(`<${comp(canonical, style)} />`, 'className', ' ref={ref}'), 'className')}`; break
      case 'solid': code = `${imp('solid', [[canonical, style]])}\n${motionImport}\n${cssImports}\nimport { onMount, onCleanup } from 'solid-js'\n\nlet el\nonMount(() => { ${run('el')}; onCleanup(() => m.destroy()) })\n\n${button(span(`<${comp(canonical, style)} />`, 'class', ' ref={el}'))}`; break
      case 'vue': code = `<script setup>\n${imp('vue', [[canonical, style]])}\n${motionImport}\n${cssImports}\nimport { ref, onMounted, onBeforeUnmount } from 'vue'\nconst el = ref(null)\nlet m\nonMounted(() => { m = motion(el.value, ${mArgs}) })\nonBeforeUnmount(() => m && m.destroy())\n</script>\n\n<template>\n  ${button(span(`<${comp(canonical, style)} />`, 'class', ' ref="el"'))}\n</template>`; break
      case 'svelte': code = `<script>\n  ${imp('svelte', [[canonical, style]])}\n  ${motionImport}\n  ${cssImports.replace(/\n/g, '\n  ')}\n  import { onMount } from 'svelte'\n  let el\n  onMount(() => { ${run('el')}; return () => m.destroy() })\n</script>\n\n${button(span(`<${comp(canonical, style)} />`, 'class', ' bind:this={el}'))}`; break
      case 'angular': code = `${imp('angular', [[canonical, style]])}\n${motionImport}\nimport { ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'\n// angular.json "styles": [${m.css.map(c => `"${c}"`).join(', ')}]\n\n// in the component class:\n//   @ViewChild('icon') icon!: ElementRef<HTMLElement>\n//   private m?: { destroy(): void }\n//   ngAfterViewInit() { this.m = motion(this.icon.nativeElement, ${mArgs}) }\n//   ngOnDestroy() { this.m?.destroy() }\n\n${button(span(`<with-icon [icon]="${comp(canonical, style)}" />`, 'class', ' #icon'))}`; break
    }
  } else switch (format) {
    case 'html': code = `${links}\n\n${button(span(svgOf(canonical, style)))}`; break
    case 'web-component': code = `<script type="module" src="${CDN}/web/dist/cdn.js"></script>\n${links}\n\n${button(span(`<with-icon name="${canonical}"${style === 'line' ? '' : ` variant="${style}"`}></with-icon>`))}`; break
    case 'react': case 'solid': code = `${imp(format, [[canonical, style]])}\n${cssImports}\n\n${button(span(`<${comp(canonical, style)} />`, format === 'react' ? 'className' : 'class'), format === 'react' ? 'className' : 'class')}`; break
    case 'vue': code = `<script setup>\n${imp('vue', [[canonical, style]])}\n${cssImports}\n</script>\n\n<template>\n  ${button(span(`<${comp(canonical, style)} />`))}\n</template>`; break
    case 'svelte': code = `<script>\n  ${imp('svelte', [[canonical, style]])}\n  ${cssImports.replace(/\n/g, '\n  ')}\n</script>\n\n${button(span(`<${comp(canonical, style)} />`))}`; break
    case 'angular': code = `${imp('angular', [[canonical, style]])}\n// angular.json "styles": [${m.css.map(c => `"${c}"`).join(', ')}]\n\n${button(span(`<with-icon [icon]="${comp(canonical, style)}" />`))}`; break
    case 'js': code = `import { motion } from '@withicons/motion'\n${cssImports}\n\n// returns { play(), pause(), destroy() }\nmotion(document.querySelector('#my-icon'), ${mArgs})`; break
  }
  return { name: canonical, style, trigger, format, preset: chosen, intent: spec ? spec.intent : null, code, motion: spec, presets: m.presets, notes, install: installOf(m) }
}
const installOf = m => ({ npm: 'npm i @withicons/motion', css: m.css, cdn: [...m.cdn, m.cdnIcon] })

export function listMotion() {
  const m = motionData()
  return { animated: Object.keys(m.icons).length, triggers: TRIGGERS, presets: m.presets, effects: m.effects, formats: MOTION_FORMATS, install: installOf(m) }
}
