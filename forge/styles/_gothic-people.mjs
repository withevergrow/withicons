// GOTHIC people avatars: a figure in a stained-glass window.
//
// Real windows paint a face on pale flesh-tinted glass (features in dark grisaille) and set it beside
// coloured glass for the hair and the robe. So a person keeps the style's material (glass in lead, a carved
// limestone frame) and gets the convention's roles (forge/styles/_people.mjs):
//   face   flesh glass, c1 (vignetted by shadow, lit by shine), no tracery: one painted piece
//   hair   glass c2 (a turban or a cap too) with lancet leads that read as strands
//   robe   glass c4 with quarry leads
//   gear   gilt (accent): headphone cups are metal
// Eyes stay dark grisaille, each with a candle catch-light, so they read on light and deep flesh glass.
import * as F from './_gothic-field.mjs'
import { fillParts, partAt } from './_people.mjs'
import { distToPolyline, area as ringArea } from '../kernel/geom.mjs'
import { exact, minus, erode } from './_gothic-paint.mjs'

// one signed field per part kind: a point belongs to the LAST skeleton fill holding it (hair over the forehead,
// clothing over the neck); a stroke's overhang outside every fill goes to the nearest fill
function kinds(icon) {
  const ks = fillParts(icon)
  const R = (icon.fills || []).map(f => {
    const rings = (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2)
    return rings.length ? F.region(rings, 2.5) : F.field(9)
  })
  const n = R.length, NN = F.N * F.N, out = {}
  for (let i = 0; i < n; i++) {
    const c = ks[i] || 'cloth', V = out[c] || (out[c] = F.field(9))
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

const GLASS = {
  skin: { m: 'glass', role: 'c1', tracery: 'none', glow: 0.22, dark: 0.26 },
  hair: { m: 'glass', role: 'c2', tracery: 'lancet', s: 1.7, dark: 0.3 },
  wear: { m: 'glass', role: 'c2', tracery: 'quarry', s: 2.2, medallion: false, dark: 0.3 },
  cloth: { m: 'glass', role: 'c4', tracery: 'quarry', s: 2.4, medallion: false, dark: 0.3 },
  gear: { m: 'gilt', role: 'accent' },
}
const ORDER = ['cloth', 'skin', 'hair', 'wear', 'gear']
const area = Fd => { let a = 0; for (let i = 0; i < Fd.length; i++) if (Fd[i] < 0) a++; return a * F.H * F.H }

// the automatic composer's parts -> the same window glazed as a person
export function glazePerson(parts, icon) {
  const K = kinds(icon)
  const out = []
  for (const p of parts) {
    // the face's glass and the A metal (hair, clothing): re-cut by what each region is
    if (p && p.F && (p.m === 'glass' || (p.m === 'gilt' && p.plate === 'A'))) {
      let rest = p.F
      for (const c of ORDER) {
        if (!K[c]) continue
        let sub = F.intersect(F.copy(p.F), K[c])
        // the face is one painted pane: the composer's cuts for the eyes and mouth close up (grisaille paints them)
        if (c === 'skin') sub = F.intersect(F.fillHoles(sub, 12), K[c])
        rest = minus(rest, K[c])
        if (area(sub) < 0.4) continue
        const g = GLASS[c]
        out.push({ ...p, ...g, F: exact(sub), plate: c === 'skin' ? 'K' : p.plate, batch: undefined, medal: undefined, deep: 0 })
      }
      if (area(rest) >= 0.4) out.push({ ...p, F: rest })
      continue
    }
    // the carved limestone outline of the face and its features: a window leads each pane already and paints
    // the features in grisaille (below); limestone round a face reads as a helmet or a beard. Spectacles (A) are iron.
    if (p && p.m === 'stone') { if (p.plate === 'A') { const S = erode(exact(p.F), 0.15); if (area(S) > 0.3) out.push({ ...p, m: 'iron', F: S, ticks: undefined, outline: 0.22 }) } continue }
    if (p && p.m === 'recess' && p.plate === 'K') continue
    out.push(p)
  }
  out.push(...features(icon))
  return out
}

// grisaille: the eyes (small closed cutouts on the face) as dark beads with a candle catch-light, the mouth
// and the face's other open cutouts as fine painted lines; a cutout along a hair edge is the lead between panes
function features(icon) {
  const hairRings = (icon.fills || []).flatMap((f, i) => ['hair', 'wear'].includes(fillParts(icon)[i])
    ? (f.set && f.set.length ? f.set : (f.subs || []).map(s => s.pts)).filter(r => r && r.length > 2) : [])
  const eyes = [], lines = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    const P = s.pts || []
    if (P.length < 2) continue
    const onFace = P.filter(p => partAt(icon, p) === 'skin').length / P.length
    if (s.closed && P.length > 2 && Math.abs(ringArea(P)) < 3) { if (onFace > 0.5) eyes.push(P); continue }
    if (s.closed || onFace < 0.6) continue
    if (P.every(p => hairRings.some(r => distToPolyline(p, r, true) < 0.3))) continue
    lines.push({ pts: P, closed: false })
  }
  const out = []
  if (lines.length) out.push({ m: 'paint', role: 'ink', F: F.strokes(lines, 0.8, 0.8), plate: 'K' })
  if (eyes.length) {
    const E = F.region(eyes, 0.8)
    out.push({ m: 'paint', role: 'ink', F: E, plate: 'K' })
    out.push(...catchLights(E))
  }
  return out
}

function catchLights(R) {
  const out = []
  for (const c of F.components(R)) {
    const w = c.x1 - c.x0, h = c.y1 - c.y0
    if (w < 0.4 || h < 0.5 || w > 2.6 || h > 2.8) continue
    const cx = c.x0 + w * 0.36, cy = c.y0 + h * 0.3, r = Math.max(0.2, Math.min(w, h) * 0.24)
    const L = F.field(9)
    for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) L[j * F.N + i] = Math.hypot(i * F.H - cx, j * F.H - cy) - r
    out.push({ m: 'shine', F: L, op: 0.95, plate: 'K' })
  }
  return out
}
