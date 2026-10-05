// Live-icon TEXT for style renderers (forge/DYNAMIC.md).
//
// Live icons draw their text with the stroke font (forge/dynamic/_font.mjs); every glyph path carries the id
// "text:<char>:<cap>:<n>". Static icons never do, so everything here is a no-op for them.
//
// Text sits in one of two places:
//   inside a filled frame (calendar tile, badge, file page)  the skeleton also knocks it out via `cutouts`, so a
//                                                            mass-building style already shows it as a groove.
//   free (no fill behind it: a bare clock face "09 41", the  a style that inflates, outlines or bevels every line
//   "31°" under a sun, "4G+", a gauge's value)               turns small glyphs into blobs. Such a style takes
//                                                            the free text out with splitText() and draws it as a
//                                                            plain round stroke in its own ink.
//
//   textInfo(path)          -> { ch, cap } | null
//   hasText(icon)           -> true when any path is a glyph
//   splitText(icon)         -> { icon, free: [{ d, ch, cap, plate, box }], inside: [...] }
//                              icon = the same prepared icon without the FREE glyph paths/lines (inside text kept)
//   textStroke(cap, base)   -> a stroke width for free text that keeps counters open at that cap height
//
// Added for the quality gate (all opt-in; nothing above changed behaviour):
//   TEXT_REF                -> 1.75, the stroke Line draws text with (the gate's reference weight)
//   textWeight(cap, opts)   -> a weight for free OR knocked-out text that never closes more counters than Line:
//                              opts { base = 2, ref = TEXT_REF, small = 6 } -> base at cap >= small, else min(base, ref).
//                              (textStroke(cap, base) is unchanged; textWeight caps small text at Line's weight
//                              instead of base - 0.25, which still closes 8 B 9 counters at cap 4-5.)
//   glyphWeight(g, opts)    -> textWeight for one glyph { ch, cap, box? | pts? }, except a degree sign "°": its ring
//                              is small (r = cap/4), so it is thinned to keep a visible hole (>= opts.hole = 0.35u
//                              radius, min 1u) instead of printing as a bullet "37•".
//   glyphLines(icon)        -> [{ pts, closed: false, ch, cap, plate, pathId }] every glyph centreline, OPEN
//                              (dots of . : ! ? included as one-point lines: stroke them as round dots).
//                              The kernel parser closes a subpath whose last point equals its first, so a "D" or
//                              "0" drawn as one stroke arrives as a closed RING: a fill-building style then fills it
//                              (a solid blob). These lines are always open (first point repeated at the end).
//   openText(icon)          -> the prepared icon with every glyph line AND every cutout subpath that traces a glyph
//                              re-opened (closed: false), so a mass style knocks glyphs out as lines, never as areas.
//                              Cutout subs that trace a glyph get `glyph: { ch, cap }`. No-op without text.
//   isGlyphSub(sub, lines)  -> true when every point of `sub` lies on one of glyphLines() (within 0.05u)
import { pointInRing, distToPolyline, parsePath } from '../kernel/geom.mjs'

const ID = /^text:(.):(\d+(?:\.\d+)?):\d+$/su

export function textInfo(p) {
  const m = p && typeof p.id === 'string' ? p.id.match(ID) : null
  return m ? { ch: m[1], cap: Number(m[2]) } : null
}
export const hasText = icon => (icon?.paths || []).some(p => textInfo(p))

function boxOf(subs) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const s of subs || []) for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return { x0, y0, x1, y1 }
}
// even-odd inside any fill
function inFills(icon, pt) {
  for (const f of icon.fills || []) {
    let n = 0
    for (const s of f.subs || []) if (s.pts.length > 2 && pointInRing(pt, s.pts)) n++
    if (n % 2) return true
  }
  return false
}

export function splitText(icon) {
  const free = [], inside = []
  if (!icon || !hasText(icon)) return { icon, free, inside }
  const drop = new Set()
  for (const p of icon.paths) {
    const t = textInfo(p)
    if (!t) continue
    const box = boxOf(p.subs)
    if (!Number.isFinite(box.x0)) continue
    const c = [(box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2]
    // a glyph is inside when its centre and most of its corners are inside a fill
    const probes = [c, [box.x0, box.y0], [box.x1, box.y0], [box.x0, box.y1], [box.x1, box.y1]]
    const hits = probes.filter(q => inFills(icon, q)).length
    const g = { d: p.d, ch: t.ch, cap: t.cap, plate: p.plate, box, id: p.id }
    if (inFills(icon, c) && hits >= 3) inside.push(g)
    else { free.push(g); drop.add(p.id) }
  }
  if (!drop.size) return { icon, free, inside }
  return {
    icon: {
      ...icon,
      paths: icon.paths.filter(p => !drop.has(p.id)),
      lines: (icon.lines || []).filter(l => !drop.has(l.pathId)),
    },
    free, inside,
  }
}

// stroke width for free text: the font is spaced for a 2u reference stroke; small caps get a touch thinner
export const textStroke = (cap, base = 2) => +(cap >= 6 ? base : Math.max(base - 0.25, 1.5)).toFixed(2)

// convenience: free glyphs as stroked path nodes
export function textNodes(free, attrs = {}) {
  return free.map(g => ['path', {
    d: g.d, fill: 'none', stroke: 'currentColor', 'stroke-width': textStroke(g.cap),
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs,
  }])
}

// scale an absolute path (M L H V C S Q T A Z, as the font writes them) by s about (12,12), then move it by dx, dy
const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }
export function shiftD(d, dx, dy, s = 1) {
  const X = x => 12 + (x - 12) * s + dx, Y = y => 12 + (y - 12) * s + dy
  const toks = String(d).match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || []
  const out = []
  let cmd = '', k = 0
  const f = n => String(+n.toFixed(3))
  for (const t of toks) {
    if (/[A-Za-z]/.test(t)) { cmd = t.toUpperCase(); k = 0; out.push(t); continue }
    let v = Number(t)
    const n = ARGS[cmd] || 2, i = k % n
    if (cmd === 'H') v = X(v)
    else if (cmd === 'V') v = Y(v)
    else if (cmd === 'A') { if (i < 2) v *= s; if (i === 5) v = X(v); if (i === 6) v = Y(v) }
    else if (i % 2 === 0) v = X(v)
    else v = Y(v)
    out.push(f(v)); k++
  }
  return out.join(' ').replace(/ ?([A-Za-z]) ?/g, '$1')
}

// ── quality-gate helpers (opt-in) ────────────────────────────────────────────────────────────────────────
export const TEXT_REF = 1.75
export const textWeight = (cap, { base = 2, ref = TEXT_REF, small = 6 } = {}) => +(cap >= small ? base : Math.min(base, ref)).toFixed(2)

const reopen = s => s.closed && s.pts.length > 2 ? { ...s, pts: [...s.pts, s.pts[0]], closed: false } : s
export function glyphLines(icon) {
  const out = []
  for (const p of icon?.paths || []) {
    const t = textInfo(p)
    if (!t) continue
    // per M-chunk, so a zero-length subpath (the dot of "." ":" "!" "?", which the parser drops) is kept as a point
    for (const chunk of String(p.d || '').split(/(?=[Mm])/)) {
      let subs = []
      try { subs = parsePath(chunk) } catch { subs = [] }
      if (!subs.length) {
        const m = chunk.match(/^M\s*(-?[\d.]+(?:e[-+]?\d+)?)[\s,]*(-?[\d.]+(?:e[-+]?\d+)?)/)
        if (m) out.push({ pts: [[+m[1], +m[2]]], closed: false, ch: t.ch, cap: t.cap, plate: p.plate || 'A', pathId: p.id })
        continue
      }
      for (const s of subs) out.push({ ...reopen(s), ch: t.ch, cap: t.cap, plate: p.plate || 'A', pathId: p.id })
    }
  }
  return out
}
export function isGlyphSub(sub, lines, tol = 0.05) {
  if (!sub?.pts?.length || !lines?.length) return null
  for (const l of lines) {
    if (sub.pts.every(q => distToPolyline(q, l.pts, false) <= tol)) return l
  }
  return null
}
export function openText(icon) {
  if (!icon || !hasText(icon)) return icon
  const gl = glyphLines(icon)
  const ids = new Set(gl.map(l => l.pathId))
  const lines = (icon.lines || []).map(l => ids.has(l.pathId) ? reopen(l) : l)
  const cutouts = (icon.cutouts || []).map(c => {
    let hit = false
    const subs = (c.subs || []).map(s => {
      const g = isGlyphSub(s, gl)
      if (!g) return s
      hit = true
      return { ...reopen(s), glyph: { ch: g.ch, cap: g.cap } }
    })
    return hit ? { ...c, subs } : c
  })
  return { ...icon, lines, cutouts }
}

export function glyphWeight(g, opts = {}) {
  const w = textWeight(g.cap, opts)
  if (g.ch !== '°') return w
  let r = g.cap / 4
  const b = g.box || (g.pts ? g.pts.reduce((o, [x, y]) => ({ x0: Math.min(o.x0, x), x1: Math.max(o.x1, x), y0: Math.min(o.y0, y), y1: Math.max(o.y1, y) }), { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity }) : null)
  if (b && Number.isFinite(b.x0)) r = Math.max(b.x1 - b.x0, b.y1 - b.y0) / 2
  return +Math.min(w, Math.max(1, 2 * (r - (opts.hole ?? 0.35)))).toFixed(2)
}
