// forge/hand/chrome/lightbulb.mjs — a big polished chrome glass globe with a dark gunmetal filament (wm-a, it
// flickers) set in a seam inside it, on a compact gunmetal screw base of two thread bands and a contact tip. The
// generated bulb cut its filament and base as pale grooves and gave the base its own chrome horizon, so globe and base
// washed out into a ghost of a bulb. Painted with the style's own layer recipe (_chrome-core).
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

function compose({ K, Af = null, Ab = null, txt = null }) {
  let K0 = F.copy(K), seam = null
  if (has(Af)) { const g = F.offset(F.copy(Af), -0.42); seam = F.intersect(F.copy(g), K); K0 = minus(K0, g) }
  const sil = F.copy(K)
  if (has(Af)) F.union(sil, Af)
  if (has(Ab)) F.union(sil, Ab)
  const round = x => has(x) ? F.open(F.copy(x), 0.32) : null
  return { T: {}, K: round(K0), Af: round(Af), Ab: round(Ab), S: null, sil, txt, seam }
}

// the glass globe, pinching into a neck
const GLOBE = 'M8.9 15.4C8.9 13.6 4.9 12.4 4.9 8.9A7.1 7.1 0 0 1 19.1 8.9C19.1 12.4 15.1 13.6 15.1 15.4Z'
// the screw base: a collar tucked under the neck, a second thread band and the contact tip
const COLLAR = 'M8.6 14.4H15.4V16.8C15.4 17.4 15 17.8 14.4 17.8H9.6C9 17.8 8.6 17.4 8.6 16.8Z'
const BAND = 'M9.1 18.8C9.1 18.45 9.4 18.2 9.8 18.2H14.2C14.6 18.2 14.9 18.45 14.9 18.8V19.3C14.9 19.75 14.6 20 14.2 20' +
  'H13.2V20.7C13.2 21.4 12.7 21.9 12 21.9C11.3 21.9 10.8 21.4 10.8 20.7V20H9.8C9.4 20 9.1 19.75 9.1 19.3Z'
// the filament: a Y on a short stem
const FILAMENT = 'M12 13.7V12.4M9.7 10.1L12 12.4L14.3 10.1'

export default function render(icon) {
  const name = (icon && icon.name) || 'lightbulb'
  const K = F.region(rings(GLOBE), M0)
  const Ab = F.region(rings(COLLAR), M0)
  F.region(rings(BAND), M0, Ab)
  const Af = F.strokes(lines(FILAMENT), 1.5, M0)
  const M = compose({ K, Af, Ab })
  const Ls = layers(M)
  // the screw base is painted as gunmetal but belongs to the body: only the filament moves (parts.A)
  const nb = layers({ ...M, K: null, Af: null, seam: null }).list.length - 1
  for (let i = 1; i <= nb; i++) if (Ls.list[i].cls === 'wm-a') Ls.list[i].cls = 'wm-k'
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
