// forge/hand/liquid/file-json.mjs: the data page as one clear glass sheet with a clipped top-right corner, a solid violet
// fold flap there, and a crisp { } pair inlaid in violet glass with clear glass between the two braces (the line design;
// the generated version let hollow tubes and grooves overlap into a muddle). The braces are drawn as ribbons of 1.7u so
// two of them fit the page without touching. Same glass recipe as the generator (_liquid-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const PAGE = 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'
const FOLD = 'M14.6 3.6 V6 A1.4 1.4 0 0 0 16 7.4 H18.4 Z'

// left brace centreline in two runs (top hook to the nub tip, nub tip to bottom hook): cubic and straight segments
const UP = [
  [[10.5, 10.9], [9.8, 10.9], [9.3, 11.4], [9.3, 12.2]],
  [[9.3, 12.2], [9.3, 12.6], [9.3, 13.1], [9.3, 13.5]],
  [[9.3, 13.5], [9.3, 14.3], [8.9, 14.9], [7.9, 15]],
]
const DOWN = [
  [[7.9, 15], [8.9, 15.1], [9.3, 15.7], [9.3, 16.5]],
  [[9.3, 16.5], [9.3, 16.9], [9.3, 17.4], [9.3, 17.8]],
  [[9.3, 17.8], [9.3, 18.6], [9.8, 19.1], [10.5, 19.1]],
]
function centreline(segs) {
  const out = []
  for (const [a, b, c, d] of segs) for (let i = 0; i < 10; i++) {
    const t = i / 10, m = 1 - t
    out.push([m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0], m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1]])
  }
  out.push(segs.at(-1)[3])
  return out
}
// a ribbon of half width hw around a polyline, with round caps, as one closed polygon (mirrored about x = 12 on request)
function ribbon(pts, hw, mirror) {
  const P = pts
  const n = P.length, L = [], R = []
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    L.push([P[i][0] - dy / l * hw, P[i][1] + dx / l * hw]); R.push([P[i][0] + dy / l * hw, P[i][1] - dx / l * hw])
  }
  const cap = (c, from) => { // half circle that turns clockwise from `from` (a point on the circle round c)
    const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]), out = []
    for (let k = 1; k < 6; k++) out.push([c[0] + hw * Math.cos(a0 - Math.PI * k / 6), c[1] + hw * Math.sin(a0 - Math.PI * k / 6)])
    return out
  }
  const ring = [...L, ...cap(P[n - 1], L[n - 1]), ...R.reverse(), ...cap(P[0], R[0])]
  return 'M' + ring.map(p => `${r2(mirror ? 24 - p[0] : p[0])} ${r2(p[1])}`).join('L') + 'Z'
}

const prep = (name, paths, fills) => ({
  name, paths: [], cutouts: [],
  lines: paths.flatMap(([d, plate]) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))),
  fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
})
// the braces are a second glass pass laid over the page (its only line is parked off the grid so the fills read as c2 glass)
const OFF = { pts: [[-8, -8], [-7, -8]], closed: false, plate: 'A' }

export default function render(icon) {
  const name = (icon && icon.name) || 'file-json'
  const up = centreline(UP), down = centreline(DOWN)
  const page = build(prep(name, [[PAGE, 'K'], [FOLD, 'A']], [PAGE]))
  for (const n of page) if (n[0] !== 'defs' && n[1].stroke === 'currentColor') n[1]['stroke-opacity'] = 0.42
  const b = build({ ...prep(name, [], [ribbon(up, 0.85, false), ribbon(down, 0.85, false), ribbon(up, 0.85, true), ribbon(down, 0.85, true)]), lines: [OFF] })
  const ren = v => String(v).replace(new RegExp(`wg-liquid-${name}-([0-9]+)`, 'g'), (_, n) => `wg-liquid-${name}-${+n + 6}`)
  const defs = [], body = []
  for (const n of b) {
    if (n[0] === 'defs') { for (const g of n[2]) defs.push([g[0], { ...g[1], id: ren(g[1].id) }, g[2]]); continue }
    const at = { ...n[1] }
    if (at.class === 'wm-shadow') continue
    if (at.fill) at.fill = ren(at.fill)
    if (at.stroke) at.stroke = ren(at.stroke)
    if (at.stroke === 'currentColor') at['stroke-opacity'] = 0.42
    if (at.class !== 'wm-shine') at.class = 'wm-a'
    body.push([n[0], at])
  }
  const used = new Set(body.flatMap(n => [n[1].fill, n[1].stroke]).map(v => (String(v).match(/#([^)]+)\)/) || [])[1]).filter(Boolean))
  const d0 = page[0]
  return [['defs', {}, [...d0[2], ...defs.filter(g => used.has(g[1].id))]], ...page.slice(1), ...body]
}
