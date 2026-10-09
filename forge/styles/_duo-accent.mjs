// DUO accent detail: which paths of an icon are its ONE accent detail (moved here from Linear, which folds into Duo).
// Duo paints them with stroke var(--with-duo-accent, currentColor): unset, they are plain ink, so nothing changes.
//
// The rule: the S plate (a badge, a slash: the modifier IS the point of the icon) if any; else the A parts that sit
// inside the object's mass; else the A parts when they are a small share of the line work. Pure line glyphs (arrows,
// chevrons, text tools) get no accent. The accent stays a DETAIL: a pool longer than CAP of all line work is trimmed
// longest-first. Live icons (params) skip the length cap so the choice never depends on the value.
import { pointInSet, arclen } from '../kernel/geom.mjs'

export const CAP = { S: 0.6, A: 0.38 }

const isGlyph = p => /^text:/u.test(p.id || '')
const pathLen = p => (p.subs || []).reduce((s, sub) => s + (sub.pts.length > 1 ? arclen(sub.pts, sub.closed) : 0), 0)

// share of a path's points that lie inside the object's mass (or on its outline)
function insideShare(p, fillSet) {
  if (!fillSet.length) return 0
  const pts = (p.subs || []).flatMap(s => s.pts)
  if (!pts.length) return 0
  return pts.filter(q => pointInSet(q, fillSet)).length / pts.length
}

// Set of icon.paths entries that carry the accent (empty set: no accent for this icon)
export function accentSet(icon) {
  const cap = icon.params ? Infinity : CAP.A
  const ps = (icon.paths || []).filter(p => p && p.d && !isGlyph(p))
  const len = new Map(ps.map(p => [p, pathLen(p)]))
  const total = ps.reduce((s, p) => s + len.get(p), 0) || 1
  const trim = (pool, c = cap) => {
    const keep = [...pool].sort((a, b) => len.get(a) - len.get(b))
    let sum = keep.reduce((s, p) => s + len.get(p), 0)
    while (keep.length && sum / total > c) sum -= len.get(keep.pop())
    return keep
  }
  const S = ps.filter(p => p.plate === 'S')
  if (S.length) { const k = trim(S, icon.params ? Infinity : CAP.S); if (k.length) return new Set(k) }
  const A = ps.filter(p => p.plate === 'A')
  const fs = icon.fillSet || []
  if (!A.length || A.length === ps.length || !fs.length) return new Set()
  const inner = trim(A.filter(p => insideShare(p, fs) >= 0.7))
  if (inner.length) return new Set(inner)
  const aLen = A.reduce((s, p) => s + len.get(p), 0)
  if (aLen / total <= cap) return new Set(A)
  return new Set()
}
