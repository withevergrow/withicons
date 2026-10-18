// forge/hand/dock/coffin.mjs — a six-sided coffin (narrow head, wide shoulders, tapering foot) in the light glyph
// material with a bold cross carved into the lid in the tile colour, drawn in final tile units with the house tile,
// drop shadow and bottom lip. Replaces the generated hexagon + thin cutout cross, which read as a plain gem.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'coffin'
const r2 = n => +(+n).toFixed(2)
// rounded polygon: each corner is cut back by r along both edges and joined with a quadratic
function rpoly(pts, r) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const u = (q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [dx / l, dy / l] }
    const ua = u(a), ub = u(b)
    const s = [p[0] + ua[0] * r, p[1] + ua[1] * r], e = [p[0] + ub[0] * r, p[1] + ub[1] * r]
    d += (i ? 'L' : 'M') + `${r2(s[0])} ${r2(s[1])}Q${r2(p[0])} ${r2(p[1])} ${r2(e[0])} ${r2(e[1])}`
  }
  return d + 'Z'
}
const rect = (x0, y0, x1, y1) => `M${x0} ${y0}H${x1}V${y1}H${x0}Z`

const PTS = [[9.4, 3.8], [14.6, 3.8], [18.2, 8.4], [14.9, 20.2], [9.1, 20.2], [5.8, 8.4]]
const COFFIN = rpoly(PTS, 1)
const COFFIN_LIP = rpoly(PTS.map(([x, y]) => [x, y + 0.34]), 1)
const CROSS = rect(11.3, 7.6, 12.7, 16.4) + rect(9.3, 9.4, 14.7, 10.8)

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'halloween' })
  const id = n => `wg-dock-${NAME}-${n}`, url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, 3.8, 12, 20.2, [stop(0, 'shine'), stop(1, 'tint')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    // glyph drop shadow, bottom lip, then the lid
    ['path', { d: rpoly(PTS.map(([x, y]) => [x, y + 0.76]), 1), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: COFFIN_LIP, fill: url(3), class: 'wm-k' }],
    ['path', { d: COFFIN_LIP, fill: v('shadow'), 'fill-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: COFFIN, fill: url(3), class: 'wm-k' }],
    ['path', { d: CROSS, fill: v('c1'), class: 'wm-a' }],
  ]
}
