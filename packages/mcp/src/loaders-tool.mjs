// MCP tool get_loader: animated loaders from @withicons/loaders (forge/LOADERS.md). Answers with a URL and one line of
// code, so an agent never has to read docs or ship markup: <img src> of a self-contained animated SVG, or the tag.
import { z } from 'zod'
import LD from './loaders-data.mjs'

const CDN = 'https://cdn.jsdelivr.net/npm/@withicons/loaders@latest/dist/'
const EFFECTS = ['bloom', 'spin', 'flip', 'slide-up', 'slide-left', 'drop', 'zoom', 'fade']
const FORMATS = ['img', 'html', 'react', 'vue', 'url']
const words = s => String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function findLoaders(query, limit = 5) {
  const q = words(query)
  if (!q.length) return []
  return LD.loaders.map(l => {
    let s = 0
    const nm = words(l.name), al = l.aliases.flatMap(words), tg = [...l.tags, ...l.synonyms].flatMap(words), ds = words(l.description + ' ' + l.intent)
    for (const w of q) { if (nm.includes(w)) s += 10; if (al.includes(w)) s += 6; if (tg.includes(w)) s += 4; if (ds.includes(w)) s += 1; if (l.group === w) s += 3 }
    return [l, s]
  }).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([l]) => l)
}
// a morph item is a library ICON name; "loader:<name>" puts a loader in the chain (0.6.0 semantics, as the runtime)
const LOADER_ITEM = /^loader:\s*(.+)$/i
function morphItems(items) {
  return items.map(raw => {
    const s = String(raw).trim(), m = LOADER_ITEM.exec(s)
    if (!m) return s.replace(/^icon:\s*/i, '')
    const l = byName(m[1])
    if (!l) throw new Error(`no loader "${m[1].trim()}" (morph items are icon names; "loader:<name>" takes a loader name or alias)`)
    return 'loader:' + l.name
  })
}
// JSX string props: a plain "…" literal when nothing needs escaping, else a JS string expression
const jsxStr = (k, v) => /^[^"{}<>&\\\n]*$/.test(String(v)) ? `${k}="${v}"` : `${k}={${JSON.stringify(String(v))}}`
// a JS array literal with single-quoted strings (for a Vue template binding)
const jsList = a => '[' + a.map(n => "'" + String(n).replace(/[\\']/g, c => '\\' + c) + "'").join(', ') + ']'
const byName = n => { const k = String(n || '').toLowerCase().trim(); return LD.loaders.find(l => l.name === k) || LD.loaders.find(l => l.aliases.includes(k)) || null }

export function getLoader(a) {
  if (!LD.loaders.length) throw new Error('loader data missing: build @withicons/loaders (node forge/lib/emit-loaders.mjs)')
  const style = a.style || 'line'
  if (!LD.styles.includes(style)) throw new Error(`unknown style "${style}". Styles: ${LD.styles.join(', ')}`)
  const fmt = a.format || 'img', size = a.size || 32, label = a.label || 'Loading'
  const custom = Array.isArray(a.morph) && a.morph.length
  let l = null, hits = []
  if (!custom) {
    l = a.name ? byName(a.name) : null
    if (!l) { hits = findLoaders(a.query || a.name || 'spinner'); l = hits[0] || byName('spinner') || LD.loaders[0] }
  }
  const attrs = o => Object.entries(o).filter(([, v]) => v != null && v !== '').map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
  const items = custom ? morphItems(a.morph) : null
  const tagAttrs = custom ? { morph: items.join(','), effect: a.effect, variant: style !== 'line' ? style : null } : { name: l.name, variant: style !== 'line' ? style : null }
  Object.assign(tagAttrs, { size: size !== 24 ? size : null, color: a.color, speed: a.speed && a.speed !== 1 ? a.speed : null, label: label !== 'Loading' ? label : null })
  const url = custom ? null : `${CDN}svg/${style}/${l.name}.svg`
  // React: JSX (numbers in braces, strings escaped); Vue: a template (bound numbers, HTML-escaped strings)
  const vue = fmt === 'vue'
  const prop = (k, v) => typeof v === 'number' ? (vue ? `:${k}="${v}"` : `${k}={${v}}`) : vue ? `${k}="${esc(v)}"` : jsxStr(k, v)
  const itemsProp = custom && (vue ? `:items="${esc(jsList(items))}"` : `items={${JSON.stringify(items)}}`)
  const comp = custom ? `<Morph ${itemsProp}${a.effect ? ` effect="${a.effect}"` : ''}` : `<Loader name="${l.name}"`
  const props = [style !== 'line' && prop('variant', style), size !== 24 && prop('size', size), a.color && prop('color', a.color), a.speed && a.speed !== 1 && prop('speed', a.speed), label !== 'Loading' && prop('label', label)].filter(Boolean).join(' ')
  let code
  if (fmt === 'url') code = url || `${CDN}cdn/loaders.js`
  else if (fmt === 'img' && url) code = `<img src="${url}" width="${size}" height="${size}" alt="${esc(label)}">`
  else if (fmt === 'react' || fmt === 'vue') code = `import { ${custom ? 'Morph' : 'Loader'} } from '@withicons/loaders/${fmt}'\n${comp}${props ? ' ' + props : ''} />`
  else code = `<script src="${CDN}cdn/loaders.js"></script>\n<with-loader${attrs(tagAttrs)}></with-loader>`
  return {
    ...(l ? { name: l.name, title: l.title, group: l.group, says: l.intent || l.description, duration: l.duration, ...(l.morph ? { morph: l.morph } : {}) } : { morph: items, effect: a.effect || 'bloom', note: 'Morph items are library icon names; write "loader:<name>" to put a loader in the chain.' }),
    style, url, format: fmt === 'img' && !url ? 'html' : fmt, code,
    ...(a.color && fmt === 'img' ? { note: 'An <img> keeps the default colours: for a colour use format html (the tag) or react/vue.' } : {}),
    ...(hits.length > 1 ? { alternatives: hits.slice(1).map(h => h.name) } : {}),
    more: { done: 'el.done("check-circle") turns a running <with-loader> into a finished icon', speed: 'CSS --wl-speed: 2 on any parent (inline svg)', catalog: `${CDN}catalog.json`, studio: 'https://withicons.com/loaders.html' },
  }
}

export function registerLoaderTool(server, { json, safe, ro }) {
  if (!LD.loaders.length) return
  const names = LD.loaders.map(l => l.name)
  server.registerTool('get_loader', {
    title: 'Get loader',
    description: `Animated loading indicators from @withicons/loaders: ${names.length} loaders (everyday spinners and dots, creative ones like ai-sparkle, rocket, coffee, festival ones like diya, fireworks, ghost, plus icon morph sequences), each in all ${LD.styles.length} styles. ` +
      'One self-contained animated SVG per loader (CSS transform/opacity, no JavaScript, slows for reduced motion). Pass query (what is loading: "ai thinking", "upload", "payment", "diwali") or name; ' +
      'morph: library icon names to chain into a custom sequence (["package", "truck", "home"]); a plain name is always an icon, "loader:<name>" puts a loader in the chain. Returns url and one line of code (img by default; html = the themeable <with-loader> tag; react; vue). ' +
      `Names: ${names.join(', ')}.`,
    inputSchema: {
      query: z.string().max(120).optional().describe('What is loading, in words'),
      name: z.string().max(60).optional().describe('Loader name or alias'),
      morph: z.array(z.string().min(1).max(60)).min(2).max(8).optional().describe('Icon names to turn into one another (custom sequence); "loader:<name>" for a loader'),
      effect: z.enum(EFFECTS).optional().describe('Morph hand-over (default bloom)'),
      style: z.enum(LD.styles).optional().describe('Style (default line)'),
      format: z.enum(FORMATS).optional().describe('img (default), html, react, vue or url'),
      size: z.number().int().min(12).max(512).optional().describe('Pixels (default 32)'),
      color: z.string().max(40).optional().describe('Ink colour (html / react / vue)'),
      speed: z.number().min(0.25).max(4).optional().describe('1 = as designed'),
      label: z.string().max(60).optional().describe('Accessible name (default "Loading")'),
    },
    annotations: { title: 'Get loader', ...ro },
  }, safe(a => json(getLoader(a))))
}
