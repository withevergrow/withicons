// GLASS Live icons (forge/DYNAMIC.md): the text of a Live icon is taken out of the glass build and lettered
// on top, so a value never turns into a glass rod (blobs) or an etched groove with a light lip (closed counters).
//
//   stripGlyphs(icon, glyphs) -> the prepared icon without these glyph paths, their lines and the cutouts that
//                                knock them out (a cutout subpath whose points all lie on a glyph)
import { distToPolyline, pointInRing } from '../kernel/geom.mjs'

// even-odd inside the icon's fills
export function inFill(icon, p) {
  for (const f of icon.fills || []) {
    let n = 0
    for (const s of f.subs || []) if (s.pts.length > 2 && pointInRing(p, s.pts)) n++
    if (n % 2) return true
  }
  return false
}

export function stripGlyphs(icon, glyphs) {
  if (!glyphs.length) return icon
  const ids = new Set(glyphs.map(g => g.id))
  const gl = (icon.lines || []).filter(l => ids.has(l.pathId))
  const onGlyph = pts => pts.length && pts.every(p => gl.some(l => distToPolyline(p, l.pts, l.closed) < 0.3))
  const cutouts = []
  for (const c of icon.cutouts || []) {
    const subs = (c.subs || []).filter(s => !onGlyph(s.pts || []))
    if (subs.length === (c.subs || []).length) cutouts.push(c)
    else if (subs.length) cutouts.push({ ...c, subs })
  }
  return {
    ...icon,
    paths: (icon.paths || []).filter(p => !ids.has(p.id)),
    lines: (icon.lines || []).filter(l => !ids.has(l.pathId)),
    cutouts,
  }
}

// Live marks: the small closed A loops a Live icon moves or counts (a die's pips, the marked day of a month)
// are not etched rings on the pane but glass beads set on it: accent glass, a crisp rim, a specular dot.
//   beads(icon) -> { icon (without those loops and the closed cutouts round them), beads: [{ cx, cy, r }] }
const MAXR = 1.6
function wellOf(icon, cx, cy, r) {
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.pts || s.pts.length < 3) continue
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    if (Math.hypot((x0 + x1) / 2 - cx, (y0 + y1) / 2 - cy) < 0.4 && Math.max(x1 - x0, y1 - y0) / 2 >= r + 0.35) return true
  }
  return false
}
export function beads(icon) {
  if (!icon || !icon.params) return { icon, beads: [] }
  const out = [], ids = new Set()
  for (const p of icon.paths || []) {
    if (p.plate !== 'A' || String(p.id || '').startsWith('text:') || (p.subs || []).length !== 1) continue
    const s = p.subs[0]
    // a dot (a zero-length stroke: a month's days) is a small etched bead, so it still reads at 24px
    if (!s.closed && s.pts.length >= 2 && inFill(icon, s.pts[0]) && Math.hypot(s.pts.at(-1)[0] - s.pts[0][0], s.pts.at(-1)[1] - s.pts[0][1]) <= 0.5) {
      out.push({ cx: (s.pts[0][0] + s.pts.at(-1)[0]) / 2, cy: (s.pts[0][1] + s.pts.at(-1)[1]) / 2, r: 0, dot: true })
      ids.add(p.id)
      continue
    }
    if (!s.closed || s.pts.length < 3) continue
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    const r = Math.max(x1 - x0, y1 - y0) / 2
    if (r > MAXR || Math.abs((x1 - x0) - (y1 - y0)) > 0.3 || !inFill(icon, [(x0 + x1) / 2, (y0 + y1) / 2])) continue
    // a mark sits in a well the skeleton cuts wider than it; a loop knocked out at its own size is a hole (an eyelet)
    if (!wellOf(icon, (x0 + x1) / 2, (y0 + y1) / 2, r)) continue
    out.push({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, r })
    ids.add(p.id)
  }
  if (!out.length) return { icon, beads: [] }
  // a closed cutout centred on a bead (its well) goes with it
  const isWell = s => {
    if (!s.closed || s.pts.length < 3) return false
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    return out.some(b => !b.dot && Math.hypot(b.cx - cx, b.cy - cy) < 0.4 && (x1 - x0) / 2 < b.r + 1.6)
  }
  const cutouts = []
  for (const c of icon.cutouts || []) {
    const subs = (c.subs || []).filter(s => !isWell(s))
    if (subs.length === (c.subs || []).length) cutouts.push(c)
    else if (subs.length) cutouts.push({ ...c, subs })
  }
  return {
    icon: { ...icon, paths: icon.paths.filter(p => !ids.has(p.id)), lines: (icon.lines || []).filter(l => !ids.has(l.pathId)), cutouts },
    beads: out,
  }
}

// Live hands: the A strokes a clock or gauge turns (open lines lying inside the face, knocked out by a cutout)
// are lettered on the pane as bold etch-colour hands, not hairline etching; the hub where they meet is a bead.
//   hands(icon) -> { icon (without them and their cutouts), hands: [pts...], hubs: [{ cx, cy, r }] }
export function hands(icon) {
  if (!icon || !icon.params) return { icon, hands: [], columns: [], hubs: [] }
  const cutLines = (icon.cutouts || []).flatMap(c => (c.subs || []).filter(s => !s.closed))
  const along = pts => cutLines.some(c => pts.every(p => distToPolyline(p, c.pts) < 0.3))
  const H = [], C = [], ids = new Set()
  for (const p of icon.paths || []) {
    if (p.plate !== 'A' || String(p.id || '').startsWith('text:') || !(p.subs || []).length) continue
    if (!p.subs.every(q => !q.closed && q.pts.length >= 2 && q.pts.every(pt => inFill(icon, pt)))) continue
    const len = q => q.pts.slice(1).reduce((a, pt, i) => a + Math.hypot(pt[0] - q.pts[i][0], pt[1] - q.pts[i][1]), 0)
    if (!p.subs.every(q => len(q) > 1.4)) continue
    // knocked out by a cutout: a hand; drawn into the face without one: a level column (a thermometer's mercury)
    if (p.subs.every(q => along(q.pts))) H.push(...p.subs.map(q => q.pts))
    else if (p.subs.every(q => !along(q.pts))) C.push(...p.subs.map(q => q.pts))
    else continue
    ids.add(p.id)
  }
  if (!H.length && !C.length) return { icon, hands: [], columns: [], hubs: [] }
  // one hub: of the hand ends that lie on another hand, the one nearest the face's centre (hands that overlap,
  // at 12:00, touch each other twice)
  const hubs = []
  const face = H.length ? (icon.fills || []).flatMap(f => f.subs || []).find(q => q.pts.length > 2 && pointInRing(H[0][0], q.pts)) : null
  let fc = null
  if (face) { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of face.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } fc = [(x0 + x1) / 2, (y0 + y1) / 2] }
  let best = null
  for (const h of H) for (const e of [h[0], h.at(-1)]) {
    if (!H.some(o => o !== h && distToPolyline(e, o) < 0.3)) continue
    const d = fc ? Math.hypot(e[0] - fc[0], e[1] - fc[1]) : 0
    if (!best || d < best.d) best = { d, e }
  }
  if (best) hubs.push({ cx: best.e[0], cy: best.e[1], r: 0.3 })
  const onHand = pts => pts.length && pts.every(pt => H.some(h => distToPolyline(pt, h) < 0.3))
  const cutouts = []
  for (const c of icon.cutouts || []) {
    const subs = (c.subs || []).filter(q => !onHand(q.pts || []))
    if (subs.length === (c.subs || []).length) cutouts.push(c)
    else if (subs.length) cutouts.push({ ...c, subs })
  }
  return { icon: { ...icon, paths: icon.paths.filter(p => !ids.has(p.id)), lines: (icon.lines || []).filter(l => !ids.has(l.pathId)), cutouts }, hands: H, columns: C, hubs }
}
