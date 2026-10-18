// forge/hand/glass/file-archive.mjs — the glass page with its folded corner and a bold zipper down x 10, left of the fold. The
// generated drawing etched four tiny dots and a small pull that read as a stained page; here a column of deep etch
// teeth zigzags down from the top edge and ends in a big accent-colour pull tab with a slot, all at Line's weight.
// Roles: back/shadow colour body, pane/frost glass, accent pull, etch teeth, shine rim. Motion: page wm-k, the zipper wm-a.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'

// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const R = v => +(v * G.SCALE).toFixed(2)
const rr = (x0, y0, x1, y1, r) => { const a = F(x0), b = F(y0), c = F(x1), d = F(y1), q = R(r); return `M${+(a + q).toFixed(2)} ${b}H${+(c - q).toFixed(2)}A${q} ${q} 0 0 1 ${c} ${+(b + q).toFixed(2)}V${+(d - q).toFixed(2)}A${q} ${q} 0 0 1 ${+(c - q).toFixed(2)} ${d}H${+(a + q).toFixed(2)}A${q} ${q} 0 0 1 ${a} ${+(d - q).toFixed(2)}V${+(b + q).toFixed(2)}A${q} ${q} 0 0 1 ${+(a + q).toFixed(2)} ${b}Z` }

// the zipper teeth: alternating blocks, left then right, every 1.5u down x 10 (the skeleton puts its teeth and pull at x 8-12)
const TEETH = []
for (let i = 0; i < 6; i++) { const y = 3.9 + i * 1.5; TEETH.push(i % 2 ? rr(9.9, y, 11.7, y + 1.05, 0.3) : rr(8.3, y, 10.1, y + 1.05, 0.3)) }
const TAB = rr(8.45, 12.3, 11.55, 18.4, 1.5)
const SLOT = rr(9.45, 14.2, 10.55, 16.6, 0.55)

export default function render(icon) {
  // the page (K) and its fold (the A line from the top edge, and its cutout), as glass draws every file
  // the fold is the line / cutout that starts on x 14 at (or above) the top edge and drops straight down
  const startsFold = pts => !!pts && pts.length > 1 && Math.abs(pts[0][0] - 14) < 0.01 && pts[0][1] <= 2.51 && Math.abs(pts[1][0] - 14) < 0.01
  const base = {
    ...icon,
    paths: icon.paths.filter(p => p.plate === 'K' || (p.subs[0] && startsFold(p.subs[0].pts))),
    lines: icon.lines.filter(l => l.plate === 'K' || startsFold(l.pts)),
    cutouts: icon.cutouts.filter(c => c.subs[0] && startsFold(c.subs[0].pts)),
  }
  const L = softLayers(base)
  if (!L) return null
  const { defs, out } = softPaint(L, icon.name)
  const zip = [
    ['path', { d: TEETH.join(''), fill: V.etch, 'fill-opacity': 0.9, class: 'wm-a' }],
    ['path', { d: TAB, fill: V.accent, 'fill-opacity': 0.95, stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: SLOT, fill: V.etch, 'fill-opacity': 0.85, class: 'wm-a' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  if (rim >= 0) out.splice(rim, 0, ...zip); else out.push(...zip)
  return [['defs', {}, defs], ...out]
}
