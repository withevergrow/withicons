// GOTHIC Live icons (forge/DYNAMIC.md): helpers for the value-carrying parts of a Live icon.
//
//   markIds(icon) -> Set of path ids: the small round A loops a Live icon moves or counts (a die's pips, the
//                    marked day of a month, a gauge's hub), recognised by the well the skeleton cuts round
//                    them (a cutout ring wider than the loop). A loop knocked out at its own size (a tag's
//                    eyelet) is a hole, not a mark.
const boxOf = pts => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }
}
export function markIds(icon) {
  const out = new Set()
  if (!icon || !icon.params) return out
  const wells = (icon.cutouts || []).flatMap(c => (c.subs || []).filter(s => s.pts && s.pts.length > 2).map(s => boxOf(s.pts)))
  for (const p of icon.paths || []) {
    if (p.plate !== 'A' || String(p.id || '').startsWith('text:') || (p.subs || []).length !== 1) continue
    const s = p.subs[0]
    if (!s.closed || s.pts.length < 3) continue
    const b = boxOf(s.pts), r = Math.max(b.w, b.h) / 2
    if (r > 1.6 || Math.abs(b.w - b.h) > 0.3) continue
    if (wells.some(w => Math.hypot(w.cx - b.cx, w.cy - b.cy) < 0.4 && Math.max(w.w, w.h) / 2 >= r + 0.35)) out.add(p.id)
  }
  return out
}

// the well a mark sits in (a cutout ring round it, wider than it): drop it with the mark
export function isWellOf(marks, s) {
  if (!s.pts || s.pts.length < 3) return false
  const b = boxOf(s.pts)
  return marks.some(m => Math.hypot(m.cx - b.cx, m.cy - b.cy) < 0.4 && Math.max(b.w, b.h) / 2 >= m.r + 0.35)
}
export function markGeo(icon, ids) {
  return (icon.paths || []).filter(p => ids.has(p.id)).map(p => { const b = boxOf(p.subs[0].pts); return { cx: b.cx, cy: b.cy, r: Math.max(b.w, b.h) / 2 } })
}
