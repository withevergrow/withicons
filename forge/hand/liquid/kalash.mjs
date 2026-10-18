// forge/hand/liquid/kalash.mjs: the sacred pot drawn so it cannot be mistaken for a hat or a figure: a round-bellied
// clear-glass pot with a narrow neck and a flared rim, a crown of four mango leaves fanning up out of the mouth (coloured
// glass, wm-a) and a coconut bead sitting in front of them (accent glass, wm-s). The generated pot was a squat dish under
// a blob. Same glass recipe as the generator (_liquid-core.mjs build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

const r2 = n => Math.round(n * 100) / 100
const tf = ([x, y]) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]

// a prepared skeleton in the shape model() expects. Every filled part also gets a small closed line well inside it (it
// only decides which plate the fill belongs to; it never reaches the edge), so a clear K pot beside coloured A leaves is
// not mistaken for A glass.
function skeleton(name, parts, cuts = []) {
  const lines = [], fills = []
  for (const p of parts) {
    const subs = parsePath(p.d)
    if (p.line) for (const s of subs) lines.push({ pts: s.pts, closed: s.closed, plate: p.plate })
    if (p.fill) {
      fills.push({ subs })
      if (!p.line && p.vote !== false) for (const s of subs) {
        const xs = s.pts.map(q => q[0]), ys = s.pts.map(q => q[1])
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2
        const half = Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2
        const k = Math.max(0.08, 1 - 1.5 / (0.88 * half))
        lines.push({ pts: s.pts.map(q => [cx + (q[0] - cx) * k, cy + (q[1] - cy) * k]), closed: true, plate: p.plate })
      }
    }
  }
  return { name, paths: [], lines, fills, cutouts: cuts.map(d => ({ subs: parsePath(d) })) }
}

const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
// flared rim, narrow neck, round belly: one outline
const POT = 'M7.6 9.3 A0.95 0.95 0 0 1 8.55 8.35 H15.45 A0.95 0.95 0 0 1 16.4 9.3 A0.95 0.95 0 0 1 15.45 10.25 H14.5 V12.6 C18 13.2 19.7 15 19.7 17.5 C19.7 20.3 16.4 21.8 12 21.8 C7.6 21.8 4.3 20.3 4.3 17.5 C4.3 15 6 13.2 9.5 12.6 V10.25 H8.55 A0.95 0.95 0 0 1 7.6 9.3 Z'
// mango leaves: long pointed ovals fanning up and out of the mouth
const LEAVES = [
  'M9.6 9 C7 8.6 4.8 7.2 3.4 5 C6.2 4.6 8.8 6 10.2 8.4 Z',
  'M10.4 8.8 C8.4 7.4 6.8 5 6.8 2.4 C9 3 10.8 5.2 11.2 8.4 Z',
  'M12 8.6 C10.8 6.8 10.8 4 12 1.8 C13.2 4 13.2 6.8 12 8.6 Z',
  'M13.6 8.8 C15.6 7.4 17.2 5 17.2 2.4 C15 3 13.2 5.2 12.8 8.4 Z',
  'M14.4 9 C17 8.6 19.2 7.2 20.6 5 C17.8 4.6 15.2 6 13.8 8.4 Z',
]

export default function render(icon) {
  const name = (icon && icon.name) || 'kalash'
  const nodes = build(skeleton(name, [
    { d: POT, plate: 'K', fill: true },
    ...LEAVES.map(d => ({ d, plate: 'A', fill: true })),
    { d: ring(12, 6.3, 1.0), plate: 'S', fill: true, line: true },
  ])) || []
  // a decorative band of two fine lines round the belly
  const arc = (y0, y1) => `M${tf([6.3, y0]).join(' ')}C${tf([9.4, y1]).join(' ')} ${tf([14.6, y1]).join(' ')} ${tf([17.7, y0]).join(' ')}`
  nodes.push(['path', { d: arc(16.9, 18.5) + arc(18.5, 20.1), stroke: 'var(--with-liquid-c3, #1C3F9E)', 'stroke-opacity': 0.5, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-deco' }])
  return nodes
}
