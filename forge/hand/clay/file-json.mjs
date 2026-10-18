// forge/hand/clay/file-json.mjs: a plump violet clay document with a folded corner flap and a thin { } glyph printed on
// the face in dark ink (each brace with a lit lip below it, pressed in). The generated braces were two fat orange tubes
// that read as beans; the thin glyph keeps the line design's braces and stays legible at 24px against the violet. Page
// and flap are the generator's model and light (_clay-core.mjs); the braces are laid on through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const s = K.SCALE
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FLAP = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19Z'
// the braces, skeleton coordinates: absolute M / L / C / Q only
const BRACE_L = [['M', 10.9, 10.4], ['Q', 9.7, 10.4, 9.7, 11.7], ['L', 9.7, 13.1], ['Q', 9.7, 14.3, 8.4, 14.5], ['Q', 9.7, 14.7, 9.7, 15.9], ['L', 9.7, 17.3], ['Q', 9.7, 18.6, 10.9, 18.6]]
const BRACE_R = [['M', 13.1, 10.4], ['Q', 14.3, 10.4, 14.3, 11.7], ['L', 14.3, 13.1], ['Q', 14.3, 14.3, 15.6, 14.5], ['Q', 14.3, 14.7, 14.3, 15.9], ['L', 14.3, 17.3], ['Q', 14.3, 18.6, 13.1, 18.6]]
const D = (seg, dx = 0, dy = 0) => seg.map(([c, ...n]) => {
  const out = []
  for (let i = 0; i < n.length; i += 2) out.push(tf(n[i], n[i + 1]).map((v, k) => r2(v + (k ? dy : dx))).join(' '))
  return c + out.join(' ')
}).join('')

export default function render(icon) {
  const name = (icon && icon.name) || 'file-json'
  const nodes = build(skeleton(name, [
    { d: PAGE, plate: 'K', fill: true },
    { d: FLAP, plate: 'A', fill: true },
  ])) || []
  const round = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }
  for (const b of [BRACE_L, BRACE_R]) {
    nodes.push(['path', { d: D(b, 0.08, 0.24), stroke: 'var(--with-clay-shine, #FFFFFF)', 'stroke-opacity': 0.5, 'stroke-width': 1.25, ...round, class: 'wm-shine' }])
    nodes.push(['path', { d: D(b), stroke: 'var(--with-clay-ink, #2A1D5C)', 'stroke-width': 1.3, ...round, class: 'wm-k' }])
  }
  return nodes
}
