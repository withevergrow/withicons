// forge/hand/chrome/signature.mjs — a signature scrawl bent from a gunmetal tube (the style's second, darker metal) with
// its top loop held open, over a polished chrome baseline rod. The generated drawing inflated the scrawl into a fat pale
// chrome tube whose loop closed up, so on white it read as a faint light squiggle. The darker metal keeps the pen line
// strong on light grounds, and its tint rim and sheen keep it bright on dark. Painted with the style's own layer
// recipe (_chrome-core); the scrawl carries wm-k (the body the draw loop writes) and the rod wm-a (it breathes).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K as CK } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = CK.SCALE, OX = CK.TX, OY = CK.TY
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const r2 = v => Math.round(v * 100) / 100
const M0 = 0.7

const SCRAWL = 'M3 16.5C6 15 10 11 10 7C10 3.5 6 3.5 6 7C6 10.5 7 16.5 9 16.5C10.5 16.5 11 13 12.5 13C14 13 14 16.5 15.5 16.5C17 16.5 18 14 21 14'
const ROD = 'M3.5 20.5H20.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'signature'
  // the scrawl: gunmetal tube a little lighter than a chrome line drawing, so the loop stays open
  const Ab = F.open(F.strokes(lines(SCRAWL), 2.3, M0), CK.ROUND)
  const Kf = F.open(F.strokes(lines(ROD), 2.4, M0), CK.ROUND)
  const sil = F.copy(Kf); F.union(sil, Ab)
  const Ls = layers({ T: { noGlint: true }, K: Kf, Af: null, Ab, S: null, sil, txt: null, seam: null })
  // swap the plate classes: the scrawl is the body, the rod the moving part
  for (const L of Ls.list) L.cls = L.cls === 'wm-a' ? 'wm-k' : L.cls === 'wm-k' ? 'wm-a' : L.cls
  const out = emit(Ls, name, 0)
  // the style's four-point glint, on the crown of the loop
  const [x, y] = tf([7.4, 4.9]), r = 1.7, w = 0.3
  const d = `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}Z`
  out.push(['path', { d, fill: col('shine'), class: 'wm-shine' }])
  return out
}
