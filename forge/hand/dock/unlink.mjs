// forge/hand/dock/unlink.mjs — two chain links drawn apart along the diagonal (open ovals through the light glyph material)
// with a wide visible gap and two yellow break ticks between them; the generated glyph pushed the links together into one
// chain. Drawn on the 24 grid with the house tile, drop shadow and bottom lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const r2 = n => +(+n).toFixed(2)
// a map from the 24 drawing grid onto the tile: uniform scale S about (cx0, cy0), landing on the tile centre
function ctx(NAME, cat, icon, S, cx0, cy0, over) {
  const C = { ...colourway(icon || { name: NAME, category: cat }), ...(over || {}) }
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const fx = x => r2(12 + (x - cx0) * S)
  const fy = (y, dy = 0) => r2(D.CY + (y - cy0) * S + dy)
  function M(d, dy = 0) {
    const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g)
    let out = '', i = 0, c = ''
    const n = () => +t[i++]
    const pt = () => `${fx(n())} ${fy(n(), dy)} `
    while (i < t.length) {
      if (/[A-Za-z]/.test(t[i])) { c = t[i++]; out += c; if (c === 'Z') continue }
      if (c === 'M' || c === 'L') out += pt()
      else if (c === 'H') out += fx(n()) + ' '
      else if (c === 'V') out += fy(n(), dy) + ' '
      else if (c === 'Q') out += pt() + pt()
      else if (c === 'C') out += pt() + pt() + pt()
      else if (c === 'A') out += `${r2(n() * S)} ${r2(n() * S)} ${n()} ${n()} ${n()} ` + pt()
      else i++
    }
    return out.replace(/ ([A-Z])/g, '$1').trim()
  }
  const circ = (x, y, r, dy = 0) => ({ cx: fx(x), cy: fy(y, dy), r: r2(r * S) })
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  // defs 0-3 are the house set (3 = the light glyph material over [gy0, gy1] on the grid); extras follow from 4
  const head = (gy0, gy1, extra = []) => [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, fy(gy0), 12, fy(gy1), [stop(0, 'shine'), stop(1, 'tint')]),
      ...extra,
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
  ]
  // a raised filled shape: darker bottom lip under it, then the shape itself
  const raised = (d, fill, cls, extra = {}) => [
    ['path', { d: M(d, D.LIP), fill, class: cls, ...extra }],
    ['path', { d: M(d, D.LIP), fill: v('shadow'), 'fill-opacity': 0.3, class: cls, ...extra }],
    ['path', { d: M(d), fill, class: cls, ...extra }],
  ]
  return { C, id, url, v, stop, lin, fx, fy, M, circ, head, raised, S }
}

const NAME = 'unlink'
const A = 'M3.5 16.5L6.5 13.5A2.83 2.83 0 0 1 10.5 17.5L7.5 20.5A2.83 2.83 0 0 1 3.5 16.5ZM4.62 17.62L7.62 14.62A1.25 1.25 0 0 1 9.38 16.38L6.38 19.38A1.25 1.25 0 0 1 4.62 17.62Z'
const B = 'M13.5 6.5L16.5 3.5A2.83 2.83 0 0 1 20.5 7.5L17.5 10.5A2.83 2.83 0 0 1 13.5 6.5ZM14.62 7.62L17.62 4.62A1.25 1.25 0 0 1 19.38 6.38L16.38 9.38A1.25 1.25 0 0 1 14.62 7.62Z'
const TICKS = 'M9 9L7 7M15 15L17 17'

export default function render(icon) {
  const X = ctx(NAME, 'actions', icon, 0.82, 12, 12)
  const { v, url, M } = X
  const tick = (dy, paint, extra = {}) => ['path', { d: M(TICKS, dy), stroke: paint, 'stroke-width': r2(2.2 * X.S), 'stroke-linecap': 'round', class: 'wm-a', ...extra }]
  return [
    ...X.head(3.5, 20.5),
    ['path', { d: M(A + B, D.DROP), fill: v('shadow'), 'fill-opacity': 0.4, 'fill-rule': 'evenodd', stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ...X.raised(A, url(3), 'wm-k', { 'fill-rule': 'evenodd' }),
    ...X.raised(B, url(3), 'wm-k', { 'fill-rule': 'evenodd' }),
    tick(D.DROP, v('shadow'), { 'stroke-opacity': 0.4 }),
    tick(0, v('c2')),
  ]
}
