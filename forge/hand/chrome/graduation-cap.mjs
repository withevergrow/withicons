// forge/hand/chrome/graduation-cap.mjs — a polished chrome mortarboard: a wide flat diamond board over a darker
// gunmetal skull cap, a gunmetal button at the board's centre and a tassel cord ending in a plump bob that hangs
// clear of the cap at the right corner. The generated cap fused board and skull into one pale lump split by a white
// V groove, and its tassel was a stub tucked against the brim, so at 16px it read as a bowl or a lamp.
// Painted with the style's own layer recipe (_chrome-core); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const has = x => x && F.any(x)
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

function compose({ K, Af = null, Ab = null }) {
  let K0 = F.copy(K), seam = null
  if (has(Af)) { const g = F.offset(F.copy(Af), -0.42); seam = F.intersect(F.copy(g), K); K0 = minus(K0, g) }
  const sil = F.copy(K)
  if (has(Af)) F.union(sil, Af)
  if (has(Ab)) F.union(sil, Ab)
  const round = x => has(x) ? F.open(F.copy(x), 0.32) : null
  return { T: {}, K: round(K0), Af: round(Af), Ab: round(Ab), S: null, sil, txt: null, seam }
}

// the board: a wide diamond seen from a little above
const BOARD = 'M12 3.3L22.5 8.6L12 13.9L1.5 8.6Z'
// the skull cap under it (its top hides behind the board)
const SKULL = 'M6.3 9.5V15.6C6.3 18.1 8.9 19.8 12 19.8C15.1 19.8 17.7 18.1 17.7 15.6V9.5Z'
// tassel: a cord dropping from under the right corner, and its bob
const CORD = 'M20.7 9V14.2'
const BOB = 'M20.7 13.2C21.7 13.2 22.2 15.4 22.2 17.4H19.2C19.2 15.4 19.7 13.2 20.7 13.2Z'
// the button at the board's centre
const BUTTON = 'M12.9 8.6A0.9 0.9 0 1 1 11.1 8.6A0.9 0.9 0 1 1 12.9 8.6Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'graduation-cap'
  const K = F.region(rings(BOARD), M0)
  const Ab = F.region(rings(SKULL), M0)
  F.strokes(lines(CORD), 1.5, M0, Ab)
  F.region(rings(BOB), M0, Ab)
  const Af = F.region(rings(BUTTON), M0)
  const Ls = layers(compose({ K, Af, Ab }))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
