// forge/hand/liquid/sliders.mjs: three clear-glass tracks, each carrying a round coloured-glass knob at a staggered
// position. A clear ring of air is cut round every knob so it sits in the track as its own bead (the generated knobs
// were thin pills the same width as the tracks, so the whole icon read as fat stripes). Painted with the style's own
// glass recipe (_liquid-core build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = n => Math.round(n * 100) / 100
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const circ = (x, y, r) => `M${r2(x - r)} ${y}A${r} ${r} 0 1 0 ${r2(x + r)} ${y}A${r} ${r} 0 1 0 ${r2(x - r)} ${y}Z`

// tracks (K) and their knobs: [track y, knob x]
const ROWS = [[5.5, 15], [12, 9], [18.5, 13.5]]
const TRACKS = ROWS.map(([y]) => `M3 ${y}H21`)
const KNOB_R = 3.1, MOAT_R = 3.9

export default function render(icon) {
  const name = (icon && icon.name) || 'sliders'
  const knobs = ROWS.map(([y, x]) => circ(x, y, KNOB_R))
  const nodes = build({
    name,
    paths: [],
    lines: [
      ...TRACKS.flatMap(d => lines(d, 'K')),
      ...ROWS.flatMap(([y, x]) => lines(circ(x, y, 1.7), 'A')),
    ],
    fills: [...knobs.map(d => ({ d, subs: parsePath(d) }))],
    cutouts: ROWS.map(([y, x]) => { const d = circ(x, y, MOAT_R); return { d, subs: parsePath(d) } }),
  })
  return nodes
}
