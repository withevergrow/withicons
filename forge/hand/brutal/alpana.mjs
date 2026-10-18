// forge/hand/brutal/alpana.mjs — an alpana motif in neo-brutalism: three fat yellow commas swirling round a pink hub,
// each a smooth curl of 3u yellow that ends in a round closed head, with three solid ink dots set in the open bays
// between them as the classic alpana punctuation. Three arms, not four: at the brutal ink weight four commas crowd so
// tightly round the hub that the shadow fills the gaps and the motif reads as a propeller. Replaces the generated
// drawing, where five thin spirals and loose dots thickened into one black blob, and an earlier lumpy-lobe version
// that read as a clover.
// Roles: commas c1, hub c2, outline, dots + hard shadow ink (var(--with-brutal-ink, #16130F)). Motion: shadow wm-shadow, commas wm-k,
// hub wm-a (the spec twinkles parts.A while the whole motif spins), dots wm-deco.
import { K } from '../../styles/_brutal-core.mjs'
import { circle, ribbon, setD } from '../../kernel/geom.mjs'
import { normalize, unionSets, solid, translateSet } from '../../kernel/bool.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = K.W, O = K.OFF, S = K.SHIFT
const RAD = Math.PI / 180
const CX = 12, CY = 12, N = 3

// one comma (arm 0 = head at 12 o'clock; angles clockwise from 3 o'clock, y down): a round head at (HA, HR) and a tail
// that curls back counter-clockwise and inward, tapering, to tuck under the hub
export const P = { HA: -90, HR: 7.1, RH: 2.6, TA: -48, TR: 3.5, TW: 2.2, BULGE: 0.4 }
function comma(k, p = P) {
  const rot = k * 360 / N
  const pts = []
  for (let i = 0; i <= 40; i++) {
    const u = i / 40, a = (p.HA + rot + p.TA * u) * RAD
    const r = p.HR + (p.TR - p.HR) * u + p.BULGE * Math.sin(Math.PI * u)
    pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a)])
  }
  const wAt = (t, i, u) => 2 * p.RH + (p.TW - 2 * p.RH) * Math.min(1, Math.max(0, (u - 0.05) / 0.95)) ** 0.8
  return unionSets([solid(ribbon(pts, wAt)), normalize(circle(pts[0][0], pts[0][1], p.RH, 0.12)), normalize(circle(pts[40][0], pts[40][1], p.TW / 2, 0.12))])
}
export const COMMAS = unionSets(Array.from({ length: N }, (_, k) => comma(k)))
const HUB = normalize(circle(CX, CY, 2.3, 0.12))
export const DOT = { R: 1.05, D: 9.3, A: -40 }
const DOTS = Array.from({ length: N }, (_, k) => k).map(k => { const a = (DOT.A + 360 / N * k) * RAD; return [CX + DOT.D * Math.cos(a), CY + DOT.D * Math.sin(a)] })
const dotsD = d => DOTS.map(([x, y]) => setD([circle(x + d, y + d, DOT.R, 0.12)])).join('')

const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round' }
const at = set => setD(translateSet(set, S, S)), sd = set => setD(translateSet(set, S + O, S + O))

export default function render() {
  return [
    // the hard shadow: commas and hub in solid ink, down-right
    ['path', { d: sd(unionSets([COMMAS, HUB])), fill: INK, ...LINE, class: 'wm-shadow' }],
    // the commas, then the hub over their tucked tails
    ['path', { d: at(COMMAS), fill: C1, ...LINE, class: 'wm-k' }],
    ['path', { d: at(HUB), fill: C2, ...LINE, class: 'wm-a' }],
    // the alpana dots in the bays between the commas
    ['path', { d: dotsD(S), fill: INK, class: 'wm-deco' }],
  ]
}
