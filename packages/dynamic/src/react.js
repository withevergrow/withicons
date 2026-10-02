// React wrapper: <LiveIcon name="calendar-date" day={17} month="MAR" variant="glass" size={48} />
// Every prop that is a param of the icon is a param; the rest (onClick, data-*, aria-*, id, title...) go on the <svg>.
import { createElement, useEffect, useState } from 'react'
import * as L from './core.js'

const OWN = new Set(['name', 'variant', 'size', 'color', 'strokeWidth', 'absoluteStrokeWidth', 'label', 'vars', 'className', 'style', 'params', 'today', 'children'])
const camel = k => k.startsWith('aria-') || k.startsWith('data-') || k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
const cssObj = s => {
  const o = {}
  for (const part of String(s || '').split(';')) { const i = part.indexOf(':'); if (i > 0) o[camel(part.slice(0, i).trim())] = part.slice(i + 1).trim() }
  return o
}

/** A Live icon as an inline <svg>. Styles other than the bundled ones load on first use (an empty svg holds the space). */
export function LiveIcon(props) {
  const { name, variant, size, color, strokeWidth, absoluteStrokeWidth, label, vars, className, style, params, today } = props
  const v = variant || L.defaultStyle
  const [, bump] = useState(0)
  const ready = L.loaded(v)
  useEffect(() => {
    if (ready) return
    let live = true
    L.load(v).then(() => live && bump(n => n + 1), e => console.warn(e.message))
    return () => { live = false }
  }, [v, ready])
  const meta = name ? L.get(name) : null
  const p = { ...(today && meta ? pick(L.now(), meta.params) : null), ...(params || null) }
  const rest = {}
  for (const k in props) {
    if (OWN.has(k)) continue
    if (meta && k in meta.params) p[k] = props[k]
    else rest[k] = props[k]
  }
  const o = { size, color, strokeWidth, absoluteStrokeWidth, label, vars }
  if (!meta || !ready) {
    if (name && !meta) console.warn(`with icons live: unknown live icon "${name}". Did you mean: ${L.suggest(name).join(', ')}?`)
    return createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size || 24, height: size || 24, viewBox: '0 0 24 24', 'aria-hidden': true, className, style, ...rest })
  }
  const { attrs, inner } = L.parts(name, p, v, o)
  const svgProps = {}
  for (const k in attrs) if (k !== 'style' && k !== 'class') svgProps[camel(k)] = attrs[k]
  return createElement('svg', {
    ...svgProps, className, style: attrs.style || style ? { ...cssObj(attrs.style), ...style } : undefined,
    ...rest, dangerouslySetInnerHTML: { __html: inner },
  })
}
function pick(src, keys) { const o = {}; for (const k in src) if (k in keys) o[k] = src[k]; return o }
export default LiveIcon
export { render, renderAsync, load, list, get, defaults, catalog, styles, resolve, validate } from './core.js'
