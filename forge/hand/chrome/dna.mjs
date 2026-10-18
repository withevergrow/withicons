// forge/hand/chrome/dna.mjs — a polished chrome double helix: two separate strand tubes twisting round each other,
// crossing twice with a clean over/under break (the front strand clears the back one by a dark seam), and four fat
// gunmetal base-pair rungs bridging the two open loops behind the strands. The generator fused both strands and
// their fill into one hourglass slab and cut the rungs as thin slots through it, so the helix read as a ladder
// and the rungs vanished at 16px. Painted with the style's own recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K, col } from '../../styles/_chrome-core.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : JSON.stringify(x[1]).length + 20), 0)

// strand halves: A runs top-left -> right loop -> bottom-left, B mirrors it
const A_TOP = 'M7 2.75C7 7.5 17 7 17 12', A_BOT = 'M17 12C17 17 7 16.5 7 21.25'
const B_TOP = 'M17 2.75C17 7.5 7 7 7 12', B_BOT = 'M7 12C7 17 17 16.5 17 21.25'
// base pairs, set into the strands
const RUNGS = 'M8 4.25H16M9 10H15M9 14H15M8 19.75H16'
// boxes round the two crossings: the over/under break is only cut there
const box = (y0, y1) => { const f = F.field(1); return F.clipBand(F.offset(f, -2), y0, y1) }

export default function render(icon) {
  const name = (icon && icon.name) || 'dna'
  const W = 2.35
  // upper crossing: A over B; lower crossing: B over A (a true twist)
  const over = F.strokes([...lines(A_TOP), ...lines(B_BOT)], W, M0)
  const under = F.strokes([...lines(B_TOP), ...lines(A_BOT)], W, M0)
  const [, y1] = tf([0, 7.25]), [, y2] = tf([0, 16.75])
  const cross = F.union(box(y1 - 2.2, y1 + 2.2), box(y2 - 2.2, y2 + 2.2))
  const gap = F.intersect(F.offset(F.copy(over), -K.GAP), cross)
  const seam = F.intersect(F.copy(gap), under)
  const strands = minus(under, gap); F.union(strands, over)
  const rungs = F.strokes(lines(RUNGS), 2.05, M0)
  const round = x => F.open(F.copy(x), K.ROUND)
  const sil = F.copy(under); F.union(sil, over); F.union(sil, rungs)
  const Ls = layers({ T: {}, K: round(strands), Af: null, Ab: round(rungs), S: null, sil, txt: null, seam: null })
  for (const L of Ls.list) if (L.cls !== 'wm-shine' && L.cls !== 'wm-shadow') L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  // the over/under break: a dark seam in the gap under the front strand, laid just above the cast shadow
  const sd = ringsD(F.contour(minus(seam, over)).filter(l => l.length > 2), 0.05, 2)
  if (!sd) return out
  const i = out.findIndex(n => n[1] && n[1].class === 'wm-shadow')
  out.splice(i + 1, 0, ['path', { d: sd, fill: col('shadow'), class: 'wm-k' }])
  return out
}
