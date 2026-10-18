// forge/hand/chrome/avatar-person-headphones.mjs — a polished chrome face under a short gunmetal fringe, wearing
// headphones: a separate gunmetal headband arching clear above the hair (a strip of sky between them) into two
// hot-pink enamel ear cups set in chrome bezels on the sides of the head. The generator fused band, hair and cups into
// one grey helmet with the band cut as a groove and the face as hollow rings, so the headphones vanished at 24 and
// 16px. Here every part is its own piece (hair in front of the face behind a dark parting seam, the cups cleared by
// their moat) and the face is printed (ink eyes and smile on a pale halo) on a horizon that steps round it.
// Painted with the style's own recipe (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = K.M
const r2 = v => Math.round(v * 100) / 100
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : JSON.stringify(x[1]).length + 20), 0)
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => { const [a, b] = tf([+x, +y]); return `${r2(a)} ${r2(b)}` })
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, d) => F.offset(F.copy(A), -d)

const HEAD = 'M18 11.5A6 6.25 0 1 1 6 11.5A6 6.25 0 1 1 18 11.5Z'
const HAIR = 'M6.25 11C5.75 7.25 8.5 4.75 12 4.75C15.5 4.75 18.25 7.25 17.75 11C17 10.25 16.6 9.5 16.4 8.75' +
  'C14.9 9.25 13.25 9 12 8.25C10.75 9 9.1 9.25 7.6 8.75C7.4 9.5 7 10.25 6.25 11Z'
const BAND = 'M5.25 10A6.75 7.5 0 0 1 18.75 10'
const CUPS = 'M5.25 9.25A2 2 0 0 1 7.25 11.25V13A2 2 0 0 1 3.25 13V11.25A2 2 0 0 1 5.25 9.25Z' +
  'M18.75 9.25A2 2 0 0 1 20.75 11.25V13A2 2 0 0 1 16.75 13V11.25A2 2 0 0 1 18.75 9.25Z'
const BUST = 'M3.5 22.5C3.5 19.25 5.5 17.5 8 17.5C9.5 17.5 10.5 18.25 12 18.25C13.5 18.25 14.5 17.5 16 17.5C18.5 17.5 20.5 19.25 20.5 22.5Z'
const EYES = [[9.6, 12.6], [14.4, 12.6]]
const SMILE = 'M10.1 15C11.15 15.95 12.85 15.95 13.9 15'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-person-headphones'
  const head = F.region(rings(HEAD), M0)
  const hair = F.region(rings(HAIR), M0)
  const back = F.strokes(lines(BAND), 1.8, M0)
  F.region(rings(BUST), M0, back)
  const cups = F.region(rings(CUPS), K.MOAT + 0.6)
  // the hair sits in front of the face: a parting gap, drawn as a dark seam in the face
  const gap = grow(hair, K.GAP)
  let K0 = minus(head, gap)
  const seam = F.intersect(F.copy(gap), head)
  // the enamel cups are cleared from everything by their moat
  const moat = grow(cups, K.MOAT)
  K0 = minus(K0, moat)
  const Af = minus(hair, moat), Ab = minus(back, moat)
  const seamC = minus(seam, moat)
  const sil = F.copy(head); F.union(sil, hair); F.union(sil, back); F.union(sil, cups)
  // the printed face keeps a clear field: the horizon steps round it
  const face = F.field(M0)
  for (const [x, y] of EYES) F.strokes([{ pts: [tf([x, y - 0.4]), tf([x, y + 0.4])], closed: false }], 2.6, M0, face)
  F.strokes(lines(SMILE), 2.3, M0, face)
  const round = A => F.open(A, K.ROUND)
  const Ls = layers({ T: {}, K: round(K0), Af: round(Af), Ab: round(Ab), S: cups, sil, txt: F.offset(face, -0.3), seam: seamC })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 12000; t++) out = emit(Ls, name, t)
  const s = K.SCALE, feat = []
  for (const [x, y] of EYES) {
    const [cx, cy] = tf([x, y])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(1.2 * s), ry: r2(1.55 * s), fill: col('edge'), class: 'wm-k' }])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(0.8 * s), ry: r2(1.12 * s), fill: col('ink'), class: 'wm-k' }])
    feat.push(['circle', { cx: r2(cx - 0.22 * s), cy: r2(cy - 0.4 * s), r: r2(0.28 * s), fill: col('shine'), class: 'wm-k' }])
  }
  const sm = { d: TD(SMILE), fill: 'none', 'stroke-linecap': 'round', class: 'wm-k' }
  feat.push(['path', { ...sm, stroke: col('edge'), 'stroke-width': r2(2 * s) }])
  feat.push(['path', { ...sm, stroke: col('ink'), 'stroke-width': r2(1.1 * s) }])
  return [...out, ...feat]
}
