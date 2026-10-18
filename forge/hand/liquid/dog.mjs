// forge/hand/liquid/dog.mjs: a clear liquid-glass dog head (the style's own optics) with two long floppy ears in
// coloured glass hanging at its sides, and deep glass eyes and a big rounded nose set into the face (the way cookie sets
// its chips), over a deep hairline mouth. The generated head grew eye and nose holes ringed by rims and fused the ears
// into the head with hairline grooves, so it read as a pale skull or a blob rather than a dog.
// Motion: the eyes and nose blink (wm-a, around 12 13.25); the ears stay with the head (wm-k).
import { parsePath } from '../../kernel/geom.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })
const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
const T = (x, y) => tf(x, y).join(' ')

// a stronger tint on the clear glass (0), a deeper coloured glass (1) and a firmer ink hairline
function tune(nodes, name, { k, a, ink }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const set = (n, ops) => {
    const g = defs.find(x => x[1].id === `wg-liquid-${name}-${n}`)
    if (g) g[2].forEach((s, i) => { if (ops[i] !== undefined) s[1]['stop-opacity'] = ops[i] })
  }
  set(0, k); set(1, a)
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = ink
  return nodes
}

// the head (K): a broad rounded muzzle-down shape
const HEAD = 'M12 4.25 C15.4 4.25 17.25 6.6 17.25 9.75 V13.75 C17.25 17.9 15.1 20.5 12 20.5 C8.9 20.5 6.75 17.9 6.75 13.75 V9.75 C6.75 6.6 8.6 4.25 12 4.25 Z'
// floppy ears (A), hanging from the crown, clear of the cheeks by a slim gap
const EAR_L = 'M8.6 4.9 C6.5 4.3 3.9 5.1 3.15 7.9 C2.6 10.2 2.65 13.2 3.65 14.6 C4.5 15.75 5.85 15.3 5.95 13.6 L6 9.6 C6.05 7.6 6.9 5.9 8.6 4.9 Z'
const EAR_R = 'M15.4 4.9 C17.5 4.3 20.1 5.1 20.85 7.9 C21.4 10.2 21.35 13.2 20.35 14.6 C19.5 15.75 18.15 15.3 18.05 13.6 L18 9.6 C17.95 7.6 17.1 5.9 15.4 4.9 Z'
// a closed seed inside each fill tells the model which plate it belongs to
const seed = (x, y) => `M${x} ${y}l0.1 0l-0.05 0.1Z`
// the mouth: a small "w" under the nose
const MOUTH = 'M10.4 17.2 Q11.3 18.15 12 17.05 Q12.7 18.15 13.6 17.2'
const NOSE_STEM = 'M12 15.6 V17.05'

export default function render(icon) {
  const name = (icon && icon.name) || 'dog'
  const nodes = build({
    name, paths: [],
    lines: [
      ...lines(seed(12, 9.5), 'K'),
      ...lines(seed(4.2, 9.5), 'A'), ...lines(seed(19.7, 9.5), 'A'),
    ],
    fills: [fill(HEAD), fill(EAR_L), fill(EAR_R)],
    cutouts: [],
  })
  if (!nodes) return null
  tune(nodes, name, { k: [0.2, 0.44, 0.7], a: [0.5, 0.9], ink: 0.42 })
  // the ears hang with the head: they are not the blinking part
  for (const n of nodes) if (n[1] && n[1].class === 'wm-a') n[1].class = 'wm-k'
  // deep glass eyes and nose, each with a pin-point glint (the blinking part, wm-a)
  const deep = { fill: col('c3'), 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-width': 0.22, class: 'wm-a' }
  const glint = { fill: col('shine'), 'fill-opacity': 0.8, class: 'wm-a' }
  for (const x of [9.7, 14.3]) {
    const [cx, cy] = tf(x, 10.9)
    nodes.push(['ellipse', { cx, cy, rx: r2(1.12 * L.SCALE), ry: r2(1.38 * L.SCALE), ...deep }])
    nodes.push(['circle', { cx: r2(cx - 0.3), cy: r2(cy - 0.42), r: 0.32, ...glint }])
  }
  // the mouth: a deep glass hairline "w" hanging from the nose
  const mp = parsePath(NOSE_STEM + MOUTH)
  const md = mp.map(s => 'M' + s.pts.map(p => T(p[0], p[1])).join('L')).join('')
  nodes.push(['path', { d: md, stroke: col('c3'), 'stroke-opacity': 0.85, 'stroke-width': 0.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  // the nose: a broad rounded triangle, point down
  nodes.push(['path', { d: `M${T(10, 13.9)}C${T(10, 13.2)} ${T(14, 13.2)} ${T(14, 13.9)}C${T(14, 14.8)} ${T(12.8, 15.9)} ${T(12, 15.9)}C${T(11.2, 15.9)} ${T(10, 14.8)} ${T(10, 13.9)}Z`, ...deep }])
  {
    const [cx, cy] = tf(11.3, 14)
    nodes.push(['ellipse', { cx, cy, rx: 0.5, ry: 0.28, ...glint }])
  }
  return nodes
}
