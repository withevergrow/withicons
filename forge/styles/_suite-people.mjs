// SUITE people avatars (forge/styles/_people.mjs): the same flat planes with a gentle sheen, but in a person's colours.
//
//   SKIN    the face (and ears) in c1 with a calm diagonal gradient over it: tint at the top-left, shadow at the
//           bottom-right (so a palette's c1 / tint / shadow recolour the whole skin)
//   HAIR    c2 (or the headwear: turban, cap) with a sheen from shine down to c3, the hair shade
//   CLOTHES c4 with the usual shine / shadow sheen; headphone cups and band, clips: accent
//   FACE    eyes and mouth in ink (a dark brown by default) with a catch-light in each eye, so they read on deep skin;
//           glasses are fine ink frames round clear, glazed lenses
//
// Lines that only trace a fill's edge are dropped (the colour change draws them). Every colour is a role-named
// variable --with-suite-<role> with a per-person hex fallback.
import { distToPolyline, pointInRing, bbox, resample } from '../kernel/geom.mjs'
import * as F from './_suite-field.mjs'
import { fillParts, tones } from './_people.mjs'

const M = 1.4
const W = { INK: 1.15, FRAME: 0.95, DET: 0.95, GEAR: 1.75, S: 1.4 }
const INK = '#2B1D17'
const f2 = n => Math.round(n * 100) / 100
const dense = (pts, closed) => pts.length > 1 ? resample(pts, 0.25, closed).map(o => o.p) : pts
const inSet = (p, rings) => rings.reduce((a, r) => pointInRing(p, r) ? !a : a, false)

export function people(icon, name, accentHex = '#FF7A3D') {
  F.setClip(null)
  const t = tones(icon)
  const parts = fillParts(icon)
  const pc = (r, hex) => `var(--with-suite-${r}, ${hex})`
  const fills = (icon.fills || []).map(f => (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2))
  const allRings = fills.flat()
  // the part under a point: the last fill containing it (paint order)
  const partOf = p => { for (let i = fills.length - 1; i >= 0; i--) if (inSet(p, fills[i])) return parts[i]; return null }
  const majority = pts => {
    const n = {}
    for (const p of pts) { const k = partOf(p) || 'none'; n[k] = (n[k] || 0) + 1 }
    return Object.entries(n).sort((a, b) => b[1] - a[1])[0][0]
  }
  const onEdge = (pts, closed) => { const P = dense(pts, closed); return P.filter(p => allRings.some(r => distToPolyline(p, r, true) < 0.3)).length / P.length > 0.7 }

  const ink = F.field(M), frame = F.field(M), lens = F.field(M), gear = F.field(M), sBar = F.field(M)
  const hairDet = F.field(M), clothDet = F.field(M), skinLight = F.field(M)
  const eyes = []
  const lines = (icon.lines || []).filter(l => l.pts && l.pts.length)
  const lensLines = lines.filter(l => {
    if (l.plate !== 'A' || !l.closed || l.pts.length < 3) return false
    const b = bbox(l.pts), cx = (b.x0 + b.x1) / 2
    return b.w > 2.8 && b.w < 5.2 && b.h > 2.8 && b.h < 4.6 && cx > 6.5 && cx < 17.5 && b.y0 > 8.5 && b.y1 < 14.5
  })
  for (const l of lines) {
    if (lensLines.includes(l)) { F.strokes([l], W.FRAME, M, frame); F.region([l.pts], M, lens); continue }
    if (l.plate === 'S') { F.strokes([l], W.S, M, sBar); continue }
    if (onEdge(l.pts, l.closed)) continue
    const P = dense(l.pts, l.closed), part = majority(P)
    if (part === 'none') { if (l.plate === 'A') F.strokes([l], W.GEAR, M, gear); continue } // a headphone band; a stray K contour goes
    if (part === 'skin') {
      const nearLens = lensLines.some(o => P.every(p => distToPolyline(p, o.pts, true) < 1.2))
      if (l.plate === 'K') F.strokes([l], W.INK, M, ink)
      else if (nearLens) F.strokes([l], W.FRAME, M, frame)
      else F.strokes([l], W.DET, M, skinLight) // a highlight on a bald scalp
      continue
    }
    F.strokes([l], W.DET, M, part === 'cloth' ? clothDet : part === 'gear' ? gear : hairDet)
  }
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || s.pts.length < 2) continue
    if (s.closed && s.pts.length > 2) {
      const b = bbox(s.pts)
      if (b.w < 2.2 && b.h < 2.2 && partOf([(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2]) === 'skin') {
        F.region([s.pts], M, ink)
        eyes.push(b)
      }
      continue
    }
    // an open cut inside hair that no line draws (a mouth in a beard): a light parting
    const P = dense(s.pts, false)
    if (onEdge(s.pts, false)) continue
    if (lines.some(l => P.filter(p => distToPolyline(p, l.pts, l.closed) < 0.3).length > 0.6 * P.length)) continue
    const part = majority(P)
    if (part === 'hair' || part === 'wear') F.strokes([{ pts: s.pts, closed: false }], W.DET, M, skinLight)
  }

  // ---- paint
  const recs = [], defs = []
  let gN = 0
  const put = (Fd, a) => { if (Fd && F.any(Fd)) recs.push({ Fd, a }) }
  const bboxOf = Fd => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (Fd[j * F.N + i] < 0) {
      const x = i * F.H, y = j * F.H
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
    }
    return x0 === Infinity ? null : [x0, y0, x1, y1]
  }
  const grad = (Fd, stops) => {
    const bb = bboxOf(Fd)
    if (!bb) return null
    const id = `wg-suite-${name}-${gN++}`
    defs.push(['linearGradient', { id, x1: f2(bb[0]), y1: f2(bb[1]), x2: f2(bb[2]), y2: f2(bb[3]), gradientUnits: 'userSpaceOnUse' },
      stops.map(([o, c, op]) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': op }])])
    return `url(#${id})`
  }
  const SKIN = [[0, pc('tint', t.tint), 0.75], [0.48, pc('tint', t.tint), 0], [0.52, pc('shadow', t.shadow), 0], [1, pc('shadow', t.shadow), 0.5]]
  const HAIR = [[0, pc('shine', '#FFFFFF'), 0.3], [0.5, pc('shine', '#FFFFFF'), 0], [0.5, pc('c3', t.c3), 0], [1, pc('c3', t.c3), 0.55]]
  const SHEEN = [[0, pc('shine', '#FFFFFF'), 0.3], [0.5, pc('shine', '#FFFFFF'), 0], [0.5, pc('shadow', t.shadow), 0], [1, pc('shadow', t.shadow), 0.2]]
  const LOOK = {
    skin: [pc('c1', t.c1), SKIN, 'wm-k'], hair: [pc('c2', t.c2), HAIR, 'wm-a'], wear: [pc('c2', t.c2), HAIR, 'wm-a'],
    cloth: [pc('c4', t.c4), SHEEN, 'wm-a'], gear: [pc('accent', accentHex), SHEEN, 'wm-a'],
  }
  // the skin is one plane (face, neck and ears): its gradient spans all of it
  const skinAll = F.field(M)
  fills.forEach((r, i) => { if (parts[i] === 'skin') F.region(r, M, skinAll) })
  let skinDone = false
  fills.forEach((r, i) => {
    const part = parts[i] || 'skin'
    const [base, stops, cls] = LOOK[part] || LOOK.skin
    if (part === 'skin') {
      if (skinDone) return
      skinDone = true
      put(skinAll, { fill: base, class: cls })
      const g = grad(skinAll, stops)
      if (g) put(skinAll, { fill: g, class: cls })
      put(skinLight, { fill: pc('tint', t.tint), 'fill-opacity': 0.85, class: cls })
      return
    }
    const Fd = F.region(r, M)
    put(Fd, { fill: base, class: cls })
    const g = grad(Fd, stops)
    if (g) put(Fd, { fill: g, class: cls })
    if (part === 'cloth') put(F.intersect(F.copy(clothDet), F.offset(F.copy(Fd), 0.3)), { fill: pc('shadow', t.shadow), 'fill-opacity': 0.4, class: cls })
    else if (part === 'hair' || part === 'wear') put(F.intersect(F.copy(hairDet), F.offset(F.copy(Fd), 0.3)), { fill: pc('c3', t.c3), 'fill-opacity': 0.75, class: cls })
  })
  put(gear, { fill: pc('accent', accentHex), class: 'wm-a' })
  put(lens, { fill: pc('shine', '#FFFFFF'), 'fill-opacity': 0.5, class: 'wm-a' })
  put(F.union(F.copy(ink), frame), { fill: pc('ink', INK), class: 'wm-k' })
  if (eyes.length) {
    const glint = F.field(M)
    for (const b of eyes) F.strokes([{ pts: [[b.x0 + b.w * 0.34, b.y0 + b.h * 0.3]], closed: false }], Math.max(0.36, Math.min(b.w, b.h) * 0.36), M, glint)
    put(glint, { fill: pc('shine', '#FFFFFF'), class: 'wm-k' })
  }
  put(sBar, { fill: pc('accent', accentHex), class: 'wm-s' })
  return { recs, defs }
}
