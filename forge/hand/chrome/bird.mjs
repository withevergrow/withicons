// forge/hand/chrome/bird.mjs — a polished chrome songbird in side view (round head, plump breast, a tail tipped up
// behind) with a gunmetal wing set in front on a dark seam, a gunmetal beak and two gunmetal legs with toes behind the
// body, and one printed ink eye with a catchlight. The generator cut the eye as a big hole and the wing as a hollow
// groove and fused the beak and legs into the tube, so head, wing and legs ran together at 16px.
// Painted with the style's own recipe (_chrome-core layers/emit); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const r2 = v => Math.round(v * 100) / 100
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : JSON.stringify(x[1]).length + 20), 0)

const BODY = 'M18.75 8C18.75 13.25 15.25 17.5 10.5 17.5C7.9 17.5 6 16.4 5 14.4L3.2 10.4L7.4 11.6' +
  'C8.9 10.6 10.4 9.8 12.1 9.3C12 6.6 13.5 4.75 15.5 4.75C17.3 4.75 18.75 6.1 18.75 8Z'
const BEAK = 'M18.25 6.6L21.4 8L18.25 9.4Z'
const WING = 'M15.3 10.6C15.6 13.9 12.6 15.9 8.6 14.6C10.3 12.4 12.6 10.9 15.3 10.6Z'
const LEGS = 'M10 17V20.75H11.5M13.5 16.5V20.75H15'
const EYE = [15.75, 7.6]

export default function render(icon) {
  const name = (icon && icon.name) || 'bird'
  const round = x => F.open(F.copy(x), K.ROUND)
  const body = F.strokes(lines(BODY), K.WK, M0)
  F.region(rings(BODY), M0, body)
  // wing: a gunmetal piece in front, cleared from the body by a dark seam
  const wing = F.strokes(lines(WING), 1.5, M0)
  F.region(rings(WING), M0, wing)
  const gap = F.offset(F.copy(wing), -K.GAP)
  const seam = F.intersect(F.copy(gap), body)
  // beak and legs: gunmetal behind the body
  const back = F.strokes(lines(BEAK), 1.4, M0)
  F.region(rings(BEAK), M0, back)
  F.strokes(lines(LEGS), 1.5, M0, back)
  const sil = F.copy(body); F.union(sil, back)
  // the printed eye keeps a clear field: the horizon steps round it
  const face = F.strokes([{ pts: [tf(EYE)], closed: false }], 2.6, M0)
  const Ls = layers({ T: {}, K: round(minus(body, gap)), Af: round(wing), Ab: round(back), S: null, sil, txt: face, seam })
  for (const L of Ls.list) if (L.cls !== 'wm-shine' && L.cls !== 'wm-shadow') L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  const s = K.SCALE, [cx, cy] = tf(EYE)
  return [...out,
    ['circle', { cx: r2(cx), cy: r2(cy), r: r2(1.3 * s), fill: col('edge'), class: 'wm-k' }],
    ['circle', { cx: r2(cx), cy: r2(cy), r: r2(0.95 * s), fill: col('ink'), class: 'wm-k' }],
    ['circle', { cx: r2(cx - 0.3 * s), cy: r2(cy - 0.3 * s), r: r2(0.33 * s), fill: col('shine'), class: 'wm-k' }]]
}
