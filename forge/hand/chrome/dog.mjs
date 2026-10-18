// forge/hand/chrome/dog.mjs — a polished chrome dog head (round crown, cheeks pulled in, a narrow rounded muzzle) with
// two long narrow floppy ears hanging from the crown corners, notched off the temples so the floppy shape shows, and a
// small printed face: two ink eyes high in the bright sky with a white catchlight and a big rounded ink nose (wm-a, they
// blink), each on a pale halo. The generator fused the ears into the head and read as an owl or a skull; the first hand
// drawing put the eyes in the horizon band and hugged the ears to the cheeks (a head in headphones). Body and ears are
// painted with the style's own recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const r2 = v => Math.round(v * 100) / 100
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : JSON.stringify(x[1]).length + 20), 0)
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => { const [a, b] = tf([+x, +y]); return `${r2(a)} ${r2(b)}` })

// head: a round crown and temples, cheeks pulled in under the eyes, and a narrow rounded muzzle (about 4u wide)
// so the snout separates from the head even where the warm ground paints both
const HEAD = 'M12 4.75C15.25 4.75 17 6.75 17 9.5C17 11.25 16.6 12.75 16 13.75C15.25 14.75 14.25 15.25 14.15 16.5' +
  'C14.1 18.75 13.4 20 12 20C10.6 20 9.9 18.75 9.85 16.5C9.75 15.25 8.75 14.75 8 13.75C7.4 12.75 7 11.25 7 9.5' +
  'C7 6.75 8.75 4.75 12 4.75Z'
// floppy ears: long narrow pendants hung from the crown corners, a clear notch of background between each ear and the
// temple, falling to rounded tips well below the cheeks (y about 17.75)
const EARS = 'M8 5.25C6 4.5 4.1 5.5 3.6 7.75C3.2 10.25 3.3 13.75 3.85 16.25C4.2 17.9 6 17.9 6.25 16.25' +
  'C6.5 14.5 5.6 12 5.25 10C5 8.5 5.6 6.75 8 5.25Z' +
  'M16 5.25C18 4.5 19.9 5.5 20.4 7.75C20.8 10.25 20.7 13.75 20.15 16.25C19.8 17.9 18 17.9 17.75 16.25' +
  'C17.5 14.5 18.4 12 18.75 10C19 8.5 18.4 6.75 16 5.25Z'
// eyes sit high in the bright sky band, their halos clear of the dark horizon
const EYES = [[9.9, 8.75], [14.1, 8.75]]
// a big rounded nose (about 3.4u) at the top of the muzzle, a clear dark dot at 16px
const NOSE = 'M10.9 15L13.1 15C13.85 15 14.1 15.7 13.65 16.25L12.6 17.5C12.25 17.9 11.75 17.9 11.4 17.5L10.35 16.25' +
  'C9.9 15.7 10.15 15 10.9 15Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'dog'
  const head = F.strokes(lines(HEAD), K.WK, M0)
  F.region(rings(HEAD), M0, head)
  const ears = F.strokes(lines(EARS), K.WA, M0)
  F.region(rings(EARS), M0, ears)
  const round = x => F.open(F.copy(x), K.ROUND)
  const sil = F.copy(head); F.union(sil, ears)
  // the printed face keeps a clear field: the horizon steps round it
  const face = F.field(M0)
  for (const [x, y] of EYES) F.strokes([{ pts: [tf([x, y - 0.3]), tf([x, y + 0.3])], closed: false }], 2.9, M0, face)
  F.offset(face, -0.35)
  const Ls = layers({ T: {}, K: round(head), Af: null, Ab: round(ears), S: null, sil, txt: face, seam: null })
  // the ears hang still: only the face blinks (motion parts.A)
  for (const L of Ls.list) if (L.cls !== 'wm-shine' && L.cls !== 'wm-shadow') L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  const s = K.SCALE, feat = []
  for (const [x, y] of EYES) {
    const [cx, cy] = tf([x, y])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(1.4 * s), ry: r2(1.65 * s), fill: col('edge'), class: 'wm-a' }])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(1 * s), ry: r2(1.25 * s), fill: col('ink'), class: 'wm-a' }])
    feat.push(['circle', { cx: r2(cx - 0.3 * s), cy: r2(cy - 0.45 * s), r: r2(0.35 * s), fill: col('shine'), class: 'wm-a' }])
  }
  feat.push(['path', { d: TD(NOSE), fill: col('ink'), stroke: col('edge'), 'stroke-width': 0.6, 'paint-order': 'stroke', class: 'wm-a' }])
  return [...out, ...feat]
}
