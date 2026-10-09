// BAUHAUS people avatars (forge/styles/_people.mjs convention). The automatic composer painted a person as a
// red face under blue hair (the icon's fixed triad). People get a flat Bauhaus portrait instead, same build:
//   - every skeleton fill a flat colour field of its part's role (skin c1, hair / headwear c2, clothing c4,
//     headphone cups accent), the fields grown like the composer's round bars, and set apart by a paper gap
//     where a later part overlaps an earlier one (hair over the forehead, clothing under the chin)
//   - features (eyes, brows, mouth, glasses, turban folds) as round black bars and dots in the fixed print
//     black (shadow), so they stay black on skin in dark mode; a skin-light catch-light in each eye
//   - defaults from tones(): flat natural skin (light -> deep spread), natural hair, a Bauhaus primary for
//     the clothing. Paint is var(--with-bauhaus-<role>, hex): a palette / the skin-tone picker recolours it.
import * as F from './_bauhaus-field.mjs'
import { tones, fillParts, partAt, ROLE_OF, mix } from './_people.mjs'
import { distToPolyline } from '../kernel/geom.mjs'

// a line that runs along a fill's edge (the jaw under the face outline, a hairline, a collar) is already drawn
// by the part borders; stroked again just inside them it thickens into a black chin or brow
const hugs = (icon, pts) => {
  const rings = (icon.fills || []).flatMap(f => f.set || [])
  const near = pts.filter(p => rings.some(r => distToPolyline(p, r, true) < 0.9)).length
  return pts.length > 2 && near / pts.length > 0.8
}

const GROW = 0.6   // fields grow past the skeleton fill (the composer's mass is fill + half a bar)
const GAP = 0.7    // paper gap where a later part overlaps an earlier one
const WI = 1.6     // black feature bars
const DEEP = 0.85  // a feature point must sit this deep inside some part
const PRIMARY = ['#E0412E', '#F2B33D', '#2A6BC2', '#E9772E', '#2E7A5E']
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
function hue(h) {
  const [r, g, b] = rgb(h).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  if (d < 0.08) return -1
  const x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return (x * 60 + 360) % 360
}
const nearest = h => {
  const a = hue(h)
  if (a < 0) return '#2A6BC2'
  let best = PRIMARY[0], bd = 1e9
  for (const c of PRIMARY) { const d = Math.min(Math.abs(hue(c) - a), 360 - Math.abs(hue(c) - a)); if (d < bd) { bd = d; best = c } }
  return best
}

export function personPalette(icon) {
  const t = tones(icon)
  const [r, g, b] = rgb(t.c2), lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  // near-black hair would vanish on a dark page: a deep warm brown / charcoal instead
  const c2 = lum < 0.16 ? mix(t.c2, '#7A6A72', 0.35) : t.c2
  return { c1: t.c1, tint: t.tint, c2, c4: nearest(t.c4), accent: '#E0412E' }
}

// a bald head's shine stroke (a line high on the skin of a hairless head) is a light highlight, not ink
const shineOf = (icon, parts, pts) => !parts.some(p => p === 'hair' || p === 'wear') && Math.max(...pts.map(p => p[1])) < 8.5 &&
  pts.every(p => partAt(icon, p) === 'skin')
const densify = (pts, closed, step = 0.12) => {
  const P = closed ? [...pts, pts[0]] : pts, out = []
  for (let i = 0; i + 1 < P.length; i++) {
    const a = P[i], b = P[i + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
  }
  if (!closed && P.length) out.push(P.at(-1))
  return out
}
const at = (G, p) => {
  const i = Math.round(p[0] / F.H), j = Math.round(p[1] / F.H)
  return (i < 0 || j < 0 || i >= F.N || j >= F.N) ? 9 : G[j * F.N + i]
}

export function buildPerson(icon) {
  const parts = fillParts(icon)
  const regs = (icon.fills || []).map(f => F.offset(F.region(f.set || [], 2.5), -GROW))
  const vis = regs.map((R, i) => {
    const V = F.copy(R)
    for (let j = i + 1; j < regs.length; j++) F.subtract(V, F.offset(F.copy(regs[j]), parts[j] === parts[i] ? 0 : -GAP))
    return V
  })
  // how deep a point sits inside its part (negative = inside)
  const depth = F.field(2)
  for (const V of vis) F.union(depth, V)

  const ink = F.field(1.2)
  const runsIn = (pts, closed) => {
    const out = []; let cur = []
    for (const p of densify(pts, closed)) {
      if (at(depth, p) < -DEEP) cur.push(p)
      else { if (cur.length > 1) out.push(cur); cur = [] }
    }
    if (cur.length > 1) out.push(cur)
    return out
  }
  const eyes = [], shine = []
  const isSkin = (x, y) => partAt(icon, [x, y]) === 'skin'
  for (const l of icon.lines || []) {
    if (!l.pts || l.pts.length < 2 || hugs(icon, l.pts)) continue
    if (shineOf(icon, parts, l.pts)) { shine.push(l); continue }
    const rs = runsIn(l.pts, l.closed)
    if (rs.length) F.strokes(rs.map(r => ({ pts: r, closed: false })), WI, 1.2, ink)
  }
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || s.pts.length < 2) continue
    if (s.closed && s.pts.length > 2) {
      const xs = s.pts.map(p => p[0]), ys = s.pts.map(p => p[1])
      const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys)
      if (w * h > 9) continue
      F.region([s.pts], 1.2, ink)
      const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2
      if (isSkin(cx, cy)) eyes.push({ cx, cy, r: Math.min(w, h) / 2 })
    } else if (!hugs(icon, s.pts)) {
      const rs = runsIn(s.pts, false)
      if (rs.length) F.strokes(rs.map(r => ({ pts: r, closed: false })), WI, 1.2, ink)
    }
  }
  // eyes drawn only as a short bar (no cutout)
  if (!eyes.length) for (const l of icon.lines || []) {
    if (!l.pts || l.pts.length !== 2) continue
    const [a, b] = l.pts
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 1.2) continue
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2
    if (isSkin(cx, cy)) eyes.push({ cx, cy, r: WI / 2 })
  }
  let glint = shine.length ? F.strokes(shine, WI, 1.2) : null
  for (const e of eyes) {
    const r = Math.max(0.28, Math.min(0.42, e.r * 0.45))
    glint = F.strokes([{ pts: [[e.cx + e.r * 0.35, e.cy - e.r * 0.4]], closed: false }], 2 * r, 1, glint)
  }

  const byRole = new Map()
  vis.forEach((V, i) => {
    const role = ROLE_OF[parts[i]] || 'c1'
    const G = byRole.get(role)
    byRole.set(role, G ? F.union(G, V) : F.copy(V))
  })
  // a free stroke over a hairless head (a baby's curl) is a round hair bar in c2
  if (!parts.some(p => p === 'hair' || p === 'wear')) {
    for (const l of icon.lines || []) {
      if (!l.pts || l.pts.length < 2) continue
      const out = l.pts.filter(p => partAt(icon, p) === null).length / l.pts.length
      if (out > 0.5 && Math.max(...l.pts.map(p => p[1])) < 6) byRole.set('c2', F.strokes([l], 2, 1.2, byRole.get('c2') || null))
    }
  }
  const fields = []
  for (const role of ['c1', 'c2', 'c4', 'accent']) if (byRole.has(role)) fields.push({ role, f: byRole.get(role) })
  return { fields, ink, glint }
}
