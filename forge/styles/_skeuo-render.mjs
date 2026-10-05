// SKEUO composer: pieces (_skeuo-core) + materials (_skeuo-mat) + light (_skeuo-paint)
// -> IconNodes, back to front.
import * as F from './_skeuo-field.mjs'
import { build } from './_skeuo-core.mjs'
import { materials, MAT } from './_skeuo-mat.mjs'
import { Out, piece, castShadow, contact, farBand, litBand, v, L } from './_skeuo-paint.mjs'
import { tune, redraw } from './_skeuo-tune.mjs'

const SHADOW = '#15110D', SHINE = '#FFFFFF'
// enamel status buttons: their glyph is a raised white inlay, not a debossed groove
const EMBOSS = /^(alert-circle|check-circle|check-square|x-circle|help-circle|info-circle|plus-circle|minus-circle|square-(plus|minus|x)|circle-(arrow|chevron|play|pause|stop)(-.*)?|badge-check|badge-percent|shield-check|ban|accessibility|user-circle)$/

// Live icons that letter a value (opt.lettered): their surfaces keep a softer gloss and no glint, so the
// lettering set on them later reads edge to edge at 24px (the same at every value: the text is never consulted)
const SOFT = { specK: 0.35, noHot: true }
export function draw(icon, opt = {}) {
  let T = tune(icon)
  if (opt.lettered) T = { ...T, bodyOpt: { ...SOFT, ...(T.bodyOpt || {}) }, badgeOpt: { ...SOFT, ...(T.badgeOpt || {}) }, zones: (T.zones || []).map(z => ({ ...z, opt: { ...SOFT, ...(z.opt || {}) } })), inlayOpt: SOFT }
  if (EMBOSS.test(icon.name) && !T.grooveAs) T = { grooveAs: 'emboss', groove: 1.5, ...T }
  const custom = redraw(icon, T)
  if (custom) return custom
  const M = materials(icon, T)
  if (M.names.body === 'graphite' && T.screen !== false) T = { screen: true, ...T }
  const B = build(icon, T)
  return paint(B, M, T)
}

// a camera lens: a polished chrome bezel round a deep glass element, with a coated
// inner ring and a specular dot, so it reads against a dark body and a dark page alike
function lens(out, S, opt) {
  const shadow = v('shadow', SHADOW), shine = v('shine', SHINE)
  const disc = F.fillHoles(F.copy(S), 80)
  const b = F.box(disc), cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, r = (b.x1 - b.x0) / 2
  const dot = (x, y, rr) => F.strokes([{ pts: [[x, y]] }], 2 * rr, 1, F.field(1))
  // a lens broken by a slash (camera-off) is no longer a disc: keep just its chrome
  if (F.inkArea(disc) < 0.85 * Math.PI * r * r) {
    out.fill(F.offset(F.move(S, 0.12, 0.4), -0.05), shadow, 0.35)
    piece(out, S, 'c2', MAT.steel, { noHot: true, noBrush: true })
    return
  }
  out.fill(F.offset(F.move(disc, 0.12, 0.4), -0.05), shadow, 0.35)
  piece(out, disc, 'c2', MAT.steel, { noHot: true, noBrush: true, thin: false })
  const bezel = opt.bezel ?? Math.max(0.75, r * 0.24)
  const glass = F.offset(F.copy(disc), bezel)
  if (!F.any(glass)) return
  // the glass sits inside the barrel: a dark lip where the bezel steps down
  out.fill(F.offset(F.copy(glass), -0.22), v('ink', '#0E141C'), 0.85)
  out.fill(glass, v('c4', '#141C28'), 1, { dp: 2, tol: 0.035 })
  const gr = r - bezel
  // coated element: a violet-blue ring, then the dark pupil
  const coat = F.subtract(F.offset(F.copy(glass), 0.28), F.offset(F.copy(glass), Math.max(0.6, gr * 0.42)))
  out.fill(coat, v('accent', '#3D5F9C'), 0.75)
  out.fill(farBand(glass, Math.max(0.35, gr * 0.22)), v('accent', '#5B7FC0'), 0.5)
  out.fill(litBand(glass, 0.4), shadow, 0.5)
  // specular: a hard dot up-left and a faint bounce down-right
  out.fill(dot(cx - gr * 0.38, cy - gr * 0.38, Math.max(0.42, gr * 0.2)), shine, 0.95)
  out.fill(dot(cx + gr * 0.36, cy + gr * 0.4, Math.max(0.24, gr * 0.1)), shine, 0.45)
}

function zoneField(body, z) {
  const G = F.copy(body)
  if (z.y0 != null) F.halfPlane(G, 0, -1, -z.y0)
  if (z.y1 != null) F.halfPlane(G, 0, 1, z.y1)
  if (z.x0 != null) F.halfPlane(G, -1, 0, -z.x0)
  if (z.x1 != null) F.halfPlane(G, 1, 0, z.x1)
  return G
}

export function paint(B, M, T = {}) {
  const out = new Out()
  const shadow = v('shadow', SHADOW), shine = v('shine', SHINE)
  if (!B.sil) return []
  // motion parts: plates are tagged only when the object has more than one (a lone body
  // stays untagged, which motion reads as wm-k); a contact shadow goes with the piece casting it
  const multi = !!(B.back || B.front || B.badge || B.tubes || (B.lifted && B.liftPlate !== 'K'))
  const K_ = multi ? 'wm-k' : null, A_ = 'wm-a', S_ = 'wm-s', L_ = multi ? { K: 'wm-k', A: 'wm-a', S: 'wm-s' }[B.liftPlate] || K_ : null
  // ground shadow
  out.cls = 'wm-shadow'
  castShadow(out, B.sil, B.sil, T.shadow ?? 1)

  // parts behind the body
  if (B.back) {
    out.cls = A_
    piece(out, B.back, 'c2', M.part, T.backOpt)
    out.cls = K_
    if (B.body) contact(out, B.body, B.back, 0.7, 0.32)
  }
  out.cls = K_
  // the body; the inner wall of every hole shows the material's thickness
  if (B.body) {
    let P = B.body
    if (B.holes) {
      const wall = F.intersect(F.move(B.body, 0, 0.6), F.copy(B.holes))
      if (F.any(wall)) {
        P = F.union(F.copy(B.body), wall)
        piece(out, P, 'c1', M.body, T.bodyOpt)
        out.fill(F.offset(wall, -0.05), shadow, 0.42)
      } else piece(out, P, 'c1', M.body, T.bodyOpt)
    } else piece(out, P, 'c1', M.body, T.bodyOpt)
    // zones: a band of the body in another material (calendar header, file label...)
    for (const z of T.zones || []) {
      const G = zoneField(B.body, z)
      if (F.any(G)) piece(out, G, z.role || 'c3', MAT[z.mat] || M.sig, { noEdge: true, noHot: true, ...(z.opt || {}) })
    }
  }
  // inlay: a recessed face of another material (a lens, a clock face)
  if (T.inlay && B.body) {
    const G = F.offset(F.copy(B.body), T.inlay.inset ?? 1.15)
    if (F.any(G)) {
      piece(out, G, 'c4', MAT[T.inlay.mat] || M.screen, { ...(T.inlayOpt || {}), ...(T.inlay.opt || {}) })
      out.fill(litBand(G, 0.5), shadow, 0.3)
    }
  }
  // decals: raised coloured shapes on the surface
  const DROLE = ['c3', 'c4', 'accent']
  ;(B.decals || []).forEach((d, i) => {
    contact(out, d.f, B.body || B.sil, 0.45, 0.22)
    piece(out, d.f, DROLE[i] || 'c3', MAT[d.mat] || M.sig, { noHot: true, noStitch: true, noGrain: true })
  })
  // screens: inlaid glass, recessed (inner shadow on top), a lip of light at the bottom
  if (B.screens && T.lens) lens(out, B.screens, T.lens)
  else if (B.screens) {
    const S = B.screens
    out.fill(S, v('c4', M.screen.c), 1, { dp: 2, tol: 0.035 })
    const refl = F.copy(S)
    const b = F.box(S)
    F.halfPlane(refl, 1, 0.8, b.x0 + (b.x1 - b.x0) * 0.62 + 0.8 * b.y0)
    out.fill(refl, shine, 0.13)
    out.fill(litBand(S, 0.55), shadow, 0.45)
    out.fill(farBand(S, 0.35), shine, 0.3)
  }
  // grooves: debossed print / seams, with a lit lower lip; inside a zone marked
  // text: 'white' (a calendar's red header) the print is a raised white inlay instead
  if (B.grooves) {
    const surf = B.body || B.front
    const emboss = G => {
      // raised white enamel inlay (a status glyph): a shadow below, the glyph, a lit top edge
      const sh = F.subtract(F.move(G, 0.12, 0.38), G)
      if (surf) F.intersect(sh, F.offset(F.copy(surf), 0.05))
      out.fill(sh, shadow, 0.3)
      out.fill(G, v('tint', '#FFFFFF'), 1, { dp: 2, tol: 0.035 })
      out.fill(farBand(G, 0.3), shadow, 0.12)
    }
    const deboss = G => {
      const glint = T.grooveAs === 'shine'
      out.fill(G, glint ? shine : v('ink', (T.inlay && MAT[T.inlay.mat] || M.body).ink), glint ? 0.9 : (T.grooveOp ?? 0.78))
      if (surf && !glint) {
        const lip = F.subtract(F.move(G, 0.1, 0.32), G)
        F.intersect(lip, F.offset(F.copy(surf), 0.05))
        out.fill(lip, shine, 0.55)
      }
    }
    const zt = B.body && T.grooveAs !== 'emboss' ? (T.zones || []).filter(z => z.text === 'white') : []
    if (zt.length) {
      const Z = F.field(1)
      for (const z of zt) F.union(Z, zoneField(B.body, z))
      const inZ = F.intersect(F.copy(B.grooves), Z), outZ = F.subtract(F.copy(B.grooves), Z)
      if (F.any(outZ)) deboss(outZ)
      if (F.any(inZ)) emboss(inZ)
    } else if (T.grooveAs === 'emboss') emboss(B.grooves)
    else deboss(B.grooves)
  }
  // printed payload (a file's type glyph): coloured ink, slightly raised
  if (B.prints) {
    const G = B.prints
    out.fill(G, v('c3', (MAT[T.print] || M.sig).c), 1, { dp: 2, tol: 0.035 })
    out.fill(farBand(G, 0.3), shadow, 0.16)
    out.fill(litBand(G, 0.25), shine, 0.4)
  }
  // parts in front of the body
  if (B.front) {
    out.cls = A_
    if (B.body) contact(out, B.front, B.body, 0.65, 0.3)
    piece(out, B.front, 'c2', M.part, T.frontOpt)
  }
  // lifted pieces: raised off the surface, casting a shadow onto it
  if (B.lifted) {
    out.cls = L_
    contact(out, B.lifted, B.sil, 0.6, 0.3)
    piece(out, B.lifted, 'c3', MAT[T.liftMat] || M.sig, { noHot: true, ...(T.liftOpt || {}) })
  }
  // badges: enamel discs with an embossed glyph
  if (B.badge) {
    out.cls = S_
    contact(out, B.badge, B.sil, 0.6, 0.28)
    piece(out, B.badge, 'c3', M.sig, { noHot: true, ...(T.badgeOpt || {}) })
    if (B.marks) {
      const sh = F.subtract(F.move(B.marks, 0.1, 0.35), B.marks)
      F.intersect(sh, F.copy(B.badge))
      out.fill(sh, shadow, 0.35)
      out.fill(B.marks, v('tint', '#FFFFFF'), 1, { dp: 2, tol: 0.035 })
    }
  }
  if (B.tubes) {
    out.cls = S_
    contact(out, B.tubes, B.sil, 0.6, 0.28)
    piece(out, B.tubes, 'c3', M.sig, { noHot: true, ...(T.tubeOpt || {}) })
  }
  return out.nodes
}
