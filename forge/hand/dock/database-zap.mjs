// forge/hand/dock/database-zap.mjs — a database drum in the light glyph material (an elliptic top and two stacked
// barrel bands split by clean tile-coloured grooves) with a bold accent lightning bolt set clear of it at the bottom
// right; the generated glyph was one plain mug-like barrel with the bolt knocked into it as a light sliver, so the bolt
// vanished and the stack never read as a database. Drawn in final tile units with the house tile, drop shadow and lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'database-zap'
const r2 = n => +(+n).toFixed(2)
// shift absolute path data (M L H V C Q A Z)
function sh(d, dy) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g)
  let out = '', i = 0, c = ''
  const n = () => +t[i++]
  const pt = () => `${r2(n())} ${r2(n() + dy)} `
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; out += c; if (c === 'Z') continue }
    if (c === 'M' || c === 'L') out += pt()
    else if (c === 'H') out += r2(n()) + ' '
    else if (c === 'V') out += r2(n() + dy) + ' '
    else if (c === 'Q') out += pt() + pt()
    else if (c === 'C') out += pt() + pt() + pt()
    else if (c === 'A') out += `${n()} ${n()} ${n()} ${n()} ${n()} ` + pt()
    else i++
  }
  return out.replace(/ ([A-Z])/g, '$1').trim()
}

// the drum: centre x 10.6, radius 5.6 across, 1.9 deep
const X0 = 5, X1 = 16.2, RX = 5.6, RY = 1.9
const TOP = `M${X0} 6.9A${RX} ${RY} 0 1 0 ${X1} 6.9A${RX} ${RY} 0 1 0 ${X0} 6.9Z`
const bandD = (y0, y1) => `M${X0} ${y0}A${RX} ${RY} 0 0 0 ${X1} ${y0}V${y1}A${RX} ${RY} 0 0 1 ${X0} ${y1}Z`
const BANDS = bandD(8, 11.95) + bandD(13.05, 16.7)
const DRUM = TOP + BANDS
// the bolt, bold and clear of the drum at the bottom right
const BOLT = 'M17.7 10.3L13.3 15.6H16.05L15.2 19.4L19.6 13.95H16.85Z'
const LIP = D.LIP

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'development' })
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const raised = (d, fill, cls, x = {}) => [
    ['path', { d: sh(d, LIP), fill, ...x, class: cls }],
    ['path', { d: sh(d, LIP), fill: v('shadow'), 'fill-opacity': 0.3, ...x, class: cls }],
    ['path', { d, fill, ...x, class: cls }],
  ]
  // the bolt's corners softened by a stroke of its own paint
  const soft = p => ({ stroke: p, 'stroke-width': 0.5, 'stroke-linejoin': 'round' })
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, 5, 12, 18.5, [stop(0, 'shine'), stop(1, 'tint')]),
      lin(4, 12, 10.3, 12, 19.4, [stop(0, 'shine', 0.5), stop(0.5, 'shine', 0.08), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: sh(DRUM, 0.76), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // the drum: bands first, the top face last so its front edge sits over the groove
    ...raised(BANDS, url(3), 'wm-k'),
    ...raised(TOP, url(3), 'wm-k'),
    // a clearance around the bolt, painted in the tile's own gradients (a knockout that keeps the tile seamless)
    ['path', { d: BOLT, fill: url(0), stroke: url(0), 'stroke-width': 2.2, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: BOLT, fill: url(1), stroke: url(1), 'stroke-width': 2.2, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    // the bolt
    ['path', { d: sh(BOLT, 0.76), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ...raised(BOLT, v('accent'), 'wm-s', soft(v('accent'))),
    ['path', { d: BOLT, fill: url(4), ...soft(url(4)), class: 'wm-shine' }],
  ]
}
