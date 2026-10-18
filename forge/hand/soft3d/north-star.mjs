// forge/hand/soft3d/north-star.mjs — the four-point north star as one bevelled gold sparkle with four small gold glints, replacing the generated star whose centre cut read as a hole and whose glints were loud red pills
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

// recolour by role (node classes kept): map[cls] = { fromRole: toRole }; fallback hexes follow the new role
function remap(nodes, map) {
  if (!nodes) return nodes
  const walk = n => {
    const m = map[(n[1] && n[1].class) || ''] || map['*']
    const a = !m ? n[1] : Object.fromEntries(Object.entries(n[1]).map(([k, v]) => [k, typeof v !== 'string' ? v
      : v.replace(/var\(--with-soft3d-([a-z0-9]+), (#[0-9A-Fa-f]{6})\)/g, (s, r) => m[r] ? `var(--with-soft3d-${m[r][0]}, ${m[r][1]})` : s)]))
    return [n[0], a, ...(n[2] ? [n[2].map(walk)] : [])]
  }
  return nodes.map(walk)
}

const RAW = {
  "paths": [
    {
      "d": "M12 2.5 Q13 10 19 11 Q13 12 12 21 Q11 12 5 11 Q11 10 12 2.5 Z",
      "plate": "K"
    },
    {
      "d": "M16.1 6.4 L16.7 5.8",
      "plate": "A"
    },
    {
      "d": "M7.9 6.4 L7.3 5.8",
      "plate": "A"
    },
    {
      "d": "M16.1 15.6 L16.7 16.2",
      "plate": "A"
    },
    {
      "d": "M7.9 15.6 L7.3 16.2",
      "plate": "A"
    }
  ],
  "fills": [
    "M12 2.5 Q13 10 19 11 Q13 12 12 21 Q11 12 5 11 Q11 10 12 2.5 Z"
  ],
  "cutouts": []
}
const MAP = {"wm-a":{"c2":["c1","#F7C531"]}}

export default function render(icon) {
  const nodes = draw(icon, RAW)
  return remap(nodes, MAP)
}
