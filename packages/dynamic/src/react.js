// React wrapper: <LiveIcon name="calendar-date" day={17} month="MAR" variant="glass" size={48} />
// Every prop that is a param of the icon is a param; the rest (onClick, data-*, aria-*, id, title...) go on the <svg>.
// animate (true or ms): when params change, the icon moves to the new values (numbers roll, levels ease, clock hands take
// the short way, words and choices cross-fade) instead of jumping; instant with prefers-reduced-motion.
// Without a label the svg is named by what it shows ("Calendar date, March 17"); label="" makes it decorative.
import { createElement, useEffect, useRef, useState } from 'react'
import * as L from './core.js'

const OWN = new Set(['name', 'variant', 'size', 'color', 'strokeWidth', 'absoluteStrokeWidth', 'label', 'vars', 'className', 'style', 'params', 'today', 'children', 'animate'])
const camel = k => k.startsWith('aria-') || k.startsWith('data-') || k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
const cssObj = s => {
  const o = {}
  for (const part of String(s || '').split(';')) { const i = part.indexOf(':'); if (i > 0) o[camel(part.slice(0, i).trim())] = part.slice(i + 1).trim() }
  return o
}
const msOf = a => typeof a === 'number' && a >= 0 ? a : undefined

/** A Live icon as an inline <svg>. Styles other than the bundled ones load on first use (an empty svg holds the space). */
export function LiveIcon(props) {
  const { name, variant, size, color, strokeWidth, absoluteStrokeWidth, label, vars, className, style, params, today, animate } = props
  const v = variant || L.defaultStyle
  const [, bump] = useState(0)
  const [frame, setFrame] = useState(null)
  const shown = useRef(null), ctl = useRef(null), svg = useRef(null)
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
  const target = meta ? L.resolve(name, p) : null
  const key = meta ? name + '\u0001' + v + '\u0001' + JSON.stringify(target) : ''
  const on = !!animate && animate !== 'false'
  // a new target while animate is on: keep drawing what is on screen until the transition paints its first frame
  const last = shown.current
  const moving = on && ready && last && last.key !== key && last.name === name && last.variant === v
  useEffect(() => {
    if (!meta || !ready) return
    const prev = shown.current
    if (!on || !prev || prev.key === key || prev.name !== name || prev.variant !== v) {
      if (ctl.current) { ctl.current.cancel(); ctl.current = null }
      shown.current = { key, name, variant: v, params: target }
      setFrame(null)
      return
    }
    const from = ctl.current ? ctl.current.params : prev.params
    const c = ctl.current = L.transition(name, from, target, v, {
      ms: msOf(animate), owner: ctl,
      paint: (fp, info) => {
        setFrame(fp)
        if (info.swap && svg.current && svg.current.animate && !L.reducedMotion()) svg.current.animate([{ opacity: 0.2, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease-out' })
      },
      done: completed => { if (ctl.current !== c) return; ctl.current = null; if (completed) { shown.current = { key, name, variant: v, params: target }; setFrame(null); bump(n => n + 1) } },
    })
  }, [key, on])
  useEffect(() => () => { if (ctl.current) ctl.current.cancel() }, [])
  const o = { size, color, strokeWidth, absoluteStrokeWidth, vars, label }
  if (!meta || !ready) {
    if (name && !meta) console.warn(`with icons live: unknown live icon "${name}". Did you mean: ${L.suggest(name).join(', ')}?`)
    return createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size || 24, height: size || 24, viewBox: '0 0 24 24', 'aria-hidden': true, className, style, ...rest })
  }
  const draw = frame || (moving ? last.params : p)
  if (label == null && rest['aria-hidden'] !== true && rest['aria-hidden'] !== 'true' && !rest['aria-label'] && !rest['aria-labelledby']) o.label = L.describe(name, draw)
  else if (label === '') o.label = null
  let drawn
  try { drawn = L.parts(name, draw, v, o) } catch (e) { drawn = L.parts(name, p, v, o) }
  const { attrs, inner } = drawn
  const svgProps = {}
  for (const k in attrs) if (k !== 'style' && k !== 'class') svgProps[camel(k)] = attrs[k]
  return createElement('svg', {
    ...svgProps, className, style: attrs.style || style ? { ...cssObj(attrs.style), ...style } : undefined,
    ...rest, ref: on ? svg : rest.ref, dangerouslySetInnerHTML: { __html: inner },
  })
}
function pick(src, keys) { const o = {}; for (const k in src) if (k in keys) o[k] = src[k]; return o }
export default LiveIcon
export { render, renderAsync, load, list, get, defaults, catalog, styles, resolve, validate, describe, transition, interpolate, setMotion } from './core.js'
