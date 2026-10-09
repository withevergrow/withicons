// COQUETTE people: the 20 person avatars dressed coquette-soft. Skin is skin (a soft, faintly blushed satin in a
// spread of tones light to deep), hair is satin in a natural hair colour, clothes a pastel satin, and the style's
// charm stays: a ribbon-red satin bow tied in the hair (and ribbon ties where the skeleton has them).
//
// Roles (forge/styles/_people.mjs convention): face, ears, neck paint c1 with its satin ramp in tint and its shade in
// shadow; hair / headwear c2 shaded c3; clothing c4; the bow, the ties and headphone cups accent. Eyes are wine-berry
// with a white catch-light, so they read on deep skin too; the mouth is a wine line on light skin and a tint line on
// deep skin. The fallback hexes are the person's own tones (personHex); the role variables stay, so a per-icon
// palette or the skin-tone picker recolours every part.
import { distToPolyline, area as ringArea, arclen, resample, bbox } from '../kernel/geom.mjs'
import * as F from './_coquette-field.mjs'
import * as K from './_coquette-kit.mjs'
import { skeleton } from './_coquette-auto.mjs'
import { isPerson, tones, skinIndex, fillParts, mix } from './_people.mjs'

const MAT = { skin: 'skin', hair: 'hair', wear: 'hair', cloth: 'cloth', gear: 'bowp' }
const PLATE = { skin: 'K', hair: 'A', wear: 'A', cloth: 'A', gear: 'A' }
const DEEP = 4

const sample = (f, p) => { const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H); return i < 0 || j < 0 || i >= F.N || j >= F.N ? 9 : f[j * F.N + i] }
const dense = (pts, closed) => { const r = resample(pts, 0.3, closed).map(o => o.p); return r.length ? r : pts }

export function people(icon) {
  if (!isPerson(icon)) return null
  const sk = skeleton(icon)
  const parts = fillParts(icon)
  const deep = skinIndex(icon) >= DEEP
  const fills = sk.fills.map(rings => F.region(rings, 2.4))
  // the fill a point sits in (last wins), or -1
  const ownerAt = p => { for (let i = fills.length - 1; i >= 0; i--) if (sample(fills[i], p) < 0) return i; return -1 }
  const partAt = p => { const i = ownerAt(p); return i < 0 ? null : parts[i] }
  const rings = sk.fills.flat()
  const edgeDist = p => Math.min(...rings.map(r => distToPolyline(p, r, true)))
  const mass = F.field(2.4)
  for (const f of fills) F.union(mass, f)
  const frac = (P, test) => P.length ? P.filter(test).length / P.length : 0
  const nearestPart = P => {
    let best = Infinity, k = 'hair'
    sk.fills.forEach((rs, i) => { for (const q of P) for (const r of rs) { const d = distToPolyline(q, r, true); if (d < best) { best = d; k = parts[i] } } })
    return k
  }

  const out = []
  const lines = sk.lines.filter(l => !l.dot && l.pts.length > 1)
  // 1. tubes off every fill (a headphone band, a baby's curl): behind the head, in the nearest part's satin
  const off = lines.filter(l => l.plate !== 'S' && frac(dense(l.pts, l.closed), p => sample(mass, p) > 0.35) > 0.55)
  for (const l of off) {
    const k = nearestPart(l.pts)
    out.push({ f: F.strokes([l], k === 'gear' ? 2.2 : 1.9, 2.4), mat: MAT[k] || 'hair', plate: 'A', ow: 0.5 })
  }
  // 2. every fill, back to front (face, then hair over it, clothes, cups), grown by half a stroke
  fills.forEach((f, i) => {
    const k = parts[i]
    out.push({ f: K.grow(f, 0.5), mat: MAT[k] || 'skin', plate: PLATE[k] || 'K', ow: k === 'skin' ? 0.6 : 0.62 })
  })
  // 3. glasses: A rings on the bare face are lenses (lace, see-through) with wine frames; open A lines there a bridge
  const onFace = l => frac(dense(l.pts, l.closed), p => partAt(p) === 'skin') > 0.85
  const faceA = lines.filter(l => l.plate === 'A' && onFace(l))
  for (const l of faceA.filter(l => l.closed && Math.abs(ringArea(l.pts)) > 3)) out.push(K.fill(F.region([l.pts], 2.4), 'edge', { plate: 'A', op: 0.5 }))
  if (faceA.length) out.push(K.ink(F.strokes(faceA, 0.95, 2.4), 0, { plate: 'A' }))
  // 4. eyes: small closed cutouts on the face (or short strokes where there is none), wine with a catch-light
  const eyes = sk.cutouts.filter(c => c.closed && (() => { const b = bbox(c.pts); return Math.max(b.w, b.h) < 2.4 })() && partAt(centre(c.pts)) === 'skin')
  const eyeF = F.field(2.4), lights = []
  for (const c of eyes) {
    F.region([c.pts], 2.4, eyeF)
    const b = bbox(c.pts)
    lights.push([b.x0 + b.w * 0.68, b.y0 + b.h * 0.3, Math.max(0.24, Math.min(b.w, b.h) * 0.2)])
  }
  for (const l of lines) {
    if (l.plate !== 'K' || arclen(l.pts) > 1.2 || partAt(centre(l.pts)) !== 'skin') continue
    const c = centre(l.pts)
    if (eyes.some(e => { const b = bbox(e.pts); return Math.hypot((b.x0 + b.x1) / 2 - c[0], (b.y0 + b.y1) / 2 - c[1]) < 1.6 })) continue
    const s = sk.s
    F.union(eyeF, K.ellipse(c[0], c[1], 0.62 * s, 0.82 * s))
    lights.push([c[0] + 0.24 * s, c[1] - 0.3 * s, 0.24])
  }
  if (F.any(eyeF)) out.push(K.ink(eyeF, 0, { plate: 'K' }))
  if (lights.length) out.push(K.fill(K.union(lights.map(([x, y, r]) => K.disc(x, y, r))), 'shine', { plate: 'K' }))
  // 5. fine detail: open cutouts and inner strokes clear of every fill's edge (a mouth, a beard parting, a bun's
  //    wrap). On the face: wine on light skin, tint on deep skin; elsewhere wine.
  const detail = { face: [], ink: [] }
  const used = []
  const cand = [...sk.cutouts.filter(c => !c.closed), ...lines.filter(l => l.plate !== 'S' && !off.includes(l) && !faceA.includes(l) && arclen(l.pts, l.closed) > 1.2)]
  for (const c of cand) {
    const P = dense(c.pts, c.closed)
    if (frac(P, p => edgeDist(p) > 0.6 && sample(mass, p) < 0) < 0.7) continue
    if (used.some(u => P.every(p => distToPolyline(p, u.pts, u.closed) < 0.3))) continue
    used.push(c)
    ;(partAt(centre(c.pts)) === 'skin' ? detail.face : detail.ink).push({ pts: c.pts, closed: !!c.closed })
  }
  if (detail.face.length) out.push(deep ? K.fill(F.strokes(detail.face, 1.0, 2.4), 'tint', { plate: 'K' }) : K.ink(F.strokes(detail.face, 1.0, 2.4), 0, { plate: 'K' }))
  if (detail.ink.length) out.push(K.ink(F.strokes(detail.ink, 0.9, 2.4), 0, { plate: 'A' }))
  // 6. ribbon ties (S strokes): ribbon-red satin
  const ties = lines.filter(l => l.plate === 'S')
  if (ties.length) out.push({ f: F.strokes(ties, 1.7, 2.4), mat: 'bowp', plate: 'S', ow: 0.45 })
  // 7. the bow, tied at the top right of the hair (none when the skeleton already ties ribbons)
  if (!ties.length) {
    const head = F.field(2.4)
    fills.forEach((f, i) => { if (parts[i] !== 'cloth' && parts[i] !== 'gear') F.union(head, f) })
    const b = K.box(head)
    // the edge point of the head nearest its top-right corner, a touch inside
    let bp = null, bd = Infinity
    for (let j = 0; j < F.N; j += 2) for (let i = 0; i < F.N; i += 2) {
      const v = head[j * F.N + i]
      if (v < -0.4 && v > -1.2) { const x = i * F.H, y = j * F.H, d = Math.hypot(x - b[2], y - b[1]); if (d < bd) { bd = d; bp = [x, y] } }
    }
    if (bp) {
      const s = 0.72
      out.push(...K.bow(Math.min(23 - 4.9 * s, bp[0]), Math.max(1 + 3.9 * s, bp[1]), s, 18, { mat: 'bowp' }))
    }
  }
  return out
}
function centre(pts) { const b = bbox(pts); return [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2] }

// fallback hexes: coquette-soft tones. Skin a touch lifted and blushed (still a light->deep spread), hair kept
// natural with a whisper of rose, pastel clothes, a ribbon-red accent (bow, ties, cups)
export function personHex(icon) {
  if (!isPerson(icon)) return null
  const t = tones(icon)
  const soft = c => mix(mix(c, '#FFFFFF', 0.08), '#F2A0B4', 0.1)
  return {
    c1: soft(t.c1), tint: mix(soft(t.tint), '#FFFFFF', 0.15), shadow: mix(t.shadow, '#A8345C', 0.18),
    c2: mix(t.c2, '#C25A7C', 0.08), c3: mix(t.c3, '#5A1A33', 0.2), c4: mix(t.c4, '#FFFFFF', 0.35), accent: '#D7385F',
  }
}
export function recolor(nodes, icon) {
  const hx = personHex(icon)
  if (!hx) return nodes
  const re = /var\(--with-coquette-(c1|c2|c3|c4|tint|shadow|accent), #[0-9A-Fa-f]{6}\)/g
  const fix = v => typeof v === 'string' ? v.replace(re, (m, r) => `var(--with-coquette-${r}, ${hx[r]})`) : v
  return nodes.map(n => Array.isArray(n) && n[1] && typeof n[1] === 'object' ? [n[0], Object.fromEntries(Object.entries(n[1]).map(([k, v]) => [k, fix(v)])), ...n.slice(2)] : n)
}
