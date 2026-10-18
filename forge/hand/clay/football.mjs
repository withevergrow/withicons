// forge/hand/clay/football.mjs — a classic soccer ball in clay: one plump cream ball (the clay "cream" family, like
// spider-web and ghost) with a dark centre pentagon, five dark edge panels running off the rim and thin seams joining
// them. The generator turned the panels into fat yellow pills on an orange ball, so at 16px it read as a star or a
// flower; dark panels on a pale ball read as a football at any size. The ball is the generator's own model and light
// (_clay-core.mjs); the panels and seams are laid on its face through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
// cream-family fallbacks for the ball (palettes still set the roles)
const CREAM = { c1: '#F4EEFF', tint: '#FFFFFF', shadow: '#3B2E6E' }
function recolor(n) {
  if (!Array.isArray(n)) return n
  const [tag, a, kids] = n, b = {}
  for (const k in a) b[k] = typeof a[k] === 'string' ? a[k].replace(/var\(--with-clay-(c1|tint|shadow), #[0-9A-Fa-f]+\)/g, (m, r) => `var(--with-clay-${r}, ${CREAM[r]})`) : a[k]
  return kids ? [tag, b, kids.map(recolor)] : [tag, b]
}
const r2 = n => Math.round(n * 100) / 100
const s = K.SCALE
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]
// absolute M L A Z path through the model's transform
function tp(d) {
  const t = d.match(/[MLAZ]|-?\d*\.?\d+/g), out = []
  let i = 0
  while (i < t.length) {
    const c = t[i++]
    if (c === 'Z') { out.push('Z'); continue }
    if (c === 'M' || c === 'L') { const [x, y] = tf(+t[i], +t[i + 1]); i += 2; out.push(`${c}${x} ${y}`); continue }
    if (c === 'A') {
      const [rx, ry, rot, la, sw, x0, y0] = t.slice(i, i + 7).map(Number); i += 7
      const [x, y] = tf(x0, y0); out.push(`A${r2(rx * s)} ${r2(ry * s)} ${rot} ${la} ${sw} ${x} ${y}`)
    }
  }
  return out.join('')
}
const BALL = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
const PENT = 'M12 8.3L15.52 10.86L14.18 15L9.82 15L8.48 10.86Z'
const EDGES = 'M7.84 3.46L9.18 4.25L12 5L14.82 4.25L16.16 3.46A9.5 9.5 0 0 0 7.84 3.46Z' +
  'M18.83 5.4L18.5 6.92L18.66 9.84L20.24 12.29L21.41 13.32A9.5 9.5 0 0 0 18.83 5.4Z' +
  'M20.39 16.46L18.84 16.61L16.11 17.66L14.27 19.93L13.65 21.36A9.5 9.5 0 0 0 20.39 16.46Z' +
  'M10.35 21.36L9.73 19.93L7.89 17.66L5.16 16.61L3.61 16.46A9.5 9.5 0 0 0 10.35 21.36Z' +
  'M2.59 13.32L3.76 12.29L5.34 9.84L5.5 6.92L5.17 5.4A9.5 9.5 0 0 0 2.59 13.32Z'
const SEAMS = 'M12 8.3L12 5M15.52 10.86L18.66 9.84M14.18 15L16.11 17.66M9.82 15L7.89 17.66M8.48 10.86L5.34 9.84'

export default function render(icon) {
  const name = (icon && icon.name) || 'football'
  const nodes = (build(skeleton(name, [{ d: BALL, plate: 'K', fill: true }])) || []).map(recolor)
  const ink = 'var(--with-clay-ink, #2A1D5C)', shine = 'var(--with-clay-shine, #FFFFFF)'
  const sh = d => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + 0.12)} ${r2(+y + 0.18)}`)
  const pent = tp(PENT), edges = tp(EDGES)
  // seams, then panels pressed into the face: a soft shade below each, the dark panel, a lit top edge
  nodes.push(['path', { d: tp(SEAMS), stroke: ink, 'stroke-opacity': 0.55, 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  nodes.push(['path', { d: sh(pent), fill: 'var(--with-clay-shadow, #3B2E6E)', 'fill-opacity': 0.25, class: 'wm-k' }])
  nodes.push(['path', { d: pent + edges, fill: ink, 'fill-opacity': 0.88, 'stroke-linejoin': 'round', class: 'wm-k' }])
  nodes.push(['path', { d: pent, fill: 'none', stroke: shine, 'stroke-opacity': 0.28, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-shine' }])
  nodes.push(['path', { d: 'M10.6 8.6A0.5 0.3 -36 1 0 11.4 8.02A0.5 0.3 -36 1 0 10.6 8.6Z', fill: shine, 'fill-opacity': 0.55, class: 'wm-shine' }])
  return nodes
}
