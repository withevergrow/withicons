// with icons — shared parts for the LABEL family of Live icons (forge/DYNAMIC.md):
// tag-label, badge-text, ribbon-label, sale-sticker, price-tag, file-type, folder-label, keycap.
//
// The family problem: at 24 px a 1.75–2u stroke leaves room for about 18u of text across the whole live area,
// but a frame wall on each side costs 3.25u more per side (wall ink + 1.5u white + text ink). So text-bearing
// shapes here are drawn OPEN where the text runs: the frame keeps its silhouette above and below the text row
// and drops the wall segments the text would crowd. Filled styles get a closed mass (the frame silhouette plus
// a label band under the text) with the text knocked out, so every style reads as a label, not a crammed box.
//
//   fitLabel(str, box, opts)          largest cap (then slightly tighter tracking) that fits box, or null
//   fitFirst(forms, box, opts)        first of several candidate strings that fits -> { t, s } or null
//   fitLadder(s, box, opts, forms)    shrink, then drop a currency sign, then shorten; never blank -> { t, s }
//   shorter(s, forms)                 that ladder's candidate strings, longest first
//   textInk(t, plate)                 -> { paths:[{d,plate}], cutouts:[OPEN d] } for a text() result
//   openCutouts(paths)                open cutouts for drawn symbols (same rule as textInk)
//   wallCut(x, box)                   the y interval of a vertical wall the text would crowd, or null
//   clearPoint(a, c, box, clear)      how far along a->c a wall may run before crowding the text
//   cutPolygon(pts, box, clear)       a straight-sided frame split into the open runs that clear the text
//   bandAround(box) + bandLobes(...)  the label band under open text, merged into the body as ONE fill outline
//   polyD, boxDist, CLEAR             helpers
//
// Every generator tries "inside" first (text fits between closed walls at a good size) and only opens the
// frame when it must, so short text always gets the classic closed shape.
import { fitText, measure, asCutouts, clean, snap } from './_font.mjs'
import { parsePath } from '../kernel/geom.mjs'

export { snap }
export const CLEAR = 3.25 // 1.75 line stroke: 0.875 wall ink + 1.5 white + 0.875 text ink
const SIZES = new Map() // measure() memo: "text|cap|tracking" -> [width, height] (pure, so caching is safe)

// Largest legible fit. Tries every cap from maxCap down to minCap (0.25 steps) at natural spacing first, then
// slightly tighter tracking at the same cap before giving up a size: a bigger cap reads better than airier spacing.
export function fitLabel(str, box, { minCap = 4.5, maxCap = 7, tracking = [0, -0.25], valign = 'middle', align = 'center' } = {}) {
  const s = clean(str, 8)
  if (!s.trim()) return null
  const bw = box.x1 - box.x0 + 1e-9, bh = box.y1 - box.y0 + 1e-9
  const size = (c, tr) => {
    const k = `${s}|${c}|${tr}`
    let m = SIZES.get(k)
    if (!m) { if (SIZES.size > 4000) SIZES.clear(); const r = measure(s, { size: c, tracking: tr }); m = [r.width, r.box.y1 - r.box.y0]; SIZES.set(k, m) }
    return m
  }
  const fits = (c, tr) => { const [w, h] = size(c, tr); return w <= bw && h <= bh }
  // fail fast: nothing fits if the smallest, tightest setting does not (keeps build() well under 5 ms)
  if (!fits(minCap, -0.5)) return null
  // widths grow ~linearly with the cap: start near the largest cap that can fit instead of walking down to it
  let start = maxCap
  { const [w] = size(maxCap, tracking[0]); if (w > bw) start = Math.max(minCap, Math.min(maxCap, Math.ceil(maxCap * bw / w * 4) / 4 + 0.25)) }
  for (let c = start; c >= minCap - 1e-9; c = snap(c - 0.25)) {
    // last resort at the smallest size: half a unit tighter (ink gaps stay >= ~0.25u at a 1.75 stroke)
    for (const tr of c <= minCap + 1e-9 ? [...tracking, -0.5] : tracking) {
      if (!fits(c, tr)) continue
      const t = fitText(s, box, { prefer: c > 5 ? 'large' : 'small', minCap: c, maxCap: c, tracking: tr, valign, align })
      if (t && t.cap === c) return t
    }
  }
  return null
}

// Fit the first candidate that fits (generators pass the text first, then their fallbacks: "-50%" -> "50%",
// "$199" -> "199"; truncation is only the last resort for text no label can hold, e.g. "WWWW").
export function fitFirst(forms, box, opts) {
  for (const s of new Set(forms)) {
    if (!s) continue
    const t = fitLabel(s, box, opts)
    if (t) return { t, s }
  }
  return null
}

// The fallback ladder every label uses when the text does not fit its box: shrink first (fitLabel already goes
// down to minCap and half a unit tighter), then drop a currency / number sign that makes the text too tall or
// wide ("$999" -> "999"), and only then shorten it ("WWWW" -> "WWW" -> "WW" -> "W"). It never returns null for
// text that has at least one drawable character, so a label is never silently blank. `forms` lets a generator
// put its own preferred fallbacks first (sale-sticker: "-50%" -> "50%" -> "50").
export function shorter(s, forms = []) {
  const out = [s, ...forms]
  const bare = s.replace(/[$€£₹#]/g, '')
  if (bare && bare !== s) out.push(bare)
  for (let n = [...s].length - 1; n >= 1; n--) out.push([...s].slice(0, n).join(''))
  for (let n = [...bare].length - 1; n >= 1; n--) out.push([...bare].slice(0, n).join(''))
  return [...new Set(out.filter(x => x && x.trim()))]
}
export function fitLadder(s, box, opts = {}, forms = []) {
  s = String(s ?? '')
  // "$" is the one glyph taller than the caps (its stem pokes 0.75u above and below): it may use that much of the
  // clearance above and below the row (only its thin stem ends get there) before the sign is dropped
  const tall = /$/.test(s) && fitLabel(s, { ...box, y0: box.y0 - 0.75, y1: box.y1 + 0.75 }, opts)
  if (tall) return { t: tall, s }
  const hit = fitFirst(shorter(s, forms), box, opts)
  if (hit) return hit
  // last resort: the first drawable letter or digit at the smallest legible size, anywhere in the box
  const ch = [...clean(s, 8)].find(c => /[0-9A-Z]/.test(c))
  return ch ? fitFirst([ch], box, { ...opts, minCap: Math.min(opts.minCap ?? 4.5, 4) }) : null
}

// Text as skeleton parts. Cutouts must be OPEN: the kernel's parsePath marks a subpath closed when it ends on
// its own start point (B and D are drawn that way), and a closed cutout knocks out an AREA, which loses the stem.
// So such subpaths get an explicit Z first and asCutouts splits them into two open halves.
const closeLoops = d => String(d).split(/(?=M)/).map(sub => {
  sub = sub.trim()
  if (!sub || /[Zz]\s*$/.test(sub)) return sub
  const subs = parsePath(sub), s = subs[0]
  return s && s.closed ? sub + ' Z' : sub
}).filter(Boolean)
export const textInk = (t, plate = 'A') => ({
  paths: t ? t.paths.map(d => ({ d, plate })) : [],
  cutouts: t ? asCutouts(t.paths.flatMap(closeLoops)) : [],
})

// open cutouts for any drawn glyphs (symbols), same rule as textInk
export const openCutouts = paths => asCutouts([].concat(paths).flatMap(closeLoops))


// ── polygon helpers (for shapes built from straight segments: bursts, tags) ─────────────────────────────
const f = n => String(snap(n))
export const polyD = (pts, closed) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + (closed ? ' Z' : '')

// distance from point to an axis-aligned box
export const boxDist = ([x, y], b) => Math.hypot(Math.max(b.x0 - x, 0, x - b.x1), Math.max(b.y0 - y, 0, y - b.y1))

// Split a CLOSED polygon into the open runs whose every point stays >= `clear` from box `b`. Segments that
// enter the clearance zone are trimmed at the boundary (point snapped to 0.25). Returns [[pt...], ...] runs
// with >= 2 points; [] if nothing survives. If nothing is close, returns null (draw the polygon closed).
export function cutPolygon(pts, b, clear) {
  const n = pts.length
  const ok = p => boxDist(p, b) >= clear - 1e-6
  // the point of segment a->c nearest the box (distance to a box is convex along a line: ternary search)
  const nearest = (a, c) => {
    let lo = 0, hi = 1
    const at = t => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t]
    for (let i = 0; i < 40; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (boxDist(at(m1), b) <= boxDist(at(m2), b)) hi = m2; else lo = m1 }
    return at((lo + hi) / 2)
  }
  // a frame whose corners all clear can still pass too close along a side (a long word beside a straight wall)
  if (pts.every((p, i) => ok(p) && ok(nearest(p, pts[(i + 1) % n])))) return null
  // start from an ok vertex so runs do not wrap
  const s = pts.findIndex(ok)
  if (s < 0) return []
  const runs = []
  let cur = [pts[s]]
  const edge = (a, c) => { // a ok, c not ok (or reverse): point on a->c at the clearance boundary
    let lo = 0, hi = 1
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; const p = [a[0] + (c[0] - a[0]) * m, a[1] + (c[1] - a[1]) * m]; if (ok(p)) lo = m; else hi = m }
    // step back toward a so the snapped point still clears
    for (let t = lo; t >= 0; t -= 0.02) { const p = [snap(a[0] + (c[0] - a[0]) * t), snap(a[1] + (c[1] - a[1]) * t)]; if (ok(p)) return p }
    return a
  }
  for (let k = 1; k <= n; k++) {
    const a = pts[(s + k - 1) % n], c = pts[(s + k) % n]
    const ao = ok(a), co = ok(c)
    if (ao && co) {
      // whole segment must clear too (its middle can dip into the zone)
      const mid = nearest(a, c)
      if (ok(mid)) cur.push(c)
      else { cur.push(edge(a, mid)); if (cur.length >= 2) runs.push(cur); cur = [edge(c, mid), c] }
    } else if (ao && !co) { cur.push(edge(a, c)); if (cur.length >= 2) runs.push(cur); cur = [] }
    else if (!ao && co) { cur = [edge(c, a), c] }
  }
  if (cur.length >= 2) runs.push(cur)
  // merge last run into first if it ended at the start vertex
  if (runs.length > 1) {
    const first = runs[0], last = runs.at(-1)
    const L = last.at(-1), F = first[0]
    if (L[0] === F[0] && L[1] === F[1]) { runs[0] = [...last, ...first.slice(1)]; runs.pop() }
  }
  return runs.filter(r => r.length >= 2 && r.some((p, i) => i && (p[0] !== r[0][0] || p[1] !== r[0][1])))
}

// the point on segment a->c that is farthest from `a` while every point from a to it clears box b
export function clearPoint(a, c, b, clear) {
  const at = t => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t]
  let t = 0
  for (let k = 1; k <= 200; k++) { if (boxDist(at(k / 200), b) < clear - 1e-6) break; t = k / 200 }
  for (; t >= 0; t -= 0.005) { const p = at(t).map(v => snap(v)); if (boxDist(p, b) >= clear - 1e-6) return p }
  return a
}

// the open interval [y0, y1] of a vertical wall at x that text box b would crowd (null if it clears)
export function wallCut(x, b, clear = CLEAR) {
  const dx = Math.max(b.x0 - x, 0, x - b.x1)
  if (dx >= clear) return null
  const dy = Math.sqrt(clear * clear - dx * dx)
  return [Math.floor((b.y0 - dy) * 4) / 4, Math.ceil((b.y1 + dy) * 4) / 4]
}

// A band that sticks out of a body's straight side walls, as ONE outline (styles read `fills` even-odd, so an
// overlapping second fill would cancel the overlap). `band` {x0,y0,x1,y1}; the body's left wall is the vertical
// line x = wl and its right wall x = wr, both straight across band.y0..band.y1. Returns the two side lobes as
// path fragments: left lobe drawn going UP the left wall, right lobe going DOWN the right wall.
export function bandLobes(band, wl, wr, r = 1.5) {
  const { x0, y0, x1, y1 } = band
  const L = x0 < wl - 0.01
    ? `V${f(y1)} H${f(x0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0)} ${f(y1 - r)} V${f(y0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0 + r)} ${f(y0)} H${f(wl)} `
    : ''
  const R = x1 > wr + 0.01
    ? `V${f(y0)} H${f(x1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y0 + r)} V${f(y1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1 - r)} ${f(y1)} H${f(wr)} `
    : ''
  return { L, R }
}
// the label band around a text box: 1.5u past the text ends (clamped to the live area), 2u above and below
export const bandAround = (b, { dx = 1.5, dy = 2, lo = 2, hi = 22 } = {}) => ({
  x0: Math.max(lo, Math.floor((b.x0 - dx) * 2) / 2), x1: Math.min(hi, Math.ceil((b.x1 + dx) * 2) / 2),
  y0: Math.floor((b.y0 - dy) * 2) / 2, y1: Math.ceil((b.y1 + dy) * 2) / 2,
})
