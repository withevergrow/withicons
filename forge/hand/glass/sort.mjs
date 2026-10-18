// forge/hand/glass/sort.mjs — a glass down-arrow beside three shrinking glass bars. The generated arrow was a pale
// frosted tube whose colour body sat slim and offset behind it, so it read nearly white and the sort direction got
// lost at 16px. Here every rod is a full colour-glass body (back -> shadow, an accent orb low right) seen through a
// thin frosted face, and the arrow's face is clearer still, so it reads as the deepest, leading part.
// Motion: bars wm-k, arrow wm-a (it nudges down with parts.A).
import { V } from '../../styles/_glass-soft.mjs'
import { roundStrokeSet, unionSets, translateSet } from '../../kernel/bool.mjs'
import { setD } from '../../kernel/geom.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
// horizontal capsule centred on y from x1 to x2, half-height h, moved by (dx, dy)
const cap = (x1, x2, y, h, dx = 0, dy = 0) => {
  const a = f(x1 + dx), b = f(x2 + dx), t = f(y + dy - h), u = f(y + dy + h)
  return `M${a} ${t}H${b}A${h} ${h} 0 0 1 ${b} ${u}H${a}A${h} ${h} 0 0 1 ${a} ${t}Z`
}

const H = 1.3                                  // rod half-width (the style's rods, 2.6u)
const BARS = [[13.5, 20.5, 5.5], [13.5, 18, 12], [13.5, 15.5, 18.5]]
const SEGS = [[[6, 4.5], [6, 19.5]], [[2.5, 16], [6, 19.5]], [[9.5, 16], [6, 19.5]]]

export default function render(icon) {
  const name = (icon && icon.name) || 'sort'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const arrow = unionSets(SEGS.map(s => roundStrokeSet(s, 2 * H)))
  const arrowBack = unionSets(SEGS.map(s => roundStrokeSet(s, 2 * H - 0.2)))
  const A = (set, dx, dy) => setD(translateSet(set, dx, dy), 0.02)
  const bars = (dx, dy, h) => BARS.map(([a, b, y]) => cap(a, b, y, h, dx, dy)).join('')

  const back = add(lin(id(), 3, 4, 21, 21, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 9, 17, 7, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 2, 3, 20, 21, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.42), stop(1, V.tint, 0.28)]))
  const clear = add(lin(id(), 2, 4, 10, 20, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.26), stop(1, V.tint, 0.12)]))
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5 }
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.88, 'stroke-width': 0.5, 'stroke-linecap': 'round' }

  return [['defs', {}, defs],
    // soft diffuse shadows
    ['path', { d: bars(0.3, 1, H + 0.15), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }],
    ['path', { d: A(arrow, 0.3, 1), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }],
    // bars: colour body behind, frosted face in front, rim on top
    ['path', { d: bars(0.4, 0.4, H - 0.1), fill: back, class: 'wm-k' }],
    ['path', { d: bars(0.4, 0.4, H - 0.1), fill: glow, class: 'wm-k' }],
    ['path', { d: bars(-0.25, -0.25, H), fill: pane, ...edge, class: 'wm-k' }],
    ['path', { d: BARS.map(([a, b, y]) => `M${f(a - 1.05)} ${f(y - 0.25)}A0.8 0.8 0 0 1 ${f(a - 0.25)} ${f(y - 1.05)}H${f(a + (b - a) * 0.55)}`).join(''), ...rim, class: 'wm-shine' }],
    // arrow: the same glass with a clearer face, so its colour leads
    ['path', { d: A(arrowBack, 0.4, 0.4), fill: back, class: 'wm-a' }],
    ['path', { d: A(arrowBack, 0.4, 0.4), fill: glow, class: 'wm-a' }],
    ['path', { d: A(arrow, -0.25, -0.25), fill: clear, ...edge, class: 'wm-a' }],
    ['path', { d: 'M5.75 3.45A0.8 0.8 0 0 0 4.95 4.25V15.2M1.5 15.48A0.8 0.8 0 0 1 2.52 15', ...rim, class: 'wm-a' }],
  ]
}
