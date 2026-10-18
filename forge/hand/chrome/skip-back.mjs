// forge/hand/chrome/skip-back.mjs — a gunmetal stop bar beside a crisp chrome arrowhead pointing left, the mirror of
// skip-forward. The generated bar was a bare 2u line, a hairline next to the inflated arrow that vanished at 16px; here
// the bar is a filled slab at the arrow's rim weight, and the arrowhead keeps small corner radii (tip 1u, back 0.875u)
// so it reads as the same triangle as play, rewind and skip-forward instead of a rounded bullet.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const r = v => Math.round(v * 100) / 100
// a polygon with each corner filleted by its own radius, as an SVG path of lines and arcs
function rounded(pts) {
  const n = pts.length, seg = []
  for (let i = 0; i < n; i++) {
    const [P, rad] = pts[i], A = pts[(i + n - 1) % n][0], B = pts[(i + 1) % n][0]
    const u = [A[0] - P[0], A[1] - P[1]], v = [B[0] - P[0], B[1] - P[1]]
    const lu = Math.hypot(...u), lv = Math.hypot(...v)
    u[0] /= lu; u[1] /= lu; v[0] /= lv; v[1] /= lv
    const half = Math.acos(u[0] * v[0] + u[1] * v[1]) / 2, t = rad / Math.tan(half)
    const sweep = u[0] * v[1] - u[1] * v[0] < 0 ? 1 : 0
    seg.push({ a: [P[0] + u[0] * t, P[1] + u[1] * t], b: [P[0] + v[0] * t, P[1] + v[1] * t], rad, sweep })
  }
  let d = `M${r(seg[0].b[0])} ${r(seg[0].b[1])}`
  for (let i = 1; i <= n; i++) {
    const s = seg[i % n]
    d += `L${r(s.a[0])} ${r(s.a[1])}A${s.rad} ${s.rad} 0 0 ${s.sweep} ${r(s.b[0])} ${r(s.b[1])}`
  }
  return d + 'Z'
}

const ARROW = rounded([[[19.5, 5.75], 0.875], [[9.75, 12], 1], [[19.5, 18.25], 0.875]])
const BAR = 'M4 5.5H5.75V18.5H4Z'

function skeleton(name) {
  const paths = [{ id: 'p0', d: ARROW, plate: 'K' }, { id: 'p1', d: BAR, plate: 'A' }]
    .map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(ARROW), fill(BAR)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'skip-back'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
