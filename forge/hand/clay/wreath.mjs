// forge/hand/clay/wreath.mjs — a plump green clay wreath: a ring with a big round open hole and a bumpy, scalloped rim
// of foliage lobes, three gold berries pressed on it, and a pink candy bow at the bottom (two loops, a centre knot and
// two short tails). The generator filled the hole to a small dimple and made the bow a yellow lump that read as a lip on a
// face; here the hole is wide and clear and the bow has its own silhouette. Same model, light and colour as the
// generator (_clay-core.mjs); the berries' shading is added here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const CX = 12, CY = 9.4, N = 12
// the foliage rim: twelve rounded lobes, the radius swelling and dipping between them
const wavy = (r0, amp, n, rot = 0, steps = 96) => {
  let d = ''
  for (let i = 0; i < steps; i++) {
    const t = i / steps * Math.PI * 2, r = r0 + amp * Math.cos(n * t + rot)
    d += (i ? 'L' : 'M') + r2(CX + r * Math.cos(t)) + ' ' + r2(CY + r * Math.sin(t))
  }
  return d + 'Z'
}
const circ = (x, y, r) => `M${r2(x - r)} ${r2(y)}A${r} ${r} 0 1 0 ${r2(x + r)} ${r2(y)}A${r} ${r} 0 1 0 ${r2(x - r)} ${r2(y)}Z`
const RING = wavy(7.9, 0.6, N) + circ(CX, CY, 5)
const MID = circ(CX, CY, 6.7)
// the bow
const LOOP_L = 'M11 18.9C9.6 17.9 7.8 17 6.5 17.3C5.9 18.3 5.9 19.5 6.5 20.5C7.8 20.8 9.6 19.9 11 18.9Z'
const LOOP_R = 'M13 18.9C14.4 17.9 16.2 17 17.5 17.3C18.1 18.3 18.1 19.5 17.5 20.5C16.2 20.8 14.4 19.9 13 18.9Z'
const KNOT = circ(12, 18.9, 0.6)
const BERRIES = [[6.9, 5.1], [17.1, 5.5], [18.2, 11.4]]

export default function render(icon) {
  const name = (icon && icon.name) || 'wreath'
  const sk = skeleton(name, [
    { d: RING, plate: 'K', fill: true },
    { d: MID, plate: 'K' },
    { d: LOOP_L, plate: 'S', fill: true },
    { d: LOOP_R, plate: 'S', fill: true },
    { d: KNOT, plate: 'S', fill: true },
  ])
  const nodes = build(sk)
  if (!nodes) return nodes
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  // berries: gold clay balls with a lit side and a small cast shadow on the ring
  const defs = nodes[0][0] === 'defs' ? nodes[0][2] : null
  const gid = 'wg-clay-' + name + '-90'
  if (defs) defs.push(['radialGradient', { id: gid, cx: 0.35, cy: 0.3, r: 0.8 }, [
    ['stop', { offset: '0', 'stop-color': col('shine'), 'stop-opacity': '0.55' }],
    ['stop', { offset: '0.45', 'stop-color': col('shine'), 'stop-opacity': '0' }],
    ['stop', { offset: '1', 'stop-color': col('shadow'), 'stop-opacity': '0.4' }]]])
  for (const [x, y] of BERRIES) {
    const [bx, by] = tf(x, y)
    nodes.push(['path', { d: ellD(bx + 0.18, by + 0.3, 1.05, 1.05), fill: col('shadow'), 'fill-opacity': 0.35, class: 'wm-a' }])
    nodes.push(['path', { d: ellD(bx, by, 1.05, 1.05), fill: col('c2'), class: 'wm-a' }])
    nodes.push(['path', { d: ellD(bx, by, 1.05, 1.05), fill: `url(#${gid})`, class: 'wm-a' }])
    nodes.push(['path', { d: ellD(bx - 0.3, by - 0.35, 0.3, 0.2, -40), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  }
  // the bow's knot: a small round band over the two loops, and a fold line running out along each loop
  const [kx, ky] = tf(12, 18.9)
  for (const sg of [-1, 1]) nodes.push(['path', { d: `M${r2(kx + sg * 1.1)} ${r2(ky - 0.05)}L${r2(kx + sg * 3.4)} ${r2(ky - 0.45)}`, fill: 'none', stroke: col('shadow'), 'stroke-opacity': 0.4, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-s' }])
  nodes.push(['path', { d: ellD(kx + 0.12, ky + 0.2, 1.05, 1.2), fill: col('shadow'), 'fill-opacity': 0.45, class: 'wm-s' }])
  nodes.push(['path', { d: ellD(kx, ky, 1.05, 1.2), fill: col('c3'), class: 'wm-s' }])
  nodes.push(['path', { d: ellD(kx, ky, 1.05, 1.2), fill: `url(#${gid})`, class: 'wm-s' }])
  nodes.push(['path', { d: ellD(kx - 0.3, ky - 0.4, 0.28, 0.2, -40), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  return nodes
}
