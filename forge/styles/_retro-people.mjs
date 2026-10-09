// RETRO people avatars (forge/styles/_people.mjs convention). The generic Retro pipeline strokes every feature
// at the chunky 2.35u ink and bands the face in sunset stripes, so a person came out as a black face with orange
// streaks. People get a 70s portrait instead:
//   - the face (and ears) one warm flat skin field, the hair a flat natural colour crossed by one 70s sheen
//     stripe, the clothing a flat warm colour, headphone cups in the stripe colour
//   - chunky ink rim around the silhouette, lighter ink for part borders and features, a skin-light catch-light
//     in each eye (dark eyes still read on deep skin), and the usual hard print shadow (wm-shadow)
// Retro colours are a slot family (--with-retro-N, matched to c1..c4 by order of first appearance, see
// forge/lib/palette-map.mjs), so the markup order is fixed: skin retro-1 (c1), hair retro-2 (c2), sheen stripe /
// cups retro-3 (c3), clothing retro-4 (c4). A person with no hair (bald) has skin, then clothing (-> c2).
import * as F from './_retro-field.mjs'
import { K } from './_retro-core.mjs'
import { tones, adapt, mix, fillParts, partAt } from './_people.mjs'
import { distToPolyline } from '../kernel/geom.mjs'

// a line that runs along a fill's edge (the jaw under the face outline, a hairline, a collar) is already drawn
// by the part borders; stroked again just inside them it thickens into a black chin or brow
const hugs = (icon, pts) => {
  const rings = (icon.fills || []).flatMap(f => f.set || [])
  const near = pts.filter(p => rings.some(r => distToPolyline(p, r, true) < 0.9)).length
  return pts.length > 2 && near / pts.length > 0.8
}

const W_RIM = 2.0    // silhouette ink
const W_IN = 1.15    // part borders + features
const SLOT = { skin: 1, hair: 2, wear: 2, gear: 3, cloth: 4 }
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
// 70s wardrobe: the friendly clothing colour moves to the nearest warm retro dye (greys and navies: denim)
const DYES = ['#F4B53F', '#EF7D2D', '#DE4B3A', '#178A86', '#7FA03C', '#A0527E', '#3F6E9E', '#E77FA0']
function hue(h) {
  const [r, g, b] = rgb(h).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  if (d < 0.08) return -1
  const x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return (x * 60 + 360) % 360
}
const dye = h => {
  const a = hue(h)
  if (a < 0) return '#3F6E9E'
  let best = DYES[0], bd = 1e9
  for (const c of DYES) { const d = Math.min(Math.abs(hue(c) - a), 360 - Math.abs(hue(c) - a)); if (d < bd) { bd = d; best = c } }
  return best
}

// per-person default hexes for the four slots, plus tint (catch-light)
export function personPalette(icon) {
  const t = adapt(tones(icon), 'vivid')
  const [r, g, b] = rgb(t.c2), lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  // near-black hair would vanish into the ink: lift it to a readable warm deep brown / charcoal
  const hair = lum < 0.22 ? mix(t.c2, lum < 0.16 ? '#9A8478' : '#B07A55', 0.42) : t.c2
  return {
    1: t.c1, 2: hair, 3: mix(hair, '#F4B53F', 0.45), 4: dye(t.c4),
    tint: t.tint,
  }
}

// a bald head's shine stroke (a line high on the skin of a hairless head) is a light highlight, not ink
const shineOf = (icon, parts, pts) => !parts.some(p => p === 'hair' || p === 'wear') && Math.max(...pts.map(p => p[1])) < 8.5 &&
  pts.every(p => partAt(icon, p) === 'skin')
const mv = pts => pts.map(p => [p[0] + K.SHIFT, p[1] + K.SHIFT])
const rim = (R, w, out = 0) => { const G = F.copy(R); for (let k = 0; k < G.length; k++) G[k] = Math.abs(G[k] - out) - w / 2; return G }

export function buildPerson(icon) {
  const parts = fillParts(icon)
  const regs = (icon.fills || []).map(f => F.region((f.set || []).map(mv), 2))
  const vis = regs.map((R, i) => { const V = F.copy(R); for (let j = i + 1; j < regs.length; j++) F.subtract(V, regs[j]); return V })
  const sil = F.field(2)
  for (const R of regs) F.union(sil, R)

  const ink = rim(sil, W_RIM, 0.35) // the rim sits mostly outside: the colour fields keep their size
  const feat = F.field(1.2) // features: painted in a dark that never flips (eyes stay dark on light skin in dark mode)
  for (const V of vis) F.union(ink, rim(V, W_IN))
  const raw = (icon.lines || []).filter(l => l.pts && l.pts.length > 1 && !hugs(icon, l.pts))
  const shine = raw.filter(l => shineOf(icon, parts, l.pts)).map(l => ({ ...l, pts: mv(l.pts) }))
  const feats = raw.filter(l => !shineOf(icon, parts, l.pts)).map(l => ({ ...l, pts: mv(l.pts) }))
  const eyes = []
  const isSkin = (x, y) => partAt(icon, [x - K.SHIFT, y - K.SHIFT]) === 'skin'
  // a short free stroke above the head (a baby's curl) is a hair tuft in the hair colour, not ink
  const hasHair = parts.some(p => p === 'hair' || p === 'wear')
  let tuft = null
  for (const l of feats) {
    const out = l.pts.filter(p => partAt(icon, [p[0] - K.SHIFT, p[1] - K.SHIFT]) === null).length / l.pts.length
    const top = Math.max(...l.pts.map(p => p[1]))
    if (!hasHair && out > 0.5 && top < 6) { tuft = F.strokes([l], W_IN + 0.9, 1.2, tuft); continue }
    F.strokes([l], W_IN, 1.2, feat)
  }
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || s.pts.length < 2) continue
    const pts = mv(s.pts)
    if (s.closed && pts.length > 2) {
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
      const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys)
      if (w * h > 9) continue
      F.region([pts], 1.2, feat)
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2
      if (isSkin(cx, cy)) eyes.push({ cx, cy, r: Math.min(w, h) / 2 })
    } else if (!hugs(icon, s.pts)) {
      F.strokes([{ pts, closed: false }], W_IN, 1.2, feat)
    }
  }
  if (!eyes.length) for (const l of feats) {
    if (l.pts.length !== 2) continue
    const [a, b] = l.pts
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 1.2) continue
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
    if (isSkin(cx, cy)) eyes.push({ cx, cy, r: W_IN / 2 })
  }
  let glint = shine.length ? F.strokes(shine, W_IN, 1.2) : null
  for (const e of eyes) {
    const r = Math.max(0.28, Math.min(0.42, e.r * 0.45))
    glint = F.strokes([{ pts: [[e.cx + e.r * 0.35, e.cy - e.r * 0.4]], closed: false }], 2 * r, 1, glint)
  }

  // colour by slot
  const slots = new Map()
  vis.forEach((V, i) => {
    const s = SLOT[parts[i]] || 1
    const G = slots.get(s)
    slots.set(s, G ? F.union(G, V) : F.copy(V))
  })
  if (tuft) slots.set(2, tuft)
  // keep the slot order whole: with no sheen or cups, a second garment (a baby's bib) takes slot 3
  const cloth = parts.map((p, i) => p === 'cloth' ? i : -1).filter(i => i >= 0)
  if (tuft && !slots.has(3) && cloth.length > 1) {
    const last = cloth.at(-1), C = F.field(2)
    for (const i of cloth) if (i !== last) F.union(C, vis[i])
    slots.set(4, C); slots.set(3, F.copy(vis[last]))
  }
  // the 70s sheen: one stripe across the hair, a little above its middle
  const hairF = slots.get(2)
  let sheen = null
  if (hairF && !tuft) {
    const e = F.extent(hairF, 0.5), h = e.y1 - e.y0
    if (h > 2) {
      const y0 = e.y0 + h * 0.3, y1 = y0 + Math.min(1.1, h * 0.22)
      sheen = F.clipBand(F.copy(hairF), y0, y1)
      F.subtract(hairF, F.clipBand(F.copy(hairF), y0 - 0.0, y1 + 0.0))
    }
  }
  const fields = []
  for (const s of [1, 2]) if (slots.has(s)) fields.push({ c: s, f: slots.get(s) })
  if (sheen) fields.push({ c: 3, f: sheen })
  if (slots.has(3)) fields.push({ c: 3, f: slots.get(3) })
  if (slots.has(4)) fields.push({ c: 4, f: slots.get(4) })

  const solidSil = F.fillHoles(F.union(F.copy(ink), sil), K.HOLE)
  const shadow = F.subtract(F.shift(solidSil, K.OFF, K.OFF, 1.2), F.offset(F.copy(solidSil), 0.25))
  return { ink, feat, fields, shadow, glint }
}
