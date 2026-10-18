// forge/hand/clay/scan-face.mjs: four teal clay scan corners round a plump orange clay face with two dark glossy eyes,
// a small inked smile (a lit lip below it, pressed in) and rosy cheeks. The generated drawing lost the eyes and smile
// (with no body fill the skeleton's cutouts never became pits), so the sphere read as a bare orange ball. Corners and
// sphere are the generator's model and light (_clay-core.mjs); the face is laid on through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const s = K.SCALE
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]

const CORNERS = [
  'M3 7.5V5A2 2 0 0 1 5 3H7.5',
  'M16.5 3H19A2 2 0 0 1 21 5V7.5',
  'M21 16.5V19A2 2 0 0 1 19 21H16.5',
  'M7.5 21H5A2 2 0 0 1 3 19V16.5',
]
const FACE = 'M18.6 12A6.6 6.6 0 1 1 5.4 12A6.6 6.6 0 1 1 18.6 12Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'scan-face'
  const nodes = build(skeleton(name, [
    ...CORNERS.map(d => ({ d, plate: 'K' })),
    { d: FACE, plate: 'A', fill: true },
  ])) || []
  const INK = 'var(--with-clay-ink, #2A1D5C)', SH = 'var(--with-clay-shadow, #24166B)', SN = 'var(--with-clay-shine, #FFFFFF)', C3 = 'var(--with-clay-c3, #FF5C97)'
  // rosy cheeks
  for (const x of [7.6, 16.4]) {
    const [cx, cy] = tf(x, 14.1)
    nodes.push(['path', { d: ellD(cx, cy, 1.0, 0.62), fill: C3, 'fill-opacity': 0.4, class: 'wm-a' }])
  }
  // two glossy pits for eyes, each with a lit lip below and a tiny catch-light
  for (const x of [9.2, 14.8]) {
    const [cx, cy] = tf(x, 10.3)
    nodes.push(['path', { d: ellD(cx, cy + 0.2, 0.74, 1.08), fill: SN, 'fill-opacity': 0.45, class: 'wm-shine' }])
    nodes.push(['path', { d: ellD(cx, cy, 0.72, 1.06), fill: INK, class: 'wm-a' }])
    nodes.push(['path', { d: ellD(cx - 0.2, cy - 0.38, 0.22, 0.22), fill: SN, 'fill-opacity': 0.92, class: 'wm-shine' }])
  }
  // smile
  const [ax, ay] = tf(9.3, 14.4), [bx, by] = tf(14.7, 14.4), rr = r2(3.4 * s)
  nodes.push(['path', { d: `M${ax} ${r2(ay + 0.24)}A${rr} ${rr} 0 0 0 ${bx} ${r2(by + 0.24)}`, stroke: SN, 'stroke-opacity': 0.5, 'stroke-width': 0.95, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  nodes.push(['path', { d: `M${ax} ${ay}A${rr} ${rr} 0 0 0 ${bx} ${by}`, stroke: INK, 'stroke-width': 1.0, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  void SH
  return nodes
}
