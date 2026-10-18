// forge/hand/dock/alpana.mjs — the skeleton's alpana: five curling swirl arms round a bright centre disc with a deep eye,
// and five rice-paste dots, all in the light glyph material on the pink tile; the generated glyph fattened the arms into a
// generic white flower. Arms are drawn as slim round-capped strokes so each curl stays open at 24 and 16px. Drawn on the
// 24 grid with the house tile, drop shadow and bottom lip.
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

const NAME = 'alpana'
const ARMS = [
  'M12 9.07C10.88 7.5 10.88 5.48 12.23 4.35C13.58 3.22 15.83 3.67 16.05 5.48C16.27 7.05 14.7 7.95 13.8 7.05',
  'M14.79 11.09C15.93 9.54 17.85 8.92 19.35 9.85C20.84 10.79 21.11 13.07 19.45 13.84C18.03 14.53 16.69 13.32 17.26 12.18',
  'M13.72 14.37C15.55 14.98 16.74 16.62 16.31 18.32C15.88 20.03 13.8 20.99 12.56 19.66C11.46 18.51 12.2 16.86 13.45 17.06',
  'M10.28 14.37C10.26 16.3 9.07 17.93 7.32 18.05C5.56 18.17 4.01 16.49 4.89 14.89C5.64 13.49 7.44 13.69 7.63 14.95',
  'M9.21 11.09C7.37 11.67 5.45 11.05 4.8 9.42C4.14 7.78 5.26 5.78 7.05 6.13C8.61 6.41 8.98 8.18 7.85 8.76',
]
const DOTS = [[19.39, 6.43], [19.58, 17.31], [9.3, 20.85], [2.75, 12.16], [8.99, 3.25]]
const SW = 1.9   // arm stroke on the grid

export default function render(icon) {
  const X = ctx(NAME, 'indian-festivals', icon, 0.84, 11.5, 12.05)
  const { v, url, M, circ } = X
  const sw = r2(SW * X.S)
  const arms = (dy, paint, w, extra = {}) => ARMS.map(d => ['path', { d: M(d, dy), stroke: paint, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k', ...extra }])
  const dots = (dy, fill, extra = {}) => DOTS.map(([x, y]) => ['circle', { ...circ(x, y, 1, dy), fill, class: 'wm-a', ...extra }])
  return [
    ...X.head(3.2, 21),
    ...arms(D.DROP, v('shadow'), r2(sw + 0.7), { 'stroke-opacity': 0.4 }),
    ['circle', { ...circ(12, 12, 3.1, D.DROP), fill: v('shadow'), 'fill-opacity': 0.4, class: 'wm-shadow' }],
    ...dots(D.DROP, v('shadow'), { 'fill-opacity': 0.4 }),
    ...arms(D.LIP, v('shadow'), sw, { 'stroke-opacity': 0.55 }),
    ...arms(0, url(3), sw),
    ['circle', { ...circ(12, 12 + D.LIP / X.S, 3.1), fill: v('shadow'), 'fill-opacity': 0.5, class: 'wm-k' }],
    ['circle', { ...circ(12, 12, 3.1), fill: url(3), class: 'wm-k' }],
    // the deep eye of the centre
    ['circle', { ...circ(12, 12, 1.15), fill: v('c1'), class: 'wm-a' }],
    ...dots(D.LIP, v('shadow'), { 'fill-opacity': 0.5 }),
    ...dots(0, url(3)),
  ]
}
