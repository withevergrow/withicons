// forge/hand/chrome/handshake.mjs — two chrome hands clasped in a handshake, drawn from the line design: a slanted cuff
// each side, the clasped hands between them with a scalloped row of fingertips along the bottom, one thumb groove
// across the top and three short finger seams. Everything is chrome (the generator's dark gunmetal cuffs and
// thick grooves turned it into dark blobs); the cuffs are parted from the hands by a clear gap, the grooves are slim.
// Same paint recipe as the generator (_chrome-core.mjs layers/emit); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
// (the drawing is a little wider than tall, so it is enlarged 10% about its middle to match its siblings' optical size)
const Z = 1.1, ZY = 1.4, CY = 13.2
const tf = p => [(12 + (p[0] - 12) * Z - 12) * S + 12 + OX, (CY + (p[1] - CY) * ZY - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = d => F.region(rings(d), M0)
const lines = (ds, w) => F.strokes(ds.flatMap(d => parsePath(d).map(s => ({ pts: s.pts.map(tf) }))), w * S * 1.25, M0)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const out = (Ls, name) => { let o = emit(Ls, name, 0); for (let t = 1; t < 3 && size(o) > 8000; t++) o = emit(Ls, name, t); return o }

const CUFF_L = 'M4.2 6.4L7.4 8.2L4.4 14.8L1.2 13Z'
const CUFF_R = 'M19.8 6.4L16.6 8.2L19.6 14.8L22.8 13Z'
const HANDS = 'M7.4 9.8L10.6 8.4C12.6 7.8 14.6 9.2 16.6 8.8L18.8 13.2L17.4 14.8A1.2 1.2 0 0 1 15.9 16.5A1.2 1.2 0 0 1 14.3 18.1C13.4 19.1 12.6 19.6 11.8 19.5L11 19.4A1.2 1.2 0 0 1 9.3 18.3A1.2 1.2 0 0 1 7.6 16.9A1.2 1.2 0 0 1 5.9 15.3L4.9 14Z'
const THUMB = 'M8.8 11.4C8.5 12.5 9.8 13 11 11.8L12.4 10.6L17 14.2'
const SEAMS = 'M9.6 17.8L11.1 16'

export default function render(icon) {
  const name = (icon && icon.name) || 'handshake'
  const cuffs = reg(CUFF_L + CUFF_R)
  const hands = reg(HANDS)
  const gap = grow(cuffs, 0.55)
  const grooves = lines([THUMB, SEAMS], 0.8)
  const K = F.open(F.union(minus(minus(hands, gap), grooves), F.open(F.copy(cuffs), 0.2)), 0.2)
  const sil = F.union(F.copy(hands), cuffs)
  return out(layers({ T: {}, K, Af: null, Ab: null, S: null, sil, txt: null, seam: null }), name)
}
