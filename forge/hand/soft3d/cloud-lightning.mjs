// forge/hand/soft3d/cloud-lightning.mjs — a soft sky-blue cloud slab with a bold stepped zigzag bolt standing in front
// of its lower edge in the accent colour; replaces the generated drawing whose thin bolt and hooked groove read as a
// "7" and an arc. The cloud comes from the style's own solid + light engine; the bolt is drawn here with the same recipe
// (accent face, the shared face gradient, a lit upper-left bevel, a shaded lower wall) so its sharp tips stay crisp.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

const CLOUD = 'M4.89 14.97A4.5 4.5 0 0 1 6.2 6.6A6.2 6.2 0 0 1 18.1 7.1A4.25 4.25 0 0 1 19.25 15Z' // the cloud of cloud-download/upload
// the bolt outline (object units): top tip, down-left, step right, the strike tip, up-right, step left
const BOLT = [[15.25, 8.75], [8.5, 16.25], [12.25, 16.25], [10.25, 22.75], [17.25, 14], [13.75, 14]]
const RAW = {
  // the bolt also goes in as a badge so the engine fits the picture around it; its nodes are replaced below
  paths: [{ d: 'M' + BOLT.map(p => p.join(' ')).join('L') + 'Z', plate: 'S' }],
  fills: [CLOUD],
  cutouts: [],
}

function prep(icon, raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { ...icon, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(fills.map(f => f.set)) }
}
const f2 = n => String(Math.round(n * 100) / 100)
const bbox = pts => pts.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [1e9, 1e9, -1e9, -1e9])

// a closed polygon with every corner eased by a short quadratic (r = cut length along each edge, capped at 40%)
function roundD(pts, r) {
  const n = pts.length, cut = (a, b, t) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); const s = Math.min(r, l * 0.4) / l; return [a[0] + (b[0] - a[0]) * s * t, a[1] + (b[1] - a[1]) * s * t] }
  let d = ''
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const p0 = cut(p, a, 1), p1 = cut(p, b, 1)
    d += (i ? 'L' : 'M') + f2(p0[0]) + ' ' + f2(p0[1]) + 'Q' + f2(p[0]) + ' ' + f2(p[1]) + ' ' + f2(p1[0]) + ' ' + f2(p1[1])
  }
  return d + 'Z'
}

export default function render(icon) {
  const ic = prep(icon, RAW)
  let nodes = null
  for (const lite of [0, 1, 2, 3]) {
    nodes = build(ic, lite)
    if (nodes && JSON.stringify(nodes).length < 15000) break
  }
  if (!nodes) return nodes
  // recover the engine's front-camera fit from the cloud's face (its fill in c1 with the face gradient after it)
  const face = nodes.find(n => n[1] && n[1].class === 'wm-k' && /--with-soft3d-c1/.test(n[1].fill || '') && n[1]['fill-rule'] === 'evenodd')
  const fb = bbox(parsePath(face[1].d).flatMap(s => s.pts)), ob = bbox(parsePath(CLOUD).flatMap(s => s.pts))
  const k = (fb[2] - fb[0]) / (ob[2] - ob[0])
  const ox = fb[0] - ob[0] * k, oy = fb[1] - ob[1] * k
  const P = (p, z) => [p[0] * k + ox, (p[1] + z * 0.36) * k + oy]
  const grad = (nodes[0][2] || []).find(g => g[0] === 'radialGradient')
  const accent = (nodes.find(n => n[1] && /--with-soft3d-accent/.test(n[1].fill || '')) || [0, { fill: 'var(--with-soft3d-accent, #FF6A4D)' }])[1].fill
  const shine = 'var(--with-soft3d-shine, #FFFFFF)', shadow = 'var(--with-soft3d-shadow, #1D2130)'
  const out = nodes.filter(n => !(n[1] && n[1].class === 'wm-s'))
  const front = BOLT.map(p => P(p, -1.9)), back = BOLT.map(p => P(p, -0.8))
  const r = 0.55 * k, dFront = roundD(front, r), dBack = roundD(back, r)
  const sw = f2(0.45 * k)
  // the lower wall (a copy one wall-depth down, shaded), then the face, its curvature, and the bevel
  out.push(['path', { d: dBack, fill: accent, class: 'wm-a' }])
  out.push(['path', { d: dBack, fill: shadow, 'fill-opacity': 0.34, class: 'wm-a' }])
  out.push(['path', { d: dFront, fill: accent, class: 'wm-a' }])
  if (grad) out.push(['path', { d: dFront, fill: `url(#${grad[1].id})`, class: 'wm-a' }])
  // bevel: edges whose outward normal faces the upper-left light are lit, the lower-right ones fall into shade
  const n = BOLT.length, area = BOLT.reduce((s, p, i) => s + p[0] * BOLT[(i + 1) % n][1] - BOLT[(i + 1) % n][0] * p[1], 0)
  let lit = '', dark = ''
  for (let i = 0; i < n; i++) {
    const a = front[i], b = front[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    const sg = area > 0 ? 1 : -1, nx = sg * dy / l, ny = -sg * dx / l // outward normal
    const ins = 0.24 * k, t = Math.min(r * 1.1, l * 0.45) / l
    const a1 = [a[0] + dx * t - nx * ins, a[1] + dy * t - ny * ins], b1 = [b[0] - dx * t - nx * ins, b[1] - dy * t - ny * ins]
    const seg = 'M' + f2(a1[0]) + ' ' + f2(a1[1]) + 'L' + f2(b1[0]) + ' ' + f2(b1[1])
    const s = -0.55 * nx - 0.8 * ny
    if (s > 0.15) lit += seg
    else if (s < -0.15) dark += seg
  }
  if (lit) out.push(['path', { d: lit, fill: 'none', stroke: shine, 'stroke-width': sw, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }])
  if (dark) out.push(['path', { d: dark, fill: 'none', stroke: shadow, 'stroke-width': sw, 'stroke-opacity': 0.3, 'stroke-linecap': 'round', class: 'wm-a' }])
  return out
}
