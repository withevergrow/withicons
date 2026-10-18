// forge/hand/chrome/hammer.mjs — a polished chrome claw hammer on the diagonal: a compact head with a blunt square
// striking face top-left and a shorter forked claw split from the handle by an open V notch, on a long slim handle. The
// generated head was a fat bent bar nearly as long as the stubby handle, so at 16px it read as an axe or a pick.
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
const r2 = v => Math.round(v * 100) / 100

function compose({ K, Af = null, Ab = null }) {
  let K0 = F.copy(K), seam = null
  if (has(Af)) { const g = F.offset(F.copy(Af), -0.42); seam = F.intersect(F.copy(g), K); K0 = minus(K0, g) }
  const sil = F.copy(K)
  if (has(Af)) F.union(sil, Af)
  if (has(Ab)) F.union(sil, Ab)
  const round = x => has(x) ? F.open(F.copy(x), 0.32) : null
  return { T: {}, K: round(K0), Af: round(Af), Ab: round(Ab), S: null, sil, txt: null, seam }
}

// hammer frame: a along the handle (down-left), b along the head (down-right), from the head's centre C
const C = [15.5, 9], Q = Math.SQRT1_2
const P = (a, b) => `${r2(C[0] - a * Q + b * Q)} ${r2(C[1] + a * Q + b * Q)}`
// head: a blunt square striking block (flat face, 3.8u across), a straight neck, and a shorter claw curling tight
// toward the handle with a forked tip; the claw's inner edge stands 2u+ off the handle so the V notch stays open
const HEAD = `M${P(-1.9, -6.2)}L${P(-1.9, -4.6)}L${P(-1.6, -4.2)}L${P(-1.6, 2.2)}` +
  `C${P(-1.6, 4.6)} ${P(0.4, 6.4)} ${P(3.2, 6.5)}L${P(3.1, 5.8)}L${P(2, 5.4)}L${P(3, 5)}L${P(3, 4.1)}` +
  `C${P(2.2, 3.9)} ${P(1.6, 3.6)} ${P(1.6, 3.1)}L${P(1.6, -4.2)}L${P(1.9, -4.6)}L${P(1.9, -6.2)}Z`
// handle: one slim capsule from under the head to the grip end
const HANDLE = `M${P(0.5, 0)}L${P(16, 0)}`

export default function render(icon) {
  const name = (icon && icon.name) || 'hammer'
  const K = F.region(rings(HEAD), M0)
  const Ab = F.strokes(lines(HANDLE), 3, M0)
  const Ls = layers(compose({ K, Ab }))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
