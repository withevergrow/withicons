// forge/hand/chrome/music-note.mjs — a polished chrome eighth note: a tilted oval head, a strong stem and a full
// teardrop flag sweeping right, all one inflated piece. The generated note was a round disc on a thin wire whose flag
// was a hairline tube, light and small beside its siblings and lost at 16px; this keeps the skeleton's head, stem and
// flag positions with the mass a chrome object needs. Painted with the style's own layer recipe (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
// an ellipse ring tilted by a degrees about its centre
function ellipse(cx, cy, rx, ry, a) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), out = []
  for (let k = 0; k < 72; k++) {
    const t = k / 72 * 2 * Math.PI, x = rx * Math.cos(t), y = ry * Math.sin(t)
    out.push(tf([cx + x * c - y * s, cy + x * s + y * c]))
  }
  return out
}

export default function render() {
  // head: a tilted oval whose right shoulder meets the stem
  const K = F.region([ellipse(7.5, 17.35, 4.7, 3.45, -27)], M0)
  // stem
  F.strokes(lines('M11.15 17V3.6'), 2.35, M0, K)
  // flag: a teardrop sweeping from the top of the stem out and down to the right
  const flag = 'M10.2 3.2C10.9 2.4 12 2.5 12.5 3.4C13.6 5.4 15.5 6.1 17 7.6C18.7 9.3 18.9 11.6 17.9 13.2C17.6 13.7 17 13.6 17 13C17.1 11 16.1 9.6 14.3 8.8C13.2 8.3 11.9 8.1 10.2 8Z'
  F.region(rings(flag), M0, K)
  const body = F.open(K, 0.32)
  const Ls = layers({ T: {}, K: body, Af: null, Ab: null, S: null, sil: F.copy(body), txt: null, seam: null })
  let out = emit(Ls, 'music-note', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'music-note', t)
  return out
}
