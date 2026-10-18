// forge/hand/chrome/cat.mjs — a polished chrome cat head (round cheeks, two pointed ears) with a small printed face: two
// tall ink eyes with a white catchlight and a small rounded ink nose (wm-a, they blink), each set on a pale halo the way
// the style prints values, so they read on the sky, the dark horizon and the warm ground alike. The generator stroked
// the eyes and nose as gunmetal tubes inside their own cut holes, so the face became three hollow rings (a pig or a
// panda) sitting right on the horizon. Body painted with the style's own recipe (_chrome-core layers/emit).
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

const HEAD = 'M12 20.5C7 20.5 3.5 18 3.5 13.75C3.5 11.75 3.9 10.25 4.5 9V4.25L9.5 6.5C10.25 6.25 11.25 6 12 6' +
  'C12.75 6 13.75 6.25 14.5 6.5L19.5 4.25V9C20.1 10.25 20.5 11.75 20.5 13.75C20.5 18 17 20.5 12 20.5Z'
const EYES = [[8.6, 11], [15.4, 11]]
const NOSE = 'M10.85 15.55 L13.15 15.55 C13.6 15.55 13.8 15.95 13.5 16.3 L12.45 17.35 C12.2 17.6 11.8 17.6 11.55 17.35 L10.5 16.3 C10.2 15.95 10.4 15.55 10.85 15.55 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'cat'
  const body = F.strokes(lines(HEAD), K.WK, M0)
  F.region(rings(HEAD), M0, body)
  const Kf = F.open(body, K.ROUND)
  // the printed face keeps a clear field: the horizon steps round it, as round printed values
  const face = F.field(M0)
  for (const [x, y] of EYES) F.strokes([{ pts: [tf([x, y - 0.55]), tf([x, y + 0.55])], closed: false }], 3.4, M0, face)
  F.region(rings(NOSE), M0, face)
  const faceC = F.offset(F.copy(face), -0.35)
  const Ls = layers({ T: {}, K: Kf, Af: null, Ab: null, S: null, sil: F.copy(body), txt: faceC, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  const s = K.SCALE, feat = []
  for (const [x, y] of EYES) {
    const [cx, cy] = tf([x, y])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(1.5 * s), ry: r2(1.95 * s), fill: col('edge'), class: 'wm-a' }])
    feat.push(['ellipse', { cx: r2(cx), cy: r2(cy), rx: r2(1.1 * s), ry: r2(1.55 * s), fill: col('ink'), class: 'wm-a' }])
    feat.push(['circle', { cx: r2(cx - 0.35 * s), cy: r2(cy - 0.6 * s), r: r2(0.38 * s), fill: col('shine'), class: 'wm-a' }])
  }
  feat.push(['path', { d: TD(NOSE), fill: col('ink'), stroke: col('edge'), 'stroke-width': 0.6, 'paint-order': 'stroke', class: 'wm-a' }])
  return [...out, ...feat]
}
