// forge/hand/liquid/circle-chevron-down.mjs: a clear glass disc with a coloured glass chevron tube laid in it. The generated
// chevron was an A inlay inside a moat, so the moat ring and the tube merged into a blobby heart with no separation from the
// disc. The disc is the generator's K glass (build); the chevron is drawn as a four-layer glass tube (shadow, deep refraction
// edge, c2 body, specular line) at the weight of the sibling chevrons, so it stays a crisp V at 16px. wm-a part.
import { parsePath } from '../../kernel/geom.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

const r2 = n => Math.round(n * 100) / 100
const tf = ([x, y]) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
const DISC = 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z'
const V = [[7.6, 9.9], [12, 14.3], [16.4, 9.9]]
const pd = (pts, dx = 0, dy = 0) => pts.map((p, i) => { const q = tf(p); return `${i ? 'L' : 'M'}${r2(q[0] + dx)} ${r2(q[1] + dy)}` }).join('')

export default function render(icon) {
  const name = (icon && icon.name) || 'circle-chevron-down'
  const nodes = build({ name, paths: [], lines: [], fills: [{ subs: parsePath(DISC) }], cutouts: [] }) || []
  const C2 = 'var(--with-liquid-c2, #A77BFF)', C3 = 'var(--with-liquid-c3, #1C3F9E)', C4 = 'var(--with-liquid-c4, #FF7EC1)', SH = 'var(--with-liquid-shine, #FFFFFF)', EDGE = 'var(--with-liquid-edge, #B9E6FF)'
  const round = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  // cast shadow, warmed by the caustic
  nodes.push(['path', { d: pd(V, 0.3, 0.6), stroke: C4, 'stroke-opacity': 0.3, 'stroke-width': 2.6, ...round }])
  // deep refraction edge, then the coloured body inside it
  nodes.push(['path', { d: pd(V), stroke: C3, 'stroke-opacity': 0.92, 'stroke-width': 2.5, ...round }])
  nodes.push(['path', { d: pd(V), stroke: C2, 'stroke-opacity': 0.85, 'stroke-width': 1.6, ...round }])
  // inner rim light at the bottom-right, specular line at the top-left
  nodes.push(['path', { d: pd(V, 0.28, 0.28), stroke: EDGE, 'stroke-opacity': 0.7, 'stroke-width': 0.4, ...round, class: 'wm-shine' }])
  nodes.push(['path', { d: pd(V, -0.3, -0.34), stroke: SH, 'stroke-opacity': 0.9, 'stroke-width': 0.5, ...round, class: 'wm-shine' }])
  return nodes
}
