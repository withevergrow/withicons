// with icons — shared parts for the COUNT family of Live icons (bell-count, mail-count, cart-count, chat-count,
// app-badge, inbox-count). forge/DYNAMIC.md.
//
// One idea: a static sibling (bell, mail, ...) plus a count badge on plate S.
//   count 0          -> no badge: the base is drawn exactly like its static sibling
//   dot mode         -> a solid dot, no number
//   1..9             -> a round badge with one digit
//   10..99           -> a 9u-tall rounded tag with two digits
//   above the limit  -> "99+" (or "9+" when the limit is 9), the "+" a size smaller
// The base is scaled toward the corner opposite the badge (PARTS.md: "scale ~80% toward the upper-left so the
// badge fits") and then TRIMMED analytically: lines stay lines and arcs stay arcs, so every style draws the cut
// base exactly as it draws the static icon. Fills are trimmed with the kernel booleans.
//
//   countIcon(base, { count, dotOnly, limit, corner, scales, badge }) -> skeleton { paths, fills, cutouts }
//   pathLength(ds)       total centreline length (check-dynamic: a badged base keeps >= 55% of it)
//   clipD(d, keep)       trim a path to where keep([x, y]) holds; lines stay lines, arcs stay arcs
// The badge defaults to the TOP-RIGHT corner (the universal place for notification counts: the bell, cart and
// chat bases are widest at the bottom, so a top-right badge cuts far less of them); "bottom-right" is a param.
//   countLabel(count, limit)                                   -> '' | '7' | '42' | '99+' | '9+'
//   COUNT_PARAMS(defaults)                                     -> the shared params block
//   countExamples(extra)                                       -> the shared examples
import { setD, parsePath } from '../kernel/geom.mjs'
import { setOf, differenceSets } from '../kernel/bool.mjs'
import { text, measure, asCutouts, snap } from './_font.mjs'

const f = n => String(snap(n))
const TAU = Math.PI * 2

// ── a tiny exact path model: absolute M L H V A Z (all our bases use only these) ──────────────────────────
// sub = { segs: [{t:'L', a, b} | {t:'A', c, r, a0, a1}], closed }
function arcCenter([x1, y1], [x2, y2], r, large, sweep) {
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
  const d2 = dx * dx + dy * dy
  if (r * r < d2) r = Math.sqrt(d2)
  let k = Math.sqrt(Math.max(0, (r * r - d2) / d2))
  if (large === sweep) k = -k
  const cx = k * dy + (x1 + x2) / 2, cy = -k * dx + (y1 + y2) / 2
  let a0 = Math.atan2(y1 - cy, x1 - cx), a1 = Math.atan2(y2 - cy, x2 - cx)
  let span = a1 - a0
  if (sweep && span < 0) span += TAU
  if (!sweep && span > 0) span -= TAU
  return { t: 'A', c: [cx, cy], r, a0, a1: a0 + span }
}
export function parse(d) {
  const tok = d.match(/[MLHVAZ]|-?(?:\d+\.?\d*|\.\d+)/g) || []
  const subs = []
  let i = 0, cmd = '', cur = null, p = [0, 0], start = [0, 0]
  const n = () => parseFloat(tok[i++])
  const isNum = () => i < tok.length && !/^[A-Z]$/.test(tok[i])
  while (i < tok.length) {
    if (!isNum()) cmd = tok[i++]
    if (cmd === 'M') { p = [n(), n()]; start = p; cur = { segs: [], closed: false }; subs.push(cur); cmd = 'L'; continue }
    if (cmd === 'Z') { if (Math.hypot(p[0] - start[0], p[1] - start[1]) > 1e-6) cur.segs.push({ t: 'L', a: p, b: start }); cur.closed = true; p = start; continue }
    let q
    if (cmd === 'L') q = [n(), n()]
    else if (cmd === 'H') q = [n(), p[1]]
    else if (cmd === 'V') q = [p[0], n()]
    else if (cmd === 'A') { const r = n(); n(); n(); const large = n(), sweep = n(); q = [n(), n()]; cur.segs.push(arcCenter(p, q, r, large, sweep)); p = q; continue }
    else throw new Error('parts-counts: unsupported command ' + cmd)
    cur.segs.push({ t: 'L', a: p, b: q }); p = q
  }
  return subs
}
const at = (s, t) => s.t === 'L'
  ? [s.a[0] + (s.b[0] - s.a[0]) * t, s.a[1] + (s.b[1] - s.a[1]) * t]
  : [s.c[0] + s.r * Math.cos(s.a0 + (s.a1 - s.a0) * t), s.c[1] + s.r * Math.sin(s.a0 + (s.a1 - s.a0) * t)]
const len = s => s.t === 'L' ? Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) : Math.abs(s.a1 - s.a0) * s.r
const part = (s, t0, t1) => s.t === 'L' ? { t: 'L', a: at(s, t0), b: at(s, t1) } : { ...s, a0: s.a0 + (s.a1 - s.a0) * t0, a1: s.a0 + (s.a1 - s.a0) * t1 }

function scaleSubs(subs, k, [ox, oy]) {
  const P = ([x, y]) => [ox + (x - ox) * k, oy + (y - oy) * k]
  return subs.map(sb => ({ closed: sb.closed, segs: sb.segs.map(s => s.t === 'L' ? { t: 'L', a: P(s.a), b: P(s.b) } : { ...s, c: P(s.c), r: s.r * k }) }))
}

// keep the parts of each sub where keep(point) is true. Exact cut points by bisection.
function clipSubs(subs, keep, minLen = 1) {
  const out = []
  for (const sb of subs) {
    const pieces = [] // {s, t0, t1, si}
    sb.segs.forEach((s, si) => {
      const n = Math.max(4, Math.ceil(len(s) / 0.2))
      let prevT = 0, prevK = keep(at(s, 0)), runStart = prevK ? 0 : null
      const edge = (ta, tb, ka) => { for (let k = 0; k < 24; k++) { const m = (ta + tb) / 2; if (keep(at(s, m)) === ka) ta = m; else tb = m } return (ta + tb) / 2 }
      for (let j = 1; j <= n; j++) {
        const t = j / n, k = keep(at(s, t))
        if (k !== prevK) {
          const e = edge(prevT, t, prevK)
          if (prevK) { pieces.push({ s, t0: runStart, t1: e, si }); runStart = null } else runStart = e
        }
        prevT = t; prevK = k
      }
      if (prevK) pieces.push({ s, t0: runStart, t1: 1, si })
    })
    // chain pieces that continue across segment joints
    const runs = []
    for (const pc of pieces) {
      const last = runs.at(-1), lp = last && last.at(-1)
      if (lp && lp.t1 === 1 && pc.t0 === 0 && pc.si === lp.si + 1) last.push(pc)
      else runs.push([pc])
    }
    const whole = pieces.length === sb.segs.length && pieces.every(p => p.t0 === 0 && p.t1 === 1)
    if (whole) { out.push({ closed: sb.closed, segs: sb.segs }); continue }
    if (sb.closed && runs.length > 1) {
      const first = runs[0][0], last = runs.at(-1).at(-1)
      if (first.si === 0 && first.t0 === 0 && last.si === sb.segs.length - 1 && last.t1 === 1) runs[0] = [...runs.pop(), ...runs[0]]
    }
    for (const r of runs) {
      const segs = r.map(p => part(p.s, p.t0, p.t1)).filter(s => len(s) > 0.05)
      if (segs.length && segs.reduce((a, s) => a + len(s), 0) >= minLen) out.push({ closed: false, segs })
    }
  }
  return out
}

// serialise on the 0.25 grid; arcs stay arcs
function toD(subs) {
  let d = ''
  for (const sb of subs) {
    const p0 = at(sb.segs[0], 0)
    d += `M${f(p0[0])} ${f(p0[1])}`
    sb.segs.forEach((s, i) => {
      if (sb.closed && i === sb.segs.length - 1 && s.t === 'L') return // Z closes it
      const q = at(s, 1)
      if (s.t === 'L') d += ` L${f(q[0])} ${f(q[1])}`
      else {
        const span = s.a1 - s.a0
        d += ` A${f(Math.max(0.25, s.r))} ${f(Math.max(0.25, s.r))} 0 ${Math.abs(span) > Math.PI ? 1 : 0} ${span > 0 ? 1 : 0} ${f(q[0])} ${f(q[1])}`
      }
    })
    if (sb.closed) d += ' Z'
    d += ' '
  }
  return d.trim().replace(/ (?=M)/g, ' ')
}
// trim any M L H V A Z path to the parts where keep([x, y]) is true: lines stay lines, arcs stay arcs.
// Used by other families too (speech-bubble-text opens its walls where a long word passes).
export function clipD(d, keep, minLen = 1) { return toD(clipSubs(parse(d), keep, minLen)) }

function toPoly(sb, step = 0.5) {
  const pts = []
  for (const s of sb.segs) { const n = Math.max(1, Math.ceil(len(s) / step)); for (let j = 0; j < n; j++) pts.push(at(s, j / n)) }
  return pts
}

export function countLabel(count, limit = '99+') {
  const n = Math.max(0, Math.floor(+count || 0))
  if (!n) return ''
  const max = limit === '9+' ? 9 : 99
  return n > max ? `${max}+` : String(n)
}

// Badge geometry. Edges sit on the static family's 21.5 / 2.5 keylines.
//
// The badge is an ACCENT, not the icon: it stays 9u tall (centreline; ~10.75u of ink) whatever the count, and a
// number badge is a rounded rectangle hugging its digits (a capsule would add a whole badge-height of empty end
// caps). "99+" sets its "+" a size smaller so the tag stays ~15u wide. The base keeps >= 80% of its size,
// anchored in the corner opposite the badge (the Material / SF Symbols pattern), and loses only the corner the
// badge sits in: check-dynamic fails a count icon whose base keeps less than 55% of its centreline length.
const EDGE = 21.5, TOP = 2.5
const CLEAR = 3.25 // centreline clearance base <-> badge: 1u badge ink + 1.25u white + 1u base ink
const PAD = 2.25   // badge centreline -> text centreline: 0.875u ring ink + 0.5u white + 0.875u text ink
// badge sizes, overridable per icon through countIcon's `badge` option
export const BADGE = {
  dotR: 2,            // dot ring centreline radius: ink 6u across, a ring in line, a disc in filled styles
  r1: 4.5, cap1: 4.5, // one digit: a circle (centreline 9u)
  h: 9, cap2: 4,      // two or more characters: a rounded rectangle 9u tall
  rc: 3.5,            // its corner radius
  plusCap: 2.75,      // the "+" of "99+" / "9+"
}

// the label as text: digits at `cap`, a trailing "+" a size smaller, centred on the digits' cap middle
function labelText(label, cap, plusCap, x, y) {
  const plus = label.endsWith('+') && label.length > 1
  if (!plus) return text(label, { x, y, size: cap, tracking: label.length > 1 ? -0.25 : 0 })
  const digits = label.slice(0, -1)
  const wd = measure(digits, { size: cap, tracking: -0.5 }).width, wp = measure('+', { size: plusCap }).width, gap = 0.5
  const x0 = snap(x - (wd + gap + wp) / 2)
  const d = text(digits, { x: x0, y, size: cap, align: 'left', tracking: -0.5 })
  const p = text('+', { x: snap(d.box.x1 + gap), y, size: plusCap, align: 'left' })
  return { paths: [...d.paths, ...p.paths], box: { x0: d.box.x0, y0: d.box.y0, x1: p.box.x1, y1: d.box.y1 } }
}

function layoutBadge(label, dot, corner, o) {
  const top = corner === 'top-right'
  if (dot) {
    const r = o.dotR, c = Math.max(r + 0.5, 2.5), cx = EDGE - c, cy = top ? TOP + c : EDGE - c
    return { dot: true, kind: 'circle', cx, cy, r }
  }
  if (label.length === 1) {
    const r = o.r1, cx = EDGE - r, cy = top ? TOP + r : EDGE - r
    return { kind: 'circle', cx, cy, r, cap: o.cap1 }
  }
  // the rectangle grows just enough for the actual glyph ink
  const probe = labelText(label, o.cap2, o.plusCap, 0, 0)
  const w = Math.max(o.h, Math.ceil((probe.box.x1 - probe.box.x0 + 2 * PAD) * 2) / 2)
  const y0 = top ? TOP : EDGE - o.h
  return { kind: 'rect', x0: EDGE - w, y0, x1: EDGE, y1: y0 + o.h, rc: Math.min(o.rc, o.h / 2), cap: o.cap2, plusCap: o.plusCap }
}
// signed distance from a point to the badge centreline shape (> 0 outside)
function badgeDist([x, y], B) {
  if (B.kind === 'circle') return Math.hypot(x - B.cx, y - B.cy) - B.r
  const r = B.rc
  const qx = Math.abs(x - (B.x0 + B.x1) / 2) - ((B.x1 - B.x0) / 2 - r), qy = Math.abs(y - (B.y0 + B.y1) / 2) - ((B.y1 - B.y0) / 2 - r)
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}
// the badge outline grown by g, as a polygon (for the fill moat)
function badgeRing(B, g, n = 8) {
  const pts = []
  if (B.kind === 'circle') {
    for (let k = 0; k < 4 * n; k++) { const t = TAU * k / (4 * n); pts.push([B.cx + (B.r + g) * Math.cos(t), B.cy + (B.r + g) * Math.sin(t)]) }
    return pts
  }
  const r = B.rc + g, x0 = B.x0 + B.rc, x1 = B.x1 - B.rc, y0 = B.y0 + B.rc, y1 = B.y1 - B.rc
  for (const [cx, cy, a0] of [[x1, y0, -90], [x1, y1, 0], [x0, y1, 90], [x0, y0, 180]])
    for (let k = 0; k <= n; k++) { const t = (a0 + 90 * k / n) * Math.PI / 180; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]) }
  return pts
}
function badgeD(B) {
  if (B.kind === 'circle') return `M${f(B.cx + B.r)} ${f(B.cy)} A${f(B.r)} ${f(B.r)} 0 0 1 ${f(B.cx - B.r)} ${f(B.cy)} A${f(B.r)} ${f(B.r)} 0 0 1 ${f(B.cx + B.r)} ${f(B.cy)} Z`
  const { x0, y0, x1, y1, rc: r } = B
  return `M${f(x0 + r)} ${f(y0)} H${f(x1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y0 + r)} V${f(y1 - r)} A${f(r)} ${f(r)} 0 0 1 ${f(x1 - r)} ${f(y1)} H${f(x0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0)} ${f(y1 - r)} V${f(y0 + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0 + r)} ${f(y0)} Z`
}

// how much the base shrinks toward the far corner, per badge kind (overridable per icon)
export const DEFAULT_SCALES = { dot: 1, one: 0.85, two: 0.8, three: 0.8 }
const MIN_KEEP = 0.55 // share of the base's (scaled) centreline a "99+" tag must leave, else it shows "9+"

// total centreline length of path data (check-dynamic: the base must keep >= 55% of it next to a badge)
export const pathLength = ds => [].concat(ds).reduce((a, d) => a + parse(d).reduce((b, sb) => b + sb.segs.reduce((c, sg) => c + len(sg), 0), 0), 0)

export function countIcon(base, { count = 0, dotOnly = false, limit = '99+', corner = 'top-right', scales = {}, anchor, badge = {}, minKeep = MIN_KEEP } = {}) {
  // tolerate unset / unknown enum values (a runtime may pass false or undefined)
  if (limit !== '9+') limit = '99+'
  if (corner !== 'bottom-right') corner = 'top-right'
  dotOnly = dotOnly === true
  const label = countLabel(count, limit)
  const top = corner === 'top-right'
  const sc = { ...DEFAULT_SCALES, ...scales }
  const parsed = {
    paths: base.paths.map(p => ({ plate: p.plate, subs: parse(p.d) })),
    fills: (base.fills || []).map(parse),
    cutouts: (base.cutouts || []).map(parse),
  }
  if (!label) { // no badge: the static sibling, on the 0.25 grid
    return {
      paths: parsed.paths.map(p => ({ d: toD(p.subs), plate: p.plate })),
      fills: parsed.fills.map(toD),
      cutouts: parsed.cutouts.map(toD),
    }
  }
  const B = layoutBadge(label, dotOnly, corner, { ...BADGE, ...badge })
  const kind = B.dot ? 'dot' : label.length === 1 ? 'one' : label.length === 2 ? 'two' : 'three'
  const k = sc[kind]
  const o = anchor ? (top ? [anchor[0], 24 - anchor[1]] : anchor) : (top ? [2.5, 21.5] : [2.5, 2.5])
  const keep = p => badgeDist(p, B) >= CLEAR
  const T = subs => k === 1 ? subs : scaleSubs(subs, k, o)
  const paths = []
  for (const p of parsed.paths) {
    const subs = clipSubs(T(p.subs), keep)
    if (subs.length) paths.push({ d: toD(subs), plate: p.plate })
  }
  // a "99+" tag that would eat the base (the bell's dome, ...) gives way to the compact "9+" (still true: more
  // than nine), so the icon never turns into a number pill on a stub
  if (label.length > 2 && !dotOnly && limit !== '9+') {
    const whole = pathLength(base.paths.map(x => x.d)) * k
    if (pathLength(paths.map(x => x.d)) < minKeep * whole) return countIcon(base, { count, dotOnly, limit: '9+', corner, scales, anchor, badge })
  }
  const cutouts = []
  for (const c of parsed.cutouts) { const subs = clipSubs(T(c), keep); if (subs.length) cutouts.push(toD(subs)) }
  // fills: subtract the badge grown by its ink + white gap so solid shows a clean moat
  const moat = setOf([badgeRing(B, CLEAR - 1)])
  const fills = []
  for (const fl of parsed.fills) {
    const set = setOf(T(fl).map(sb => toPoly(sb)))
    const cut = differenceSets(set, moat)
    const d = setD(cut, 0.04)
    if (d) fills.push(d)
  }
  // the badge
  const ring = badgeD(B)
  if (B.dot) {
    // a ring: filled styles fill it (fills), line styles show the family badge ring. An inner ring or stub would
    // be carved off as a separate detail by solid (a donut), so the dot stays a single closed path.
    paths.push({ d: ring, plate: 'S' })
    fills.push(ring)
    return { paths, fills, cutouts }
  }
  const cx = B.kind === 'circle' ? B.cx : (B.x0 + B.x1) / 2, cy = B.kind === 'circle' ? B.cy : (B.y0 + B.y1) / 2
  const t = labelText(label, B.cap, B.plusCap, snap(cx), snap(cy))
  paths.push({ d: ring, plate: 'S' })
  for (const d of t.paths) paths.push({ d, plate: 'S' })
  fills.push(ring)
  cutouts.push(...asCutouts(t.paths))
  return { paths, fills, cutouts, shown: label }
}

// ── check hooks (forge/tools/check-dynamic.mjs) ────────────────────────────────────────────────────────────
// what a count icon writes for params: '' (no badge / dot) | '7' | '42' | '99+' | '9+'
export const countShows = (base, p, opts = {}) => (p.dotOnly === true ? '' : countIcon(base, { ...p, ...opts }).shown || '')
// how much of the (scaled) base's centreline survives next to the badge, 0..1. Below ~0.55 the base stops
// reading as a bell / envelope / cart and the icon turns into a number pill.
export function keptRatio(base, p, opts = {}) {
  const sk = countIcon(base, { ...p, ...opts })
  const label = p.dotOnly === true ? countLabel(p.count) : sk.shown
  if (!label) return 1
  const kind = p.dotOnly === true ? 'dot' : label.length === 1 ? 'one' : label.length === 2 ? 'two' : 'three'
  const k = { ...DEFAULT_SCALES, ...(opts.scales || {}) }[kind]
  const total = pathLength(base.paths.map(x => x.d)) * k
  return pathLength(sk.paths.filter(x => x.plate !== 'S').map(x => x.d)) / total
}

// ── shared params / examples / vocabulary ───────────────────────────────────────────────────────────────
export function countParams({ count = 3, corner = 'top-right' } = {}) {
  return {
    count: { type: 'int', min: 0, max: 9999, default: count, label: 'Count (0 hides the badge)' },
    dotOnly: { type: 'bool', default: false, label: 'Dot only (no number)' },
    limit: { type: 'enum', options: ['99+', '9+'], default: '99+', label: 'Biggest number shown' },
    corner: { type: 'enum', options: ['top-right', 'bottom-right'], default: corner, label: 'Badge corner' },
  }
}
export const countExamples = (extra = {}) => [
  { count: 0, ...extra },
  { count: 3, ...extra },
  { count: 42, ...extra },
  { count: 128, ...extra },
  { count: 5, dotOnly: true, ...extra },
  { count: 12, limit: '9+', corner: 'bottom-right', ...extra },
]
