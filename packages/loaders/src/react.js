// React: <Loader name="spinner" variant="glass" size={32} speed={1.2} />  ·  <Morph items={['file', 'cloud-upload', 'check-circle']} />
// Morph items are library icon names; 'loader:<name>' (or { loader: '<name>' }) puts a loader in the chain.
// Inline SVG (currentColor, CSS variables, crisp at any size). Styles other than line load on first use; an empty box
// of the same size holds the space meanwhile. Extra props (className, style, onClick, data-*, aria-*) go on the wrapper.
import { createElement, useEffect, useState } from 'react'
import * as React from 'react'
import * as L from './core.js'

let UID = 0
const useUid = () => { const r = React.useId ? React.useId() : null; const [u] = useState(() => r || 'r' + (++UID)); return String(r || u).replace(/[^\w-]/g, '') }
const box = (size, props, html, label) => createElement('span', {
  ...props, role: label === '' ? undefined : 'progressbar', 'aria-label': label === '' ? undefined : (label == null ? 'Loading' : label),
  'aria-busy': label === '' ? undefined : true, 'aria-hidden': label === '' ? true : undefined,
  style: { display: 'inline-flex', lineHeight: 0, width: typeof size === 'number' ? size : size, height: typeof size === 'number' ? size : size, ...(props.style || {}) },
  dangerouslySetInnerHTML: html ? { __html: html } : undefined,
})

export function Loader({ name = 'spinner', variant = 'line', size = 24, color, speed, paused, label, vars, ...rest }) {
  const uid = useUid()
  const [, bump] = useState(0)
  const ready = L.loaded(variant)
  useEffect(() => {
    if (ready) return
    let live = true
    L.load(variant).then(() => live && bump(n => n + 1), e => console.warn(e.message))
    return () => { live = false }
  }, [variant, ready])
  const html = ready ? L.svg(name, { style: variant, size, color, speed, paused, vars, label: '', idSuffix: uid }) : ''
  return box(size, rest, html, label)
}

export function Morph({ items, variant = 'line', effect = 'bloom', hold, size = 24, color, speed, paused, label, vars, ...rest }) {
  const uid = useUid()
  const [html, setHtml] = useState('')
  const key = (Array.isArray(items) ? items : [items]).map(it => it && typeof it === 'object' ? JSON.stringify(it) : String(it)).join('\u0001')
  useEffect(() => {
    let live = true
    L.morphAsync(items, { style: variant, effect, hold, size, color, speed, paused, vars, label: '', id: 'wl-m' + uid })
      .then(s => live && setHtml(s), e => console.warn(e.message))
    return () => { live = false }
  }, [key, variant, effect, hold, size, color, speed, paused, JSON.stringify(vars || null)])
  return box(size, rest, html, label)
}
export default Loader
