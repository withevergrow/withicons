// forge/hand/chrome/avatar-older-man.mjs — a bald polished chrome head (the glint and sheen make the bald dome) with two
// fluffy gunmetal side tufts, gunmetal shoulders, and a small printed face: bushy grey brows, ink eyes with a catchlight
// and a full grey moustache, each on a pale halo the way the style prints values. The generator cut the eyes as holes
// and set the moustache as a gunmetal blob right on the dark horizon, so the face read as a gaping mouth at 16px.
// Body painted with the style's own recipe (_chrome-core layers/emit); the face keeps a clear field under it.
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
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => { const [a, b] = tf([+x, +y]); return `${r2(a)} ${r2(b)}` })

const HEAD = 'M17.5 10.25A5.5 6 0 1 1 6.5 10.25A5.5 6 0 1 1 17.5 10.25Z'
// side tufts: fluffy puffs over the ears, leaving the crown bare
const tuft = s => {
  const x = v => r2(12 + s * (v - 12))
  return `M${x(8.25)} 5.4C${x(6.25)} 5.75 ${x(4.75)} 7.1 ${x(4.6)} 8.85C${x(3.85)} 9.6 ${x(3.85)} 11.35 ${x(4.85)} 12.05` +
    `C${x(5.2)} 13.15 ${x(6.35)} 13.75 ${x(7.4)} 13.35L${x(9)} 9Z`
}
const TUFTS = tuft(1) + ' ' + tuft(-1)
const SHOULDERS = 'M4.25 21.75C4.25 19.25 6.25 17.75 8.5 17.75C9.75 17.75 10.75 18.5 12 18.5C13.25 18.5 14.25 17.75 15.5 17.75C17.75 17.75 19.75 19.25 19.75 21.75Z'
// the printed face
const EYES = [[9.5, 10.6], [14.5, 10.6]]
const BROWS = 'M8.1 8.45C8.9 7.75 10 7.6 10.9 8.05 M15.9 8.45C15.1 7.75 14 7.6 13.1 8.05'
const MOUSTACHE = 'M8.6 14.55C9.3 13.05 11.1 12.7 12 13.35C12.9 12.7 14.7 13.05 15.4 14.55C14.2 15.35 12.9 15.1 12 14.65C11.1 15.1 9.8 15.35 8.6 14.55Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-older-man'
  const head = F.strokes(lines(HEAD), 1.2, M0)
  F.region(rings(HEAD), M0, head)
  const Ab = F.region(rings(TUFTS), M0)
  F.strokes(lines(TUFTS), 0.9, M0, Ab)
  F.region(rings(SHOULDERS), M0, Ab)
  F.strokes(lines(SHOULDERS), 1.1, M0, Ab)
  const sil = F.copy(head); F.union(sil, Ab)
  // the printed face keeps a clear field: the horizon steps round it
  const face = F.field(M0)
  for (const [x, y] of EYES) F.strokes([{ pts: [tf([x, y - 0.3]), tf([x, y + 0.3])], closed: false }], 2.6, M0, face)
  F.strokes(lines(BROWS), 2.1, M0, face)
  F.region(rings(MOUSTACHE), M0, face)
  F.strokes(lines(MOUSTACHE), 1.1, M0, face)
  const round = x => F.open(F.copy(x), K.ROUND)
  const Ls = layers({ T: {}, K: round(head), Af: null, Ab: round(minus(Ab, F.offset(F.copy(head), -0.05))), S: null, sil, txt: F.offset(face, -0.2), seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9500; t++) out = emit(Ls, name, t)
  const s = K.SCALE, feat = []
  const halo = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  feat.push(['path', { d: TD(BROWS), ...halo, stroke: col('edge'), 'stroke-width': r2(1.85 * s), class: 'wm-k' }])
  feat.push(['path', { d: TD(BROWS), ...halo, stroke: col('c3'), 'stroke-width': r2(1.05 * s), class: 'wm-k' }])
  for (const [x, y] of EYES) {
    const [cx, cy] = tf([x, y])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(1.2 * s), ry: r2(1.45 * s), fill: col('edge'), class: 'wm-k' }])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(0.8 * s), ry: r2(1.05 * s), fill: col('ink'), class: 'wm-k' }])
    feat.push(['circle', { cx: r2(cx - 0.25 * s), cy: r2(cy - 0.4 * s), r: r2(0.28 * s), fill: col('shine'), class: 'wm-k' }])
  }
  feat.push(['path', { d: TD(MOUSTACHE), fill: col('c3'), stroke: col('edge'), 'stroke-width': 0.6, 'stroke-linejoin': 'round', 'paint-order': 'stroke', class: 'wm-k' }])
  return [...out, ...feat]
}
