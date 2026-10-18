// forge/hand/clay/baby.mjs — a baby's face in clay: a round skin-tone head with two small ears, one brown curl of hair
// on the crown, two dark glossy eyes, rosy cheeks and a small dark smile. The generator painted the head in the house
// violet with the smile as a fat orange tube, so it read as a purple blob with a pacifier; skin clay (the generator's
// own "skin" family), a hair curl and an inked smile make it a baby at 16px. Head, ears, curl and eyes are the
// generator's model and light (_clay-core.mjs); cheeks and smile are laid on the face through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
// skin-family fallbacks (palettes still set the roles): skin body, brown hair, pink cheeks
const SKIN = { c1: '#F2BE96', tint: '#FFE8D8', shadow: '#5E2E1C', c2: '#6B4330', c3: '#FF7A9A', ink: '#3B2416' }
function recolor(n) {
  if (!Array.isArray(n)) return n
  const [tag, a, kids] = n, b = {}
  for (const k in a) b[k] = typeof a[k] === 'string' ? a[k].replace(/var\(--with-clay-(c1|c2|c3|tint|shadow|ink), #[0-9A-Fa-f]+\)/g, (m, r) => `var(--with-clay-${r}, ${SKIN[r]})`) : a[k]
  return kids ? [tag, b, kids.map(recolor)] : [tag, b]
}
const r2 = n => Math.round(n * 100) / 100
const s = K.SCALE
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]

const HEAD = 'M20 13A8 8 0 1 1 4 13A8 8 0 1 1 20 13Z'
const EAR_L = 'M4.6 11.1A2 2 0 0 0 4.6 14.9Z'
const EAR_R = 'M19.4 11.1A2 2 0 0 1 19.4 14.9Z'
// the curl: a hair tube sitting on the crown (skeleton coordinates, mapped below)
const CURL = [[11.4, 5.4], [13.6, 4.6], [14.5, 7.1], [12.6, 8.1], [11.2, 7.5], [11.6, 6.6]]
const EYES = ['M10.1 12.6A1.1 1.1 0 1 1 7.9 12.6A1.1 1.1 0 1 1 10.1 12.6Z', 'M16.1 12.6A1.1 1.1 0 1 1 13.9 12.6A1.1 1.1 0 1 1 16.1 12.6Z']

export default function render(icon) {
  const name = (icon && icon.name) || 'baby'
  const nodes = (build(skeleton(name, [
    { d: HEAD, plate: 'K', fill: true },
    { d: EAR_L, plate: 'K', fill: true },
    { d: EAR_R, plate: 'K', fill: true },
  ], EYES)) || []).map(recolor)
  // the curl of hair: a soft shade under it, the brown tube, a lit stripe along its top
  const [p0, c1a, c1b, p1, c2a, p2] = CURL.map(p => tf(...p).join(' '))
  const curl = `M${p0}C${c1a} ${c1b} ${p1}S${c2a} ${p2}`
  const sh = d => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${r2(+x + 0.12)} ${r2(+y + 0.3)}`)
  const round = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }
  nodes.push(['path', { d: sh(curl), stroke: `var(--with-clay-shadow, ${SKIN.shadow})`, 'stroke-opacity': 0.3, 'stroke-width': 1.25, ...round, class: 'wm-a' }])
  nodes.push(['path', { d: curl, stroke: `var(--with-clay-c2, ${SKIN.c2})`, 'stroke-width': 1.3, ...round, class: 'wm-a' }])
  nodes.push(['path', { d: curl, stroke: 'var(--with-clay-shine, #FFFFFF)', 'stroke-opacity': 0.35, 'stroke-width': 0.35, ...round, class: 'wm-shine' }])
  // rosy cheeks, then a small inked smile with a lit lip below it (pressed in)
  for (const x of [7.4, 16.6]) {
    const [cx, cy] = tf(x, 15.1)
    nodes.push(['path', { d: ellD(cx, cy, 1.15, 0.72), fill: `var(--with-clay-c3, ${SKIN.c3})`, 'fill-opacity': 0.42, class: 'wm-k' }])
  }
  const [ax, ay] = tf(10.1, 16), [bx, by] = tf(13.9, 16), rr = r2(2.3 * s)
  const smile = `M${ax} ${ay}A${rr} ${rr} 0 0 0 ${bx} ${by}`
  const lip = `M${ax} ${r2(ay + 0.22)}A${rr} ${rr} 0 0 0 ${bx} ${r2(by + 0.22)}`
  nodes.push(['path', { d: lip, stroke: 'var(--with-clay-shine, #FFFFFF)', 'stroke-opacity': 0.5, 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  nodes.push(['path', { d: smile, stroke: `var(--with-clay-ink, ${SKIN.ink})`, 'stroke-width': 0.95, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  return nodes
}
