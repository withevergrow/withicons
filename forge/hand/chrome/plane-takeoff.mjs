// forge/hand/chrome/plane-takeoff.mjs — a polished chrome airliner climbing away to the upper right: a fat chrome
// fuselage capsule laid over swept gunmetal wings and tail fins with clear notches between them, above a slim gunmetal
// runway bar with open air in between. The generator inflated the whole silhouette as one tube, so wings, tail and
// fuselage fused into a blob and the runway sat hard under it at 24 and 16px. Same layer recipe as the generator.
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// the plane is drawn level (t along the fuselage to the nose, s across it) and pitched up by the climb angle
const A = -28 * Math.PI / 180, O = [4.5, 13.2]
const U = [Math.cos(A), Math.sin(A)], NV = [-Math.sin(A), Math.cos(A)]
const at = (t, s) => tf([O[0] + t * U[0] + s * NV[0], O[1] + t * U[1] + s * NV[1]])
const poly = pts => [pts.map(([t, s]) => at(t, s))]
const reg = (pts, into = null) => F.region(poly(pts), M0, into)
// a round end cap from angle a0 to a1 about (t, s), radius r, in level coordinates
const cap = (t, s, r, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, i) => {
  const a = a0 + (a1 - a0) * i / n
  return [t + r * Math.cos(a), s + r * Math.sin(a)]
})
const PI = Math.PI

// fuselage: a capsule, round nose, the tail end tapered a little
const BODY = [[0, -1.4], [15, -2], ...cap(15, 0, 2, -PI / 2, PI / 2), [0, 1.4], ...cap(0, 0, 1.4, PI / 2, 1.5 * PI)]
// main wings: swept back, round tips, roots hidden under the fuselage
const WING = s => [[11.25, 0], [6.6, s * 7.5], ...cap(5.4, s * 7.5, 1.2, 0, s > 0 ? PI : -PI, 8), [6.25, 0]]
// tail fins: small, swept the same way
const FIN = s => [[3.5, 0], [1.4, s * 3.6], ...cap(0.5, s * 3.6, 0.9, 0, s > 0 ? PI : -PI, 6), [0.4, 0]]
// runway: a slim bar along the ground
const RUNWAY = [[3, 21.25], [21, 21.25]]

export default function render(icon) {
  const name = (icon && icon.name) || 'plane-takeoff'
  const body = reg(BODY)
  const wings = reg(WING(1)); reg(WING(-1), wings); reg(FIN(1), wings); reg(FIN(-1), wings)
  const Ab = F.open(wings, 0.3)
  const K = F.open(body, 0.32)
  const runway = F.strokes([{ pts: RUNWAY.map(tf), closed: false }], 1.7, M0)
  const sil = F.copy(K); F.union(sil, Ab); F.union(sil, runway)

  const Lp = layers({ T: {}, K, Af: null, Ab, S: null, sil, txt: null, seam: null })
  const Lr = layers({ T: { noGlint: true }, K: null, Af: null, Ab: runway, S: null, sil, txt: null, seam: null })
  // the plane climbs as one (wm-k); the runway streams past below (the A part)
  const plane = Lp.list.map(l => ({ ...l, cls: l.cls === 'wm-shine' || l.cls === 'wm-shadow' ? l.cls : 'wm-k' }))
  const road = Lr.list.filter(l => l.cls !== 'wm-shadow').map(l => ({ ...l, cls: 'wm-a' }))
  const Ls = { list: [...plane, ...road], glint: Lp.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
