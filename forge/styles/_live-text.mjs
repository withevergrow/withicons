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
import { pointInRing } from '../kernel/geom.mjs'

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
