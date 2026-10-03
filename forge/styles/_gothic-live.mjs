// GOTHIC Live: the Live icons (forge/DYNAMIC.md) built like their static siblings.
//
//   LIVE[name](icon, g) -> parts | null   a whole composition from icon.params (g = the kit);
//                                          null falls back to the automatic composer
//   dress(icon, parts, g) -> parts         the automatic composition of any other Live icon,
//                                          given its family architecture (a crocketed crest on
//                                          tablets, a ruby header on calendars)
//
// What is never lit (a star still to earn, a bar or wave without signal, the rest of a progress
// track) is not a ghost dot: it is the same piece of architecture glazed in dark recessed glass,
// so "2 of 4" reads by light, in light and dark themes alike.
import * as F from './_gothic-field.mjs'
import { tablet } from './_gothic-auto.mjs'
import { EXEMPLAR } from './_gothic-exemplars.mjs'
import { REDRAW } from './_gothic-redraws.mjs'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const RAD = Math.PI / 180
const isText = l => String(l.pathId || '').startsWith('text:')
const textLines = icon => (icon.lines || []).filter(isText)
const capOf = ls => Math.max(4, ...ls.map(l => +String(l.pathId).split(':')[2] || 5))
// gilt lettering from the skeleton's text lines (already laid out by the generator)
const letters = (g, ls, o = {}) => ls.length ? g.gilt(g.stroke(ls.map(l => l.pts), o.w ?? clamp(capOf(ls) * 0.2, 1.05, 1.4)), { plate: 'A', outline: 0.3, thin: true, glint: false, ...o }) : null

// dark recessed glass: an unlit pane (still glazed, still leaded)
const DARK = { glow: 0.07, dark: 0.15, glint: false }
const unlit = (g, F0, o = {}) => g.glass(F0, 'ink', { ...DARK, ...o })

// ---------------------------------------------------------------------------------------------
// rating: gold glass stars in gilt bezels; stars still to earn are dark glass in a stone bezel
const SLOTS = [[4.75, 8.25], [12, 8.25], [19.25, 8.25], [8.25, 15.5], [15.75, 15.5]]
function ratingStars(icon, g) {
  const q = icon.params || {}
  if (q.layout === 'score') return null
  const r = Math.round(clamp(Number(q.rating) || 0, 0, 5) * 2) / 2
  const R = 3.05, ri = R * 0.46
  const out = []
  SLOTS.forEach(([x, y0], i) => {
    const y = y0 + 0.35
    const S = g.star(x, y, R, ri, 5)
    const inner = g.shrink(S, 0.62)
    if (r >= i + 1) {
      out.push(g.gilt(S, { glint: false }), g.glass(inner, 'c3', { outline: 0.22, glow: 0.3, glint: false }))
    } else if (r >= i + 0.5) {
      out.push(g.gilt(S, { glint: false }))
      out.push(unlit(g, g.inter(inner, g.rect(x, 0, 24, 24)), { outline: 0.22 }))
      out.push(g.glass(g.inter(inner, g.rect(0, 0, x, 24)), 'c3', { outline: 0.22, glow: 0.3, glint: false }))
    } else if (q.empty !== 'hidden' || r === 0) {
      const s = q.empty === 'small stars' ? 0.78 : 1
      const Su = s === 1 ? S : g.star(x, y, R * s, ri * s, 5)
      out.push(g.stone(Su, { thin: true }), unlit(g, g.shrink(Su, 0.55 * s), { outline: 0.22 }))
    }
  })
  return out
}

// ---------------------------------------------------------------------------------------------
// signal: the static signal's four lancet lights; the dark ones are unlit glass
const LIGHTS = [[2.6, 14.4, 6.2], [7.6, 10.6, 11.2], [12.6, 6.8, 16.2], [17.6, 2.8, 21.2]]
function signalBars(icon, g) {
  const q = icon.params || {}
  const n = clamp(Math.round(Number(q.bars) || 0), 0, 4)
  const out = []
  LIGHTS.forEach(([x0, top, x1], i) => {
    if (i < n) out.push(...g.window(x0, top, x1, 21.2, i === 3 ? 'c3' : 'c2', { k: 1.2, frame: 1 }))
    else if (q.ghost !== false) out.push(...g.window(x0, top, x1, 21.2, 'ink', { k: 1.2, frame: 1, glass: { ...DARK } }))
  })
  if (!out.length) out.push(g.stone(g.rr(2.6, 19.4, 21.2, 21.2, 0.6), { thin: true }))
  if (n === 0 && q.noSignal !== false) out.push(...g.badge('x', 6.2, 6.6, 3.7, 'c1'))
  return out
}

// ---------------------------------------------------------------------------------------------
// wifi: the static wifi's three pointed archivolts (stone bands glazed in glass), a ruby boss
function ogive(cx, cy, r, a0 = -141, e = 0) {
  const R = r + e, aT = -180 + Math.acos(e / R) / RAD
  const n = Math.max(3, Math.ceil(Math.abs(aT - a0) * RAD * R / 0.5)), left = []
  for (let k = 0; k <= n; k++) { const a = (a0 + (aT - a0) * k / n) * RAD; left.push([cx + e + R * Math.cos(a), cy + R * Math.sin(a)]) }
  return [...left, ...left.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y])]
}
function wifiStrength(icon, g) {
  const q = icon.params || {}
  const n = clamp(Math.round(Number(q.strength) || 0), 0, 3)
  const pts = r => ogive(12, 19.2, r, -141, r * 0.2)
  const band = (r, role, lit, plate) => [
    g.stone(g.stroke(pts(r), 3), { plate, thin: true }),
    lit ? g.glass(g.stroke(pts(r), 1.25), role, { plate, outline: 0.34, glow: 0.34, glint: false })
      : unlit(g, g.stroke(pts(r), 1.25), { plate, outline: 0.34 }),
  ]
  const out = []
  const R = [3.5, 7.2, 11], roles = ['c3', 'c2', 'c2']
  for (let i = 2; i >= 0; i--) {
    if (i < n) out.push(...band(R[i], roles[i], true, i === 2 ? 'A' : 'K'))
    else if (q.ghost !== false) out.push(...band(R[i], roles[i], false, 'K'))
  }
  if (n === 3) out.splice(2, 0, g.shine(g.stroke(pts(11).slice(3, 12), 0.36), { op: 0.8, plate: 'A' }))
  out.push(g.gilt(g.circle(12, 19.2, 1.65), { glint: false }), g.glass(g.circle(12, 19.2, 1.0), n ? 'c1' : 'ink', { outline: 0.22, glow: 0.3, glint: false }))
  return out
}

// ---------------------------------------------------------------------------------------------
// progress: a carved stone ring, the progress a channel of gold glass in it, the rest of the track
// dark glass; the centre a sapphire medallion carrying the number (or a gilt check, or a rose)
function progressRing(icon, g) {
  const q = icon.params || {}
  const v = clamp(Math.round(Number(q.value) || 0), 0, 100)
  const CX = 12, CY = 12, R = 9.3
  const arcPts = (a0, a1) => { const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 4)), o = []; for (let k = 0; k <= n; k++) { const a = (a0 + (a1 - a0) * k / n - 90) * RAD; o.push([CX + R * Math.cos(a), CY + R * Math.sin(a)]) } return o }
  const ring = g.ring(CX, CY, R, 3)
  const ch = 1.35
  const out = [g.stone(ring, { thin: true })]
  if (q.track !== false && v < 100) out.push(unlit(g, g.ring(CX, CY, R, ch), { outline: 0.2 }))
  if (v >= 100) out.push(g.glass(g.ring(CX, CY, R, ch), 'c3', { outline: 0.22, glow: 0.3, glint: false, plate: 'A' }))
  else if (v > 0) out.push(g.glass(g.stroke(arcPts(0, Math.max(v * 3.6, 8)), ch), 'c3', { outline: 0.22, glow: 0.3, glint: false, plate: 'A' }))
  // hour studs on the stone, like the static clock
  out.push(g.studs([0, 90, 180, 270].map(a => [CX + R * Math.cos(a * RAD), CY + R * Math.sin(a * RAD)]), 0.42))
  const T = textLines(icon)
  if (q.number !== false) {
    out.push(...g.pane(g.circle(CX, CY, 6.2), 'c2', { frame: 1, tracery: 'none', glass: { dark: 0.4, glow: 0.12 } }))
    if (v >= 100) out.push(g.gilt(g.glyph('check', CX - 0.2, CY + 0.2, 1, 1.7), { plate: 'A', thin: true, glint: false, outline: 0.32 }))
    else out.push(letters(g, T))
  } else {
    // no number: a rose medallion in the centre
    out.push(...g.rose(CX, CY, 4.6, 'c2', { n: 8, frame: 1.1, medal: 'c3' }))
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// the score: the star exemplar over the reading, which sits on a tablet
function ratingScore(icon, g) {
  const q = icon.params || {}
  if (q.layout !== 'score') return null
  const r = Math.round(clamp(Number(q.rating) || 0, 0, 5) * 2) / 2
  const S = g.star(12, 8.2, 6.2, 2.8, 5)
  const spokes = Array.from({ length: 10 }, (_, k) => { const a = (-90 + 36 * k) * RAD; return [[12 + 1.3 * Math.cos(a), 8.2 + 1.3 * Math.sin(a)], [12 + 7 * Math.cos(a), 8.2 + 7 * Math.sin(a)]] })
  const out = r > 0
    ? [...g.pane(S, 'c3', { frame: 1.1, tracery: spokes }), g.glass(g.circle(12, 8.2, 1.3), 'c1', { outline: 0.35, glint: false })]
    : [g.stone(S, { thin: true }), unlit(g, g.shrink(S, 0.8))]
  const T = textLines(icon)
  if (T.length) {
    // the reading under the star, lifted into the space the star leaves
    const ls = T.map(l => ({ ...l, pts: l.pts.map(([x, y]) => [x, y - 0.3]) }))
    out.push(...tablet(ls, 'c1', { px: 1.4, py: 1.05, frame: 0.95 }))
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// bars: the static chart-bar's lancet towers of glass on a stone plinth; an empty value is a short
// tower of dark glass ("no value", never a missing bar)
function barValues(icon, g) {
  const q = icon.params || {}
  const n = clamp(Math.round(Number(q.bars) || 4), 3, 5)
  const X0 = 2.6, X1 = 21.4, gap = n === 3 ? 1.3 : n === 4 ? 0.9 : 0.6
  const w = (X1 - X0 - gap * (n - 1)) / n
  const bottom = q.baseline === false ? 21.2 : 20.2, TOP = 3.4
  const roles = ['c2', 'c1', 'c3']
  const out = []
  for (let i = 0; i < n; i++) {
    const v = clamp(Number(q['bar' + (i + 1)]) || 0, 0, 1)
    const x0 = X0 + i * (w + gap), x1 = x0 + w
    const h = Math.max(w * 0.75 + 0.6, (bottom - TOP) * v)
    const lit = v >= 0.06
    out.push(...g.window(x0, bottom - (lit ? h : Math.min(h, 3.2)), x1, bottom + 0.4, roles[i % 3], { k: 0.9, frame: w < 3.6 ? 0.8 : 1, glass: lit ? { glow: 0.24 } : { ...DARK } }))
  }
  if (q.baseline !== false) out.push(g.stone(g.rr(2.3, 19.7, 21.7, 21.8, 0.8), { thin: true }))
  return out
}

// ---------------------------------------------------------------------------------------------
// counts: the static sibling (exemplar or redraw), scaled toward the corner opposite the badge as
// the generator scales its skeleton, then a moated ruby badge in a gilt bezel with stone numerals
const SC = { dot: 1, one: 0.85, two: 0.8, three: 0.8 }
function sample(Fd, x, y) {
  const fx = x / F.H, fy = y / F.H
  if (fx < 0 || fy < 0 || fx > F.N - 1 || fy > F.N - 1) return 2
  const i = Math.min(F.N - 2, Math.floor(fx)), j = Math.min(F.N - 2, Math.floor(fy)), u = fx - i, v = fy - j, k = j * F.N + i
  return (Fd[k] * (1 - u) + Fd[k + 1] * u) * (1 - v) + (Fd[k + F.N] * (1 - u) + Fd[k + F.N + 1] * u) * v
}
function scaleField(Fd, k, ox, oy) {
  const G = new Float32Array(F.N * F.N)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) G[j * F.N + i] = k * sample(Fd, ox + (i * F.H - ox) / k, oy + (j * F.H - oy) / k)
  return G
}
function scaleParts(parts, k, ox, oy) {
  if (k === 1) return parts
  const P = ([x, y]) => [ox + (x - ox) * k, oy + (y - oy) * k]
  const L = ls => ls.map(l => l.map(P))
  return parts.map(p => {
    const q = { ...p }
    if (p.F) q.F = scaleField(p.F, k, ox, oy)
    if (p.lines) q.lines = L(p.lines)
    if (Array.isArray(p.ticks)) q.ticks = L(p.ticks)
    if (Array.isArray(p.tracery)) q.tracery = L(p.tracery)
    if (p.at) q.at = { c: P(p.at.c), r: p.at.r * k }
    if (p.s) q.s = p.s * k
    if (p.ashlar) { const a = p.ashlar; q.ashlar = { ...a, h: (a.h || 2.2) * k, w: (a.w || 3.2) * k, x: ox + ((a.x || 0) - ox) * k, y0: oy + ((a.y0 ?? 0) - oy) * k, y1: oy + ((a.y1 ?? 24) - oy) * k } }
    return q
  })
}
const countFamily = base => (icon, g) => {
  const q = icon.params || {}
  const b = typeof base === 'function' ? base(q) : base
  const f = EXEMPLAR[b] || REDRAW[b]
  if (typeof f !== 'function') return null
  const parts = [f({ name: b, category: icon.category, paths: [], lines: [], fills: [], cutouts: [] }, g)].flat(Infinity).filter(Boolean)
  const S = (icon.lines || []).filter(l => l.plate === 'S')
  const ring = S.find(l => l.closed && !isText(l))
  if (!ring) return parts
  const T = S.filter(isText)
  const chars = new Set(T.map(l => String(l.pathId).split(':').at(-1))).size
  const k = T.length ? (chars <= 1 ? SC.one : chars === 2 ? SC.two : SC.three) : SC.dot
  const out = scaleParts(parts, k, 2.5, q.corner === 'bottom-right' ? 2.5 : 21.5)
  const disc = g.union(g.poly(ring.pts), g.stroke([ring.pts], 1.5, true))
  out.push(
    g.cut(g.grow(disc, 1.05)),
    g.gilt(disc, { plate: 'S', glint: false }),
    g.glass(g.shrink(disc, 0.7), 'c1', { plate: 'S', outline: 0.25, glow: 0.22 }),
  )
  if (T.length) out.push(g.stone(g.stroke(T.map(l => l.pts), 1.25), { plate: 'S', thin: true, outline: 0.3 }))
  return out
}

// ---------------------------------------------------------------------------------------------
// volume: the static volume's ruby horn in stone; the waves pointed arcs of glass in stone bands,
// the silent ones dark glass; muted is the static volume-off's gilt cross
function volumeLevel(icon, g) {
  const q = icon.params || {}
  const n = clamp(Math.round(Number(q.waves) || 0), 0, 3)
  const out = [...g.pane(g.path('M10 5.4 A1 1 0 0 1 11.8 6.2 V17.8 A1 1 0 0 1 10 18.6 L6.9 15.8 H4.4 A1.6 1.6 0 0 1 2.8 14.2 V9.8 A1.6 1.6 0 0 1 4.4 8.2 H6.9 Z'), 'c1', { frame: 1.3, tracery: [[[7, 7], [7, 17]]] })]
  if (q.muted) return [...out, g.gilt(g.glyph('x', 17.4, 12, 1.15, 2), { plate: 'S' })]
  const cx = 11.4, cy = 12
  const W = [[4.4, 40], [7.3, 44], [10.1, 46]]
  W.forEach(([r, span], i) => {
    const lit = i < n
    if (!lit && !q.ghost) return
    const pts = ogive(cx, cy, r, -90 - span, r * 0.2).map(([x, y]) => [cx - (y - cy), cy + (x - cx)])
    out.push(g.stone(g.stroke(pts, 2.5), { thin: true, plate: lit ? 'A' : 'K' }))
    out.push(lit ? g.glass(g.stroke(pts, 0.95), 'c2', { plate: 'A', outline: 0.3, glow: 0.34, glint: false }) : unlit(g, g.stroke(pts, 0.95), { outline: 0.3 }))
  })
  return out
}

export const LIVE = Object.assign(Object.create(null), {
  'volume-level': volumeLevel,
  'bar-values': barValues,
  'bell-count': countFamily('bell'),
  'mail-count': countFamily('mail'),
  'cart-count': countFamily('shopping-cart'),
  'inbox-count': countFamily('inbox'),
  'chat-count': countFamily(q => q.bubble === 'square' ? 'message-square' : 'message-circle'),
  'rating-stars': (icon, g) => ratingStars(icon, g) || ratingScore(icon, g),
  'signal-bars': signalBars,
  'wifi-strength': wifiStrength,
  'progress-ring': progressRing,
})

// ---------------------------------------------------------------------------------------------
// dressing of the automatic composition
const CREST = new Set(['badge-text', 'percent-badge', 'ticket-number', 'keycap', 'cellular-tech', 'price-tag', 'avatar-initials', 'step-number', 'app-badge'])
const CALENDAR = new Set(['calendar-date', 'calendar-month', 'calendar-weekday', 'calendar-event', 'calendar-range', 'calendar-tear'])

// a crocketed crest on the head of a tablet: a stone gablet pierced by a glowing trefoil, with
// a small gilt finial when there is room (it stands behind the tablet's top edge)
function crest(g, cx, top, w) {
  const h = Math.min(3, top - 1.9)
  if (h < 1.6) return []
  const gab = g.lancet(cx - w / 2, top - h, cx + w / 2, top + 1.2, 0.95)
  return [
    g.stone(gab, { thin: true }),
    g.glass(g.foil(cx, top - h * 0.36, Math.min(1.05, h * 0.42), 3), 'c3', { outline: 0.22, glow: 0.35, glint: false }),
  ]
}
const rowsOf = ls => {
  const rows = []
  for (const l of ls) {
    let y0 = Infinity, y1 = -Infinity
    for (const p of l.pts) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1] }
    let r = rows.find(r => y0 <= r.y1 + 0.5 && y1 >= r.y0 - 0.5)
    if (!r) rows.push(r = { y0, y1 })
    r.y0 = Math.min(r.y0, y0); r.y1 = Math.max(r.y1, y1)
  }
  return rows.sort((a, b) => a.y0 - b.y0)
}

export function dress(icon, parts, g) {
  const M = parts && parts.meta
  if (!M || !M.box) return parts
  const name = icon.name
  const out = [...parts]
  if (CREST.has(name) && M.lettered) {
    const b = M.box, w = b.x1 - b.x0
    if (w >= 9) out.unshift(...crest(g, (b.x0 + b.x1) / 2, b.y0, Math.min(7, w * 0.4)))
  }
  if (CALENDAR.has(name) && M.mass) {
    // a ruby header over the sapphire body, a stone lintel between them (the static calendar)
    const rows = rowsOf(M.text)
    const b = M.box
    let yh = null
    if (rows.length >= 2 && rows[0].y1 - rows[0].y0 < (rows[1].y1 - rows[1].y0) * 0.9) yh = (rows[0].y1 + rows[1].y0) / 2
    else if (rows.length === 1 && rows[0].y1 < (b.y0 + b.y1) / 2 - 1) yh = rows[0].y1 + 1.1
    else if (rows.length && rows[0].y0 - b.y0 > 4.2) yh = b.y0 + 2.9
    const i = out.findIndex(p => p.m === 'glass' && p.batch === 'panes')
    if (yh != null && i >= 0) {
      const P = out[i]
      const head = g.inter(P.F, g.rect(0, 0, 24, yh - 0.35))
      const body = g.inter(P.F, g.rect(0, yh + 0.35, 24, 24))
      out.splice(i, 1,
        { ...P, F: body, tracery: 'none' },
        { ...P, F: head, role: 'c1', tracery: 'none', medal: 'c3' },
      )
      const lintel = g.inter(g.rect(0, yh - 0.45, 24, yh + 0.45), g.grow(P.F, 0.1))
      out.splice(i + 2, 0, g.stone(lintel, { thin: true, outline: 0.3 }))
    }
  }
  if (out.meta === undefined) out.meta = M
  return out
}
