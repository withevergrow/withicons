// forge/hand/dock/battery-low.mjs — a light battery shell with a deep empty cavity and one short red sliver at the left
// (the low charge), plus the small terminal cap; the generated glyph knocked the cavity out as tile colour so it read as a
// nearly full green bar. Drawn on the 24 grid with the house tile, drop shadow and bottom lip.
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

const NAME = 'battery-low'
const SHELL = 'M4.6 6.2H16.4A2.6 2.6 0 0 1 19 8.8V15.2A2.6 2.6 0 0 1 16.4 17.8H4.6A2.6 2.6 0 0 1 2 15.2V8.8A2.6 2.6 0 0 1 4.6 6.2Z'
const CAP = 'M19.4 10.2H21.4A1 1 0 0 1 22.4 11.2V12.8A1 1 0 0 1 21.4 13.8H19.4Z'
const CAVITY = 'M4.6 8.3H16.4A1 1 0 0 1 17.4 9.3V14.7A1 1 0 0 1 16.4 15.7H4.6A1 1 0 0 1 3.6 14.7V9.3A1 1 0 0 1 4.6 8.3Z'
const SLIVER = 'M5.5 9.5H7.6A.8.8 0 0 1 8.4 10.3V13.7A.8.8 0 0 1 7.6 14.5H5.5A.8.8 0 0 1 4.7 13.7V10.3A.8.8 0 0 1 5.5 9.5Z'

export default function render(icon) {
  const X = ctx(NAME, 'devices', icon, 0.8, 12.2, 12, { accent: '#FF3B30' })
  const { v, url, M, fy } = X
  return [
    ...X.head(6.2, 17.8, [
      // 4 the red low-charge bar, 5 the cavity's inner shade
      X.lin(4, 12, fy(9.5), 12, fy(14.5), [X.stop(0, 'accent'), X.stop(1, 'accent', 0.78)]),
      X.lin(5, 12, fy(8.3), 12, fy(15.7), [X.stop(0, 'shadow', 0.95), X.stop(1, 'shadow', 0.75)]),
    ]),
    ['path', { d: M(SHELL + CAP, D.DROP), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ...X.raised(SHELL, url(3), 'wm-k'),
    ...X.raised(CAP, url(3), 'wm-k'),
    // the empty cavity, deep tone
    ['path', { d: M(CAVITY), fill: url(5), class: 'wm-k' }],
    // the low sliver
    ['path', { d: M(SLIVER), fill: url(4), class: 'wm-a' }],
    ['path', { d: M('M5.5 9.5H7.6'), stroke: v('shine'), 'stroke-opacity': 0.5, 'stroke-width': 0.35, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
