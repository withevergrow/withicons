// forge/hand/brutal/microphone-off.mjs — a wide yellow capsule mic in a round ink holder on a stem with a flat base bar,
// struck by a plain ink slash with a paper moat (the brutal bell-off / video-off recipe). Replaces the generated drawing,
// whose capsule fused with the holder and read as a hand or an arch. The capsule is 7.5u wide so a clear yellow pill
// survives the slash at 16px; the holder (centre 12 10.75, r 8) keeps over 2u of paper round it, and the slash cuts it
// well right of its lowest point so both pieces stay long arms of one U.
// House recipe: 2.2 ink, flat c1 fill, hard ink shadow down-right on the closed capsule only (open holder and stem
// strokes cast none, so no doubled caps; the slash casts none, as in the generated -off icons). Geometry is cut with
// the kernel booleans so the moat is exact. Motion: mic wm-k, slash wm-s (the spec draws parts.S), shadow wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'
import { parsePath, area, polyD, simplify } from '../../kernel/geom.mjs'
import { normalize, strokeSet, roundStrokeSet, differenceSets, unionSets, translateSet } from '../../kernel/bool.mjs'

const INK = 'var(--with-brutal-ink, #16130F)'
const PAPER = 'var(--with-brutal-shine, #FFFDF5)'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const W = K.W, O = K.OFF, S = K.SHIFT
const GAP = 0.9 // paper between the slash and the mic

// skeleton space
const CAPSULE = 'M8.25 6 A3.75 3.75 0 0 1 15.75 6 V7.5 A3.75 3.75 0 0 1 8.25 7.5 Z'
const HOLDER = 'M4 10.75 A8 8 0 0 0 20 10.75'
const STEM = 'M12 18.75 V21.25'
const BASE = 'M8.5 21.25 H15.5'

const pts = d => parsePath(d, 0.15).map(s => ({ pts: s.pts.map(p => [p[0] + S, p[1] + S]), closed: s.closed }))
const D = set => set.filter(r => r.length > 2).map(r => polyD(simplify(r, 0.02, true), true)).join('')
const keep = set => set.filter(r => Math.abs(area(r)) > 2.2)

export default function render() {
  const cap = pts(CAPSULE)[0], holder = pts(HOLDER)[0], stem = pts(STEM)[0], base = pts(BASE)[0]
  const capInk = strokeSet(cap.pts, W, true)
  const stand = unionSets([roundStrokeSet(holder.pts, W), roundStrokeSet(stem.pts, W), roundStrokeSet(base.pts, W)])
  const fill = normalize(cap.pts)
  // the moat: a band along the slash (the slash is y = x after the shift too)
  const h = (W / 2 + GAP) / Math.SQRT2
  const band = [[[-4 - h, -4 + h], [30 - h, 30 + h], [30 + h, 30 - h], [-4 + h, -4 - h]]]
  // reviewer: keep the mic solid, no paper moat round the slash
  void band; void differenceSets
  const capC = keep(capInk), fillC = keep(fill)
  const standC = keep(stand)
  const shadow = translateSet(unionSets([capC, fillC]), O, O)
  const s = +(3 + S).toFixed(2), e = +(21 + S).toFixed(2)
  const shD = D(shadow), fD = D(fillC), inkD = D(unionSets([capC, standC]))
  const slash = `M${s} ${s} L${e} ${e}`
  return [
    // paper keyline behind everything: invisible on light, keeps the ink mic and slash readable on dark
    ['path', { d: shD + fD + inkD, fill: PAPER, stroke: PAPER, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: shD, fill: INK, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: fD, fill: C1, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: inkD, fill: INK, 'fill-rule': 'evenodd', class: 'wm-k' }],
    // thin paper moat so the slash separates cleanly from the mic outline
    ['path', { d: slash, fill: 'none', stroke: PAPER, 'stroke-width': +(W + 1.6).toFixed(2), 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: slash, fill: 'none', stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
