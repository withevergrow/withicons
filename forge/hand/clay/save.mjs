// forge/hand/clay/save.mjs — a violet clay floppy disk: a plump square with the top-right corner cut away, a pale metal
// shutter near the top edge (with its small dark slot) and a pale label panel low on the face, both pressed into the clay.
// The generated disk drew the shutter and label as fat orange tubes that fused into a chair or a face and lost the corner
// notch. Same model and light as the generator (_clay-core.mjs); only the geometry (and the pale shutter / label panels,
// laid on through the model's own transform) is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100

const BODY = 'M5 3H16L21 8V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
// shutter and label: closed cutouts become recessed panels
const SHUTTER = 'M7.6 4.5H14.4V8.2Q14.4 8.8 13.8 8.8H8.2Q7.6 8.8 7.6 8.2Z'
const LABEL = 'M6.4 13.4Q6.4 12.8 7 12.8H17Q17.6 12.8 17.6 13.4V19.2Q17.6 19.6 17.2 19.6H6.8Q6.4 19.6 6.4 19.2Z'
const SHUTTER_PANE = 'M8 4.9H14V8.1Q14 8.4 13.7 8.4H8.3Q8 8.4 8 8.1Z'
const SLOT = 'M11.6 5.6Q11.6 5.4 11.8 5.4H12.6Q12.8 5.4 12.8 5.6V7.4Q12.8 7.6 12.6 7.6H11.8Q11.6 7.6 11.6 7.4Z'
const LABEL_PANE = 'M6.8 13.2H17.2V19.2H6.8Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'save'
  const sk = skeleton(name, [{ d: BODY, plate: 'K', fill: true }], [SHUTTER, LABEL])
  const nodes = build(sk)
  if (!nodes) return nodes
  // the face is a big flat plate, so reach the body colour sooner (the house ramp washes it out to pastel)
  for (const g of nodes[0][0] === 'defs' ? nodes[0][2] : []) {
    const st = g[2]
    if (g[0] === 'radialGradient' && st.length === 3 && /clay-tint/.test(st[0][1]['stop-color']) && /clay-c1/.test(st[1][1]['stop-color'])) st[1][1].offset = 0.3
  }
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  const tfd = d => d.replace(/([MHVLQAZ])([^MHVLQAZ]*)/g, (m, c, rest) => {
    const n = rest.trim().split(/[\s,]+/).filter(Boolean).map(Number)
    return { M: () => 'M' + tf(n[0], n[1]).join(' '), L: () => 'L' + tf(n[0], n[1]).join(' '), Z: () => 'Z' }[c]?.() || m
  })
  // plain polygon helper (skeleton coords -> output)
  const P = pts => 'M' + pts.map(p => tf(...p).join(' ')).join('L') + 'Z'
  const rr = (x0, y0, x1, y1, r) => {
    const a = [], seg = (cx, cy, s) => { for (let k = 0; k <= 4; k++) { const t = s + (k * Math.PI) / 8; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]) } }
    seg(x1 - r, y0 + r, -Math.PI / 2); seg(x1 - r, y1 - r, 0); seg(x0 + r, y1 - r, Math.PI / 2); seg(x0 + r, y0 + r, Math.PI)
    return a
  }
  void tfd
  // shutter: pale metal with a dark slot; label: pale paper with two faint ruled lines
  nodes.push(['path', { d: P(rr(8, 4.95, 14, 8.35, 0.35)), fill: col('tint'), 'fill-opacity': 0.95, class: 'wm-k' }])
  nodes.push(['path', { d: P(rr(11.55, 5.5, 12.85, 7.7, 0.3)), fill: col('shadow'), 'fill-opacity': 0.55, class: 'wm-k' }])
  nodes.push(['path', { d: P(rr(8.4, 5.1, 10.4, 5.45, 0.17)), fill: col('shine'), 'fill-opacity': 0.8, class: 'wm-shine' }])
  nodes.push(['path', { d: P(rr(6.8, 13.2, 17.2, 19.2, 0.35)), fill: col('tint'), 'fill-opacity': 0.95, class: 'wm-a' }])
  for (const y of [15.2, 17.2]) {
    const [x0, yy] = tf(8.4, y), [x1] = tf(15.6, y)
    nodes.push(['path', { d: `M${x0} ${yy}H${x1}`, stroke: col('c1'), 'stroke-opacity': 0.5, 'stroke-width': 0.55, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  }
  return nodes
}
