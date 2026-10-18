// forge/hand/soft3d/haunted-house.mjs — a steep-roofed house with a big arched door, one round attic window and a small crescent moon kept clear of the roof, replacing the generated house whose moon and window ring cluttered the roof
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

function prep(icon, raw) {
  const paths = raw.paths.map((p, i) => ({ id: 'h' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { ...icon, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [] }
}
function draw(icon, raw, recolor = {}, swapA = {}) {
  const ic = prep(icon, raw)
  let nodes = null
  for (const lite of [0, 1, 2, 3]) {
    nodes = build(ic, lite)
    if (nodes && nodes.length > 1 && JSON.stringify(nodes).length < 18500) break
  }
  if (!nodes || nodes.length < 2) return null
  const re = /--with-soft3d-([a-z0-9]+), (#[0-9A-Fa-f]{6})/g
  const fix = (v, a) => {
    if (typeof v !== 'string') return v
    if (a.class === 'wm-a') v = v.replace(re, (m, r) => swapA[r] ? `--with-soft3d-${swapA[r][0]}, ${swapA[r][1]}` : m)
    return v.replace(re, (m, r) => recolor[r] ? `--with-soft3d-${r}, ${recolor[r]}` : m)
  }
  const walk = n => [n[0], Object.fromEntries(Object.entries(n[1]).map(([k, v]) => [k, fix(v, n[1])])), ...(n[2] ? [n[2].map(walk)] : [])]
  return nodes.map(walk)
}


const RAW = {
  "paths": [
    {
      "d": "M3 11.5 L11 4 L20 11.5",
      "plate": "K"
    },
    {
      "d": "M5 9.5 V19.5 A1.5 1.5 0 0 0 6.5 21 H16 A1.5 1.5 0 0 0 17.5 19.5 V9.5",
      "plate": "K"
    },
    {
      "d": "M9 21 V17 C9 15.5 10 14.5 11.25 14 C12.5 14.5 13.5 15.5 13.5 17 V21",
      "plate": "A"
    },
    {
      "d": "M12.4 9.25 A1.15 1.15 0 1 1 10.1 9.25 A1.15 1.15 0 1 1 12.4 9.25 Z",
      "plate": "A"
    }
  ],
  "fills": [
    "M5 9.3 L11 4.4 L17.5 9.6 V19.5 A1.5 1.5 0 0 1 16 21 H6.5 A1.5 1.5 0 0 1 5 19.5 Z"
  ],
  "cutouts": [
    "M9 21 V17 C9 15.5 10 14.5 11.25 14 C12.5 14.5 13.5 15.5 13.5 17 V21 Z",
    "M12.4 9.25 A1.15 1.15 0 1 1 10.1 9.25 A1.15 1.15 0 1 1 12.4 9.25 Z"
  ]
}
// the moon: a small flat crescent off the top-left corner, drawn apart from the house so it never fuses with the roof
const MOON = 'M4.42 1.75 A2 2 0 1 0 6.41 4.34 A1.65 1.65 0 0 1 4.42 1.75 Z'
const MOON_BACK = 'M4.77 2.1 A2 2 0 1 0 6.76 4.69 A1.65 1.65 0 0 1 4.77 2.1 Z'
const MOONC = 'var(--with-soft3d-accent, #F2C94C)'
function finish(nodes) {
  if (!nodes) return nodes
  const gid = nodes[0] && nodes[0][0] === 'defs' && nodes[0][2] && nodes[0][2][0] ? nodes[0][2][0][1].id : null
  const moon = [
    ['path', { d: MOON_BACK, fill: MOONC, class: 'wm-s' }],
    ['path', { d: MOON_BACK, fill: 'var(--with-soft3d-shadow, #17131F)', 'fill-opacity': 0.35, class: 'wm-s' }],
    ['path', { d: MOON, fill: MOONC, class: 'wm-s' }],
    ...(gid ? [['path', { d: MOON, fill: `url(#${gid})`, class: 'wm-s' }]] : []),
    ['path', { d: 'M3.4 2.3 A2 2 0 0 0 3.1 5.1', fill: 'none', stroke: 'var(--with-soft3d-shine, #FFFFFF)', 'stroke-width': 0.4, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
  return [...nodes, ...moon]
}

export default function render(icon) {
  const nodes = draw(icon, RAW, {"c1":"#C9BEDD","c2":"#4A3F5E","c3":"#F2C94C","accent":"#F2C94C"})
  return finish(nodes)
}
