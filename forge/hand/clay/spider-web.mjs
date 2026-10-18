// forge/hand/clay/spider-web.mjs — a plump grey-violet clay spider web: a hexagonal silhouette whose six sides sag inward in
// scallops (the line design's concave sides), a hub in the middle and three crossing spokes, with six open windows punched
// clear through between the spokes. The generated web was a rounded octagon with thin radial grooves; here the sagging sides
// and the see-through windows say "web". Same model and light as the generator (_clay-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.filter(p => p.d).map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.f).map(p => { const subs = parsePath(p.f); return { d: p.f, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const rad = a => a * Math.PI / 180

// the hexagon's six corners (top, bottom and the four sides) with every side sagging in toward the centre
const ANG = [-90, -30, 30, 90, 150, 210]
const R = 11, SAG = 0.8
const V = ANG.map(a => [12 + R * Math.cos(rad(a)), 12 + R * Math.sin(rad(a))])
const ctrl = i => { const a = V[i], b = V[(i + 1) % 6]; return [12 + ((a[0] + b[0]) / 2 - 12) * SAG, 12 + ((a[1] + b[1]) / 2 - 12) * SAG] }
function webD() {
  let d = `M${r2(V[0][0])} ${r2(V[0][1])}`
  for (let i = 0; i < 6; i++) { const c = ctrl(i), b = V[(i + 1) % 6]; d += `Q${r2(c[0])} ${r2(c[1])} ${r2(b[0])} ${r2(b[1])}` }
  return d + 'Z'
}
const quad = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]
// the web outline sampled (for point-in-polygon), shrunk toward the centre by K so the rim stays ~1.2 wide
const KIN = 0.85
const OUTLINE = []
for (let i = 0; i < 6; i++) for (let j = 0; j < 20; j++) { const p = quad(V[i], ctrl(i), V[(i + 1) % 6], j / 20); OUTLINE.push([12 + (p[0] - 12) * KIN, 12 + (p[1] - 12) * KIN]) }
function inside(p) {
  let c = false
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i], [xj, yj] = OUTLINE[j]
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c
  }
  return c
}
// a window between the spokes at a0 and a1: its sides run parallel to the spokes (ribs hw wide each side), its inner end
// is an arc round the hub, its outer edge follows the web's own sagging side, kept ~1.2 inside it
function windowD(i, rin, hw) {
  const a0 = ANG[i], a1 = a0 + 60
  const side = (a, sgn) => {
    const u = [Math.cos(rad(a)), Math.sin(rad(a))], n = [-u[1] * sgn, u[0] * sgn]
    const at = t => [12 + t * u[0] + hw * n[0], 12 + t * u[1] + hw * n[1]]
    let lo = Math.sqrt(rin * rin - hw * hw), hi = 16
    for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (inside(at(m))) lo = m; else hi = m }
    return { at, t: lo }
  }
  const s0 = side(a0, 1), s1 = side(a1, -1)
  const P0o = s0.at(s0.t), P1o = s1.at(s1.t)
  const ang = p => { let d = Math.atan2(p[1] - 12, p[0] - 12) * 180 / Math.PI; while (d < a0 - 1) d += 360; return d }
  const aMin = ang(P0o), aMax = ang(P1o)
  const pts = [P0o]
  for (let j = 1; j < 20; j++) { const p = quad(V[i], ctrl(i), V[(i + 1) % 6], j / 20), q = [12 + (p[0] - 12) * KIN, 12 + (p[1] - 12) * KIN], an = ang(q); if (an > aMin + 1.2 && an < aMax - 1.2) pts.push(q) }
  pts.push(P1o)
  const P = (r, a) => `${r2(12 + r * Math.cos(rad(a)))} ${r2(12 + r * Math.sin(rad(a)))}`
  const dl = Math.asin(hw / rin) * 180 / Math.PI
  return `M${P(rin, a0 + dl)}A${rin} ${rin} 0 0 1 ${P(rin, a1 - dl)}` + pts.map(p => `L${r2(p[0])} ${r2(p[1])}`).reverse().join('') + 'Z'
}
const WEB = webD()
const WINDOWS = ANG.map((_, i) => windowD(i, 3.2, 1.3))

// the generator would pick the pale "cream" family for this name; a lilac web keeps its contrast and sits with the violet siblings
const LILAC = { '#F4EEFF': '#9F86FF', '#FFFFFF': '#E9E0FF', '#3B2E6E': '#34197E' }
const recolour = v => typeof v === 'string' ? v.replace(/#[0-9A-Fa-f]{6}/g, h => LILAC[h.toUpperCase()] || h) : v
const walk = n => Array.isArray(n) ? n.map(walk) : (n && typeof n === 'object') ? Object.fromEntries(Object.entries(n).map(([k, v]) => [k, walk(v)])) : recolour(n)

export default function render(icon) {
  const name = (icon && icon.name) || 'spider-web'
  const nodes = walk(build(skeleton(name, [
    { f: WEB + WINDOWS.join(''), plate: 'K' },
  ], WINDOWS)))
  // an orange dewdrop bead on the hub: the accent that lifts the web off the page
  const cx = r2(12 + K.TX), cy = r2(12 + K.TY)
  const col = (r, h) => `var(--with-clay-${r}, ${h})`
  const bead = (x, y, rx, ry) => `M${r2(x - rx)} ${y}A${rx} ${ry} 0 1 0 ${r2(x + rx)} ${y}A${rx} ${ry} 0 1 0 ${r2(x - rx)} ${y}Z`
  nodes.push(['path', { d: bead(cx + 0.1, cy + 0.25, 1.9, 1.9), fill: col('shadow', '#34197E'), 'fill-opacity': 0.4, class: 'wm-a' }])
  nodes.push(['path', { d: bead(cx, cy, 1.85, 1.85), fill: col('c2', '#FFB257'), class: 'wm-a' }])
  nodes.push(['path', { d: bead(cx - 0.5, cy - 0.55, 0.55, 0.4), fill: col('shine', '#FFFFFF'), 'fill-opacity': 0.85, class: 'wm-shine' }])
  return nodes
}
