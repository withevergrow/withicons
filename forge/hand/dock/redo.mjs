// forge/hand/dock/redo.mjs — the full U-turn redo arrow (a loop out of the right edge, an open chevron head at the upper
// right) in the light glyph material, scaled up to fill the tile; the generated glyph shrank it to a short right-angle bend
// that no longer read as a turn. Drawn on the 24 grid with the house tile, drop shadow and bottom lip.
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

const NAME = 'redo'
const LOOP = 'M20.5 9.5H9A5.5 5.5 0 0 0 9 20.5H14.5'
const HEAD = 'M15.5 4.5L20.5 9.5L15.5 14.5'
const W = 2.4                                      // stroke on the grid

export default function render(icon) {
  const X = ctx(NAME, 'actions', icon, 0.78, 12, 12.5)
  const { v, url, M } = X
  const sw = r2(W * X.S)
  const line = (dy, paint, extra = {}, cls = 'wm-k') => [LOOP, HEAD].map((d, i) => ['path', { d: M(d, dy), stroke: paint, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: i ? 'wm-a' : cls, ...extra }])
  return [
    ...X.head(4.5, 20.5),
    ...[LOOP, HEAD].map(d => ['path', { d: M(d, D.DROP), stroke: v('shadow'), 'stroke-opacity': 0.4, 'stroke-width': r2(sw + 0.7), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }]),
    ...line(D.LIP, v('shadow'), { 'stroke-opacity': 0.55 }),
    ...line(0, url(3)),
  ]
}
