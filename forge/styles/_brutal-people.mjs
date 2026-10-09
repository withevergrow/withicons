// BRUTAL people avatars (forge/styles/_people.mjs convention). The generic Brutal pipeline strokes every
// feature at the full 2.2u ink and then drops the face as "a field the ink leaves no core", so a person
// came out as a black balaclava. People get their own flat poster treatment instead:
//   - every skeleton fill is a flat field of its part's role: skin c1, hair / headwear c2, clothing c4,
//     headphone cups accent (paint order = fill order: hair over the forehead, clothing over the neck)
//   - the silhouette gets the thick Brutal ink rim; part borders and features (eyes, mouth, brows,
//     glasses) a lighter ink, so the face stays a big skin field
//   - a tint catch-light in each eye, so dark eyes still read on deep skin
//   - the same hard offset ink shadow as every Brutal icon (wm-shadow)
// Defaults come from tones(): natural skin (light -> deep spread), natural hair, a loud flat Brutal colour
// for clothing. Paint is var(--with-brutal-<role>, hex), so a palette / the skin-tone picker recolours it.
import * as F from './_brutal-field.mjs'
import { K } from './_brutal-core.mjs'
import { tones, fillParts, partAt, ROLE_OF, mix } from './_people.mjs'
import { distToPolyline } from '../kernel/geom.mjs'

// a line that runs along a fill's edge (the jaw under the face outline, a hairline, a collar) is already drawn
// by the part borders; stroked again just inside them it thickens into a black chin or brow
const hugs = (icon, pts) => {
  const rings = (icon.fills || []).flatMap(f => f.set || [])
  const near = pts.filter(p => rings.some(r => distToPolyline(p, r, true) < 0.9)).length
  return pts.length > 2 && near / pts.length > 0.8
}

const W_RIM = 1.9    // silhouette ink
const W_IN = 1.15    // part borders + features
const LOUD = ['#FF6BA8', '#4D7CFE', '#3DDC97', '#FF8A3D', '#FFD23F', '#9B6BFF', '#FF4D4D', '#22C3B5']
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
function hue(h) {
  const [r, g, b] = rgb(h).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  if (d < 0.08) return -1
  const x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return (x * 60 + 360) % 360
}
// the loud Brutal colour nearest in hue to a friendly clothing colour (greys and navies keep a loud blue)
function loud(h) {
  const a = hue(h)
  if (a < 0) return '#4D7CFE'
  let best = LOUD[0], bd = 1e9
  for (const c of LOUD) { const d = Math.min(Math.abs(hue(c) - a), 360 - Math.abs(hue(c) - a)); if (d < bd) { bd = d; best = c } }
  return best
}

export function personPalette(icon) {
  const t = tones(icon)
  // near-black hair would vanish into the ink: lift it to a readable deep brown / charcoal
  const [r, g, b] = rgb(t.c2), lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  const c2 = lum < 0.22 ? mix(t.c2, lum < 0.16 ? '#9A8F9E' : '#B07A55', 0.42) : t.c2
  return { c1: t.c1, tint: t.tint, shadow: t.shadow, c2, c3: t.c3, c4: loud(t.c4), accent: '#FF6BA8' }
}

// a bald head's shine stroke (a line high on the skin of a hairless head) is a light highlight, not ink
const shineOf = (icon, parts, pts) => !parts.some(p => p === 'hair' || p === 'wear') && Math.max(...pts.map(p => p[1])) < 8.5 &&
  pts.every(p => partAt(icon, p) === 'skin')
const mv = pts => pts.map(p => [p[0] + K.SHIFT, p[1] + K.SHIFT])
// a band of width w centred on the edge of region field R
const rim = (R, w, out = 0) => { const G = F.copy(R); for (let k = 0; k < G.length; k++) G[k] = Math.abs(G[k] - out) - w / 2; return G }

export function buildPerson(icon) {
  const parts = fillParts(icon)
  const regs = (icon.fills || []).map(f => F.region((f.set || []).map(mv), 2))
  // visible share of every fill (later fills paint over earlier ones)
  const vis = regs.map((R, i) => { const V = F.copy(R); for (let j = i + 1; j < regs.length; j++) F.subtract(V, regs[j]); return V })
  const sil = F.field(2)
  for (const R of regs) F.union(sil, R)

  // ink: thick rim around the silhouette, lighter borders between parts, features
  const ink = rim(sil, W_RIM, 0.35) // the rim sits mostly outside: the colour fields keep their size
  const feat = F.field(1.2) // features: painted in a dark that never flips (eyes stay dark on light skin in dark mode)
  for (const V of vis) F.union(ink, rim(V, W_IN))
  const raw = (icon.lines || []).filter(l => l.pts && l.pts.length > 1 && !hugs(icon, l.pts))
  const shine = raw.filter(l => shineOf(icon, parts, l.pts)).map(l => ({ ...l, pts: mv(l.pts) }))
  const feats = raw.filter(l => !shineOf(icon, parts, l.pts)).map(l => ({ ...l, pts: mv(l.pts) }))
  F.strokes(feats, W_IN, 1.2, feat)
  const eyes = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || s.pts.length < 2) continue
    const pts = mv(s.pts)
    if (s.closed && pts.length > 2) {
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
      const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys)
      if (w * h > 9) continue
      F.region([pts], 1.2, feat)
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2
      if (partAt(icon, [cx - K.SHIFT, cy - K.SHIFT]) === 'skin') eyes.push({ cx, cy, r: Math.min(w, h) / 2 })
    } else if (!hugs(icon, s.pts)) {
      F.strokes([{ pts, closed: false }], W_IN, 1.2, feat)
    }
  }
  // an eye drawn only as a short stroke (no cutout): its catch-light sits on the stroke
  if (!eyes.length) for (const l of feats) {
    if (l.pts.length !== 2) continue
    const [a, b] = l.pts, L = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (L > 1.2) continue
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
    if (partAt(icon, [cx - K.SHIFT, cy - K.SHIFT]) === 'skin') eyes.push({ cx, cy, r: W_IN / 2 })
  }
  // catch-lights: a small tint dot up-right in every eye
  let glint = shine.length ? F.strokes(shine, W_IN, 1.2) : null
  for (const e of eyes) {
    const r = Math.max(0.28, Math.min(0.42, e.r * 0.45))
    const p = [e.cx + e.r * 0.35, e.cy - e.r * 0.4]
    glint = F.strokes([{ pts: [p], closed: false }], 2 * r, 1, glint)
  }

  // colour fields grouped by role, tucked under the ink
  const byRole = new Map()
  vis.forEach((V, i) => {
    const role = ROLE_OF[parts[i]] || 'c1'
    const G = byRole.get(role)
    byRole.set(role, G ? F.union(G, V) : F.copy(V))
  })
  const fields = []
  for (const role of ['c1', 'c2', 'c4', 'accent']) if (byRole.has(role)) fields.push({ c: role, f: byRole.get(role) })

  const shadow = F.fillHoles(F.union(F.copy(ink), sil), K.HOLE)
  return { ink, feat, fields, shadow, glint }
}

