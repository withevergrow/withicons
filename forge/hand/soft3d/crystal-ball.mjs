// forge/hand/soft3d/crystal-ball.mjs — a round glass orb with a glint and an inner sparkle seated in a flared wooden stand, replacing the generated tilted disc on sticks that read as a clock or a sign
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
      "d": "M18.25 8.75 A6.25 6.25 0 1 1 5.75 8.75 A6.25 6.25 0 1 1 18.25 8.75 Z",
      "plate": "K"
    },
    {
      "d": "M12 5.5 C12.35 7.6 13 8.25 15 8.6 C13 8.95 12.35 9.6 12 11.7 C11.65 9.6 11 8.95 9 8.6 C11 8.25 11.65 7.6 12 5.5 Z",
      "plate": "S"
    }
  ],
  "fills": [
    "M18.25 8.75 A6.25 6.25 0 1 1 5.75 8.75 A6.25 6.25 0 1 1 18.25 8.75 Z"
  ],
  "cutouts": []
}
// the stand: a flared wooden base behind the orb and a collar band in front of its foot, shaded like a turned cylinder
const WOOD = 'var(--with-soft3d-c2, #B8763E)'
const SHADE = 'var(--with-soft3d-shadow, #1D2130)'
const SHINE = 'var(--with-soft3d-shine, #FFFFFF)'
const BASE = 'M8.6 15.6 L6.6 19.6 H17.4 L15.4 15.6 Z'
const FOOT = 'M5.5 19.4 H18.5 V20.3 Q18.5 21.2 17.6 21.2 H6.4 Q5.5 21.2 5.5 20.3 Z'
const COLLAR = 'M7.1 15 A4.9 1.2 0 0 0 16.9 15 V16.6 A4.9 1.2 0 0 1 7.1 16.6 Z'
const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`
function finish(nodes) {
  if (!nodes) return nodes
  let defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0] : null
  const kids = defs ? [...(defs[2] || [])] : []
  const gid = `wg-soft3d-crystal-ball-${kids.length}`
  kids.push(['linearGradient', { id: gid, x1: '0', y1: '0', x2: '1', y2: '0' }, [
    ['stop', { offset: '0', 'stop-color': SHADE, 'stop-opacity': '0.18' }],
    ['stop', { offset: '0.28', 'stop-color': SHINE, 'stop-opacity': '0.4' }],
    ['stop', { offset: '0.5', 'stop-color': SHINE, 'stop-opacity': '0' }],
    ['stop', { offset: '1', 'stop-color': SHADE, 'stop-opacity': '0.38' }],
  ]])
  const rest = nodes.filter(n => n !== defs && !(n[1] && n[1].class === 'wm-shadow'))
  const shadow = [[9, 1.8, 0.06], [7.2, 1.45, 0.08], [5.2, 1.05, 0.11]].map(([rx, ry, o]) =>
    ['path', { d: ell(12, 21, rx, ry), fill: SHADE, 'fill-opacity': o, class: 'wm-shadow' }])
  const base = [
    ['path', { d: BASE, fill: WOOD, class: 'wm-k' }],
    ['path', { d: BASE, fill: `url(#${gid})`, class: 'wm-k' }],
    ['path', { d: FOOT, fill: WOOD, class: 'wm-k' }],
    ['path', { d: FOOT, fill: SHADE, 'fill-opacity': 0.14, class: 'wm-k' }],
    ['path', { d: FOOT, fill: `url(#${gid})`, class: 'wm-k' }],
    ['path', { d: 'M6 19.45 H18', fill: 'none', stroke: SHINE, 'stroke-width': 0.4, 'stroke-opacity': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
  const collar = [
    ['path', { d: COLLAR, fill: WOOD, class: 'wm-k' }],
    ['path', { d: COLLAR, fill: `url(#${gid})`, class: 'wm-k' }],
    ['path', { d: 'M7.6 15.6 A4.9 1.2 0 0 0 16.4 15.6', fill: 'none', stroke: SHINE, 'stroke-width': 0.4, 'stroke-opacity': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7.1 16.6 A4.9 1.2 0 0 0 16.9 16.6', fill: 'none', stroke: SHADE, 'stroke-width': 0.35, 'stroke-opacity': 0.35, class: 'wm-k' }],
  ]
  const glint = [['path', { d: 'M7.6 7.4 A4.6 4.6 0 0 1 10.1 4.7', fill: 'none', stroke: SHINE, 'stroke-width': 0.9, 'stroke-opacity': 0.75, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7.35 9.1 v0.05', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }]]
  return [['defs', {}, kids], ...shadow, ...base, ...rest, ...glint, ...collar]
}

export default function render(icon) {
  const nodes = draw({ ...icon, category: 'shapes' }, RAW)
  return finish(nodes)
}
