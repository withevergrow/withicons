// forge/hand/chrome/usb.mjs — the USB trident as one polished chrome casting: a bold arrowhead on a straight stem,
// a round plug foot, and two slimmer branch arms (ball left, square right) that leave the stem at different heights
// with open sky between them. The generated drawing inflated every stroke to the same fat tube, so the arms, the ball
// and the stem pooled into one lump at the junction and the trident blurred at 16px; here the arms are drawn thinner
// than the stem and their heads stand clear. Painted with the style's own layer recipe (_chrome-core layers/emit).
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

// heads: filled shapes, outlined so their corners inflate like the rest of the casting
const HEADS = 'M12 2.2L15.2 6.5H8.8Z' +
  'M14.1 20A2.1 2.1 0 1 1 9.9 20A2.1 2.1 0 1 1 14.1 20Z' +
  'M7 8.8A2.1 2.1 0 1 1 2.8 8.8A2.1 2.1 0 1 1 7 8.8Z' +
  'M17.4 5.2H21.2V9H17.4Z'
const STEM = 'M12 6.5V18.2'
const ARMS = 'M4.9 10.9V13L12 16.6M19.3 9V11L12 14.2'

export default function render() {
  const Kf = F.strokes(lines(HEADS), 1.4, M0)
  F.region(rings(HEADS), M0, Kf)
  F.strokes(lines(STEM), 3.0, M0, Kf)
  F.strokes(lines(ARMS), 2.3, M0, Kf)
  const Kb = F.open(Kf, 0.32)
  const sil = F.copy(Kb)
  const Ls = layers({ T: {}, K: Kb, Af: null, Ab: null, S: null, sil, txt: null, seam: null })
  let out = emit(Ls, 'usb', 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, 'usb', t)
  return out
}
