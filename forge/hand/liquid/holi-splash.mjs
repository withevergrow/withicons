// forge/hand/liquid/holi-splash.mjs: the liquid holi splash: one soft round-lobed colour splat in clear glass, three round
// flung droplets tinted with the palette's own second colour (not the loud accent). No spikes, no hole, so it reads as a splash at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = d => ({ subs: parsePath(d) })
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const f = n => (+n.toFixed(2))

// round-tipped lobes: [angle in degrees (0 = right, clockwise), reach, half-width in degrees]
const CX = 11.4, CY = 12.2, BASE = 4.7
const LOBES = [[-70, 7.0, 24], [-15, 5.9, 22], [35, 6.4, 24], [95, 5.8, 22], [150, 7.2, 25], [205, 6.1, 22]]
const radius = a => {
  let r = BASE
  for (const [c, reach, w] of LOBES) {
    let d = Math.abs(((a - c + 540) % 360) - 180)
    if (d < w) r = Math.max(r, BASE + (reach - BASE) * (0.5 + 0.5 * Math.cos((d / w) * Math.PI)))
  }
  return r
}
function blob() {
  const N = 72, p = []
  for (let i = 0; i < N; i++) {
    const a = (i / N) * 360, r = radius(a), t = (a * Math.PI) / 180
    p.push([CX + r * Math.cos(t), CY + r * Math.sin(t)])
  }
  let d = `M${f(p[0][0])} ${f(p[0][1])}`
  for (let i = 0; i < N; i++) {
    const p0 = p[(i + N - 1) % N], p1 = p[i], p2 = p[(i + 1) % N], p3 = p[(i + 2) % N]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + ' Z'
}
const circle = (x, y, r) => `M${f(x + r)} ${f(y)} A${r} ${r} 0 1 1 ${f(x - r)} ${f(y)} A${r} ${r} 0 1 1 ${f(x + r)} ${f(y)} Z`
const SPLAT = blob()
const DOTS = [circle(20, 4.4, 1.7), circle(3.6, 20.2, 1.4), circle(20.3, 19.6, 1.2)]

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'holi-splash', paths: [],
    lines: [...lines(SPLAT, 'K'), ...DOTS.flatMap(d => lines(d, 'A'))],
    fills: [fill(SPLAT), ...DOTS.map(fill)],
    cutouts: [],
  }) || []
}
