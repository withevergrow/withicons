// @withicons/mcp — icon library logic shared by the MCP server (stdio + Lambda), the JSON API and the `withicons` CLI.
// No MCP SDK in here. Data comes from '#data' (files on disk for npm, inlined JSON for the Lambda bundle).
import { create, titleOf } from '../../search/src/engine.mjs'
import { loadData } from '#data'

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

export function svgOf(name, style, { size, color, strokeWidth } = {}) {
  const d = data()
  let svg = d.svg(style)[name]
  if (!svg) throw new IconError(`"${name}" is not available in style "${style}"`, { code: 'missing_style' })
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
      const svg = svgOf(name, style, { ...opts, color: opts.color || '#000' })
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
      return `<link rel="stylesheet" href="${CDN}/web/dist/classes/with-${style}.css">\n\n<i class="with with-${name}${style === 'line' ? '' : ' with-' + style}"${sizeAttr ? ` style="font-size:${size}px"` : ''}></i>`
    case 'web-component':
      return `<script type="module" src="${CDN}/web/dist/index.js"></script>\n\n<with-icon name="${name}"${style === 'line' ? '' : ` variant="${style}"`}${sizeAttr ? ` size="${size}"` : ''}></with-icon>`
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
    case 'web-component': return `<script type="module" src="${CDN}/web/dist/index.js"></script>`
    case 'html-class': return `<link rel="stylesheet" href="${CDN}/web/dist/classes/with-${style}.css">`
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

export function getIcon({ name, style = 'line', format = 'svg', size, color, strokeWidth } = {}) {
  const canonical = resolveName(name)
  style = checkStyle(style); format = checkFormat(format)
  const m = data().byName.get(canonical)
  return {
    name: canonical, ...(canonical !== String(name) ? { requested: String(name) } : {}),
    title: titleOf(canonical), category: m.category, style, format, size: size ? +size : 24,
    code: snippet(canonical, style, format, { size, color, strokeWidth }),
    url: `${SITE}/icons/${canonical}.html`,
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
  return data().meta.styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, default: s.name === 'line' }))
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
  return { version: d.meta.version, icons: d.meta.icons.length, styles: d.styleNames, formats: FORMATS, site: SITE }
}
