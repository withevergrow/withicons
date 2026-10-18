// forge/hand/liquid/cat.mjs: a front-facing cat head of clear liquid glass with two sharp, separate ears (pink glass inside),
// two tall deep-glass eyes with glints set wide apart, a small pink nose and a hairline "w" mouth. The old drawing ringed the
// eyes and nose into one cluster, so it read as an owl or a mask; here the eyes and nose are solid, well separated shapes.
// Motion: the eyes, nose and mouth blink (wm-a); the head and ears stay (wm-k).
import { parsePath } from '../../kernel/geom.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })
const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
const T = (x, y) => tf(x, y).join(' ')

function tune(nodes, name, { k, ink }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const g = defs.find(x => x[1].id === `wg-liquid-${name}-0`)
  if (g) g[2].forEach((s, i) => { if (k[i] !== undefined) s[1]['stop-opacity'] = k[i] })
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = ink
  return nodes
}

const HEAD = 'M12 20.5C6.9 20.5 3.4 17.9 3.4 13.8C3.4 11.9 3.8 10.4 4.3 9.2L3.9 2.8L9.6 6.3C10.4 6.1 11.2 6 12 6C12.8 6 13.6 6.1 14.4 6.3L20.1 2.8L19.7 9.2C20.2 10.4 20.6 11.9 20.6 13.8C20.6 17.9 17.1 20.5 12 20.5Z'
const seed = (x, y) => `M${x} ${y}l0.1 0l-0.05 0.1Z`
const EAR_L = [[4.9, 5.2], [8.1, 7.1], [5.4, 8.6]]
const EAR_R = [[19.1, 5.2], [15.9, 7.1], [18.6, 8.6]]
const tri = pts => `M${pts.map(p => T(p[0], p[1])).join('L')}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'cat'
  const nodes = build({
    name, paths: [],
    lines: [...lines(seed(12, 12), 'K')],
    fills: [fill(HEAD)],
    cutouts: [],
  })
  if (!nodes) return null
  tune(nodes, name, { k: [0.2, 0.44, 0.7], ink: 0.42 })
  // pink inner ears
  for (const e of [EAR_L, EAR_R]) nodes.push(['path', { d: tri(e), fill: col('c4'), 'fill-opacity': 0.55, class: 'wm-k' }])
  const deep = { fill: col('c3'), 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-width': 0.22, class: 'wm-a' }
  const glint = { fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-a' }
  // wide-set tall eyes
  for (const x of [8.1, 15.9]) {
    const [cx, cy] = tf(x, 12.2)
    nodes.push(['ellipse', { cx, cy, rx: r2(1.2 * L.SCALE), ry: r2(1.7 * L.SCALE), ...deep }])
    nodes.push(['circle', { cx: r2(cx - 0.32), cy: r2(cy - 0.55), r: 0.34, ...glint }])
  }
  // mouth
  const md = `M${T(10.5, 16.9)}Q${T(11.3, 17.9)} ${T(12, 16.7)}Q${T(12.7, 17.9)} ${T(13.5, 16.9)}`
  nodes.push(['path', { d: md, fill: 'none', stroke: col('c3'), 'stroke-opacity': 0.8, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  // small pink nose
  nodes.push(['path', { d: `M${T(10.9, 14.8)}C${T(10.9, 14.5)} ${T(13.1, 14.5)} ${T(13.1, 14.8)}C${T(13.1, 15.4)} ${T(12.4, 16.2)} ${T(12, 16.2)}C${T(11.6, 16.2)} ${T(10.9, 15.4)} ${T(10.9, 14.8)}Z`, fill: col('accent'), 'fill-opacity': 0.95, stroke: 'currentColor', 'stroke-opacity': 0.45, 'stroke-width': 0.2, class: 'wm-a' }])
  return nodes
}
