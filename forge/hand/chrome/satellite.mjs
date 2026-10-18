// forge/hand/chrome/satellite.mjs — a chunky satellite on the diagonal: a solid chrome body on a thick gunmetal boom
// between two broad gunmetal solar panels (each with an engraved centre seam), a deep chrome dish bowl on a short
// stem facing down-left with its dark open mouth and a feed point, and one slim long enamel signal arc concentric with
// the dish rim. The generated drawing thinned the panels into faceted rods and shrank the dish to a sliver; the first
// redraw's dish was a flat half-moon with a pink banana beside it. Painted with the style's own layer recipe (_chrome-core).
import { area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const loopsOf = Fd => F.contour(Fd).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04)

// a frame on the diagonal: u runs down-right along the panels, v up-right (skeleton units)
const CX = 13, CY = 11, Q = Math.SQRT1_2
const at = (u, v) => [CX + (u + v) * Q, CY + (u - v) * Q]
// a rounded rectangle u0..u1 x v0..v1 in the frame, as a ring
function box(u0, u1, v0, v1, r) {
  const pts = [], arc = (cu, cv, a0) => { for (let i = 0; i <= 6; i++) { const a = (a0 + 90 * i / 6) * Math.PI / 180; pts.push(at(cu + r * Math.cos(a), cv + r * Math.sin(a))) } }
  arc(u1 - r, v1 - r, 0); arc(u0 + r, v1 - r, 90); arc(u0 + r, v0 + r, 180); arc(u1 - r, v0 + r, 270)
  return pts.map(tf)
}
const seg = (a, b) => ({ pts: [a, b].map(tf), closed: false })
// an elliptical arc about (cu, cv) in the frame with radii ru (along u) and rv (along v), angles from +u towards +v
function arc(cu, cv, ru, rv, a0, a1, n = 18) {
  const pts = []
  for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; pts.push(at(cu + ru * Math.cos(a), cv + rv * Math.sin(a))) }
  return pts
}

const BODY = 2.85, P0 = 3.9, P1 = 9.7, PW = 3.3  // body half-size; panel span along u and half-width
const BOOM = 2.25, STEM = 2.0, SEAM = 0.6        // boom and stem widths, the engraved panel seam
const DR = 3.6, DE = 1.8, DV = -7.6              // dish radius, depth of its open mouth (ellipse), rim line (v)
const SC = DV + 1.0, SR = 5.0, SW = 1.6          // signal arc centre (v), radius and width: hugging the mouth

export default function render(icon) {
  const name = (icon && icon.name) || 'satellite'
  // chrome: the body and the dish (its round back towards the body, its open mouth an ellipse facing down-left)
  const Kf = F.region([box(-BODY, BODY, -BODY, BODY, 0.9)], M0)
  F.region([[...arc(0, DV, DR, DR, 0, 180, 20), ...arc(0, DV, DR, DE, 180, 360, 20)].map(tf)], M0, Kf)
  const K = F.open(Kf, 0.32)
  // gunmetal behind: two broad solar panels close to the body, the thick boom and the dish stem
  const Pf = F.region([box(P0, P1, -PW, PW, 0.7)], M0)
  F.region([box(-P1, -P0, -PW, PW, 0.7)], M0, Pf)
  const Ab = F.strokes([seg(at(-P0 - 0.8, 0), at(P0 + 0.8, 0))], BOOM, M0)
  F.strokes([seg(at(0, -BODY + 0.5), at(0, DV + DR - 0.5))], STEM, M0, Ab)
  F.union(Ab, Pf)
  const A = F.open(Ab, 0.32)
  // one slim enamel signal arc, concentric with the dish rim, sweeping 120 degrees beyond it
  const Sf = F.strokes([{ pts: arc(0, SC, SR, SR, 210, 330, 24).map(tf), closed: false }], SW, 1.15)
  const sil = F.copy(Kf); F.union(sil, Ab); F.union(sil, Sf)
  const Ls = layers({ T: {}, K, Af: null, Ab: A, S: Sf, sil, txt: null, seam: null })
  // the dish's dark open mouth, inside a thin chrome lip
  const mouth = F.region([arc(0, DV, DR - 0.5, DE - 0.45, 0, 360, 32).map(tf)], M0)
  const ml = loopsOf(mouth)
  if (ml.length) Ls.list.push({ loops: ml, fill: col('c3'), cls: 'wm-k', q: 'body' })
  // the feed point: a short chrome strut and knob rising out of the mouth
  const feed = F.strokes([seg(at(0, DV), at(0, DV - 1.2))], 0.9, M0)
  F.region([arc(0, DV - 1.4, 0.65, 0.65, 0, 360, 16).map(tf)], M0, feed)
  const fl = layers({ T: { noGlint: true }, K: feed, Af: null, Ab: null, S: null, sil: feed, txt: null, seam: null }).list
    .filter(L => L.cls !== 'wm-shadow').map(L => ({ ...L, cls: L.cls === 'wm-shine' ? L.cls : 'wm-k' }))
  // an engraved dark seam along each panel's centre, so they read as solar arrays (on top of the gunmetal layers)
  const sl = loopsOf(F.strokes([seg(at(P0 + 0.75, 0), at(P1 - 0.75, 0)), seg(at(-P1 + 0.75, 0), at(-P0 - 0.75, 0))], SEAM, M0))
  const list = [...Ls.list]
  const firstK = list.findIndex(L => L.cls === 'wm-k')
  if (sl.length) list.splice(firstK < 0 ? list.length : firstK, 0, { loops: sl, fill: col('ink'), cls: 'wm-a', op: 0.9, q: 'body' })
  // the mouth and feed sit on the dish, in front of the body layers but behind the signal
  const firstS = list.findIndex(L => L.cls === 'wm-s')
  const front = [...fl]
  const at0 = firstS < 0 ? list.length : firstS
  list.splice(at0, 0, ...front)
  // move the mouth (pushed at the end) to sit just before the feed
  const mi = list.findIndex(L => L.fill === col('c3') && L.cls === 'wm-k' && L.loops === ml)
  if (mi >= 0) { const [m] = list.splice(mi, 1); list.splice(list.indexOf(front[0]), 0, m) }
  const out0 = { list, glint: Ls.glint }
  let out = emit(out0, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(out0, name, t)
  return out
}
