// SKEUO people avatars: a small portrait bust in real materials instead of one lacquered body.
//
// The convention every per-icon palette and the site's skin-tone picker use (forge/styles/_people.mjs):
//   skin   c1, its soft light tint, its shade shadow: a satin, slightly translucent skin (the shading rolls
//          in the skin's own shade, a warm tint glows on the lit cheek)
//   hair   c2 (a turban or a cap too), shaded in ink, with the anisotropic sheen band real hair catches
//   cloth  c4, a matte knit
//   gear   accent (headphone cups), black satin plastic
// Each part is its own piece, lit on its own, with a contact shadow where it lies on the part painted before
// (hair over the forehead, the chin over the collar). Eyes are dark and glossy with a catch-light, so they
// read on light and deep skin alike; the mouth and parting lines are debossed.
import * as F from './_skeuo-field.mjs'
import { fillParts, tones } from './_people.mjs'
import { Out, piece, castShadow, contact, v } from './_skeuo-paint.mjs'

const INK = '#22160F', SHINE = '#FFFFFF'

// one signed field per part kind: a point belongs to the LAST skeleton fill holding it (hair over the forehead,
// clothing over the neck); a stroke's overhang outside every fill goes to the nearest fill
function parts(icon) {
  const kinds = fillParts(icon)
  const R = (icon.fills || []).map(f => {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2)
    return rings.length ? F.region(rings, 2.5) : F.field(9)
  })
  const n = R.length, NN = F.N * F.N, out = {}
  for (let i = 0; i < n; i++) {
    const c = kinds[i] || 'cloth', V = out[c] || (out[c] = F.field(9))
    for (let q = 0; q < NN; q++) {
      let mo = Infinity, ml = Infinity
      for (let j = 0; j < n; j++) if (j !== i) { const x = R[j][q]; if (x < mo) mo = x; if (j > i && x < ml) ml = x }
      const r = R[i][q]
      const u = Math.min(Math.max(r, -ml), Math.max(r - mo, -mo, r - 1.6))
      if (u < V[q]) V[q] = u
    }
  }
  return out
}

const disc = (cx, cy, r) => F.strokes([{ pts: [[cx, cy]] }], 2 * r, 1, F.field(1))

export function paintPerson(B, icon, T = {}) {
  const tn = tones(icon)
  const out = new Out()
  if (!B.sil || !tn) return []
  const ink = v('ink', INK), shine = v('shine', SHINE)
  const MAT = {
    skin: { role: 'c1', mat: { c: tn.c1, ink: INK, f: 'skin' }, opt: { shadePaint: v('shadow', tn.shadow), noHot: true } },
    hair: { role: 'c2', mat: { c: tn.c2, ink: INK, f: 'hair' }, opt: { shadePaint: ink } },
    cloth: { role: 'c4', mat: { c: tn.c4, ink: INK, f: 'fabric' }, opt: { shadePaint: ink } },
    gear: { role: 'accent', mat: { c: '#3B4049', ink: INK, f: 'satin' }, opt: { shadePaint: ink } },
  }
  MAT.wear = MAT.hair
  out.cls = 'wm-shadow'
  castShadow(out, B.sil, B.sil, T.shadow ?? 1)
  const mass = F.field(1)
  for (const k of ['body', 'back', 'front', 'lifted']) if (B[k]) F.union(mass, B[k])
  const PP = parts(icon)
  // the face's part is wm-k (the body); hair, headwear, clothing and gear are wm-a parts
  const CLS = { skin: 'wm-k', hair: 'wm-a', wear: 'wm-a', cloth: 'wm-a', gear: 'wm-a' }
  let so = null, rest = F.copy(mass)
  for (const c of ['cloth', 'skin', 'hair', 'wear', 'gear']) {
    if (!PP[c]) continue
    F.subtract(rest, PP[c])
    const raw = F.intersect(F.copy(mass), PP[c])
    if (!F.any(raw)) continue
    const P = F.exact(raw)
    const m = MAT[c]
    out.cls = CLS[c]
    if (so) contact(out, P, so, 0.55, 0.3)
    piece(out, P, m.role, m.mat, m.opt)
    if (c === 'skin') {
      // the warm glow of lit skin: the tint pooled on the upper-left of the face, and a faint shine on it
      const b = F.box(P), w = b.x1 - b.x0, h = b.y1 - b.y0
      const G = F.offset(F.copy(P), Math.min(1.1, Math.min(w, h) * 0.16))
      F.halfPlane(G, 1, 1, b.x0 + b.y0 + (w + h) * 0.5)
      out.fill(G, v('tint', tn.tint), 0.42, { shine: true })
    }
    so = so ? F.union(so, P) : F.copy(P)
  }
  if (F.any(rest)) { out.cls = 'wm-a'; const P = F.exact(rest); if (F.any(P)) piece(out, P, 'c4', MAT.cloth.mat, MAT.cloth.opt) }
  out.cls = 'wm-k'
  // eyes: glossy dark beads in the face, each with a catch-light up-left
  if (B.holes) {
    const E = F.intersect(F.copy(B.holes), F.offset(F.copy(PP.skin || mass), -0.3))
    if (F.any(E)) {
      out.fill(E, ink, 1, { dp: 2, tol: 0.03, min: 0.03 })
      for (const c of F.components(E)) {
        const w = c.x1 - c.x0, h = c.y1 - c.y0
        if (w < 0.3 || h < 0.3 || w > 3 || h > 3) continue
        out.fill(disc(c.x0 + w * 0.34, c.y0 + h * 0.3, Math.max(0.2, Math.min(w, h) * 0.24)), shine, 0.95, { dp: 2, tol: 0.03, min: 0.02 })
      }
    }
  }
  // debossed lines: the mouth, beard and hair partings
  if (B.grooves) {
    const G = B.grooves
    out.fill(G, ink, 0.78)
    const lip = F.subtract(F.move(G, 0.1, 0.32), G)
    F.intersect(lip, F.offset(F.copy(mass), 0.05))
    out.fill(lip, shine, 0.45)
  }
  // ornaments (a bow, a hair tie): lacquer in the clothing colour
  for (const k of ['badge', 'tubes']) if (B[k]) {
    out.cls = 'wm-s'
    contact(out, B[k], B.sil, 0.6, 0.28)
    piece(out, B[k], 'c4', { c: tn.c4, ink: INK, f: 'gloss' }, { noHot: true, shadePaint: ink })
  }
  return out.nodes
}
