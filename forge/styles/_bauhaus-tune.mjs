// BAUHAUS per-icon tuning for the automatic composer (icons without a redraw).
// Skeletons stay style-agnostic; anything Bauhaus needs to know about one icon lives here.
//   main     colour triad: 'c1' red | 'c3' blue | 'c2' yellow
//   part     role for A-plate parts      inlay  role for openings
//   hollow   true: the inside of a round outline becomes an opening (lenses)
//   bands    roles per path (pure stroke icons drawn as coloured bands)
//   drop     path indexes to leave out      clear  path data to knock out of everything
//   w / wi   bar weights
//   band     true: a frame with rows of text prints its top row on a band of the second primary
//   face     true | inset: a dial gets a cream face inset in its rim
// Every static icon is hand-composed, so these mostly steer the Live icons (forge/dynamic),
// keeping each family in the colours of its static sibling.
import * as Prim from './_bauhaus-prim.mjs'
import { REDRAW } from './_bauhaus-redraws.mjs'
import * as Render from './_bauhaus-render.mjs'
import { parsePath, bbox } from '../kernel/geom.mjs'

const CAL = { main: 'c3', band: true }
const DIAL = { main: 'c1', face: true }
const T = {
  search: { hollow: true }, 'zoom-in': { hollow: true }, 'zoom-out': { hollow: true },
  // live icons
  'calendar-date': CAL, 'calendar-event': CAL, 'calendar-month': CAL, 'calendar-range': CAL, 'calendar-tear': CAL, 'calendar-weekday': CAL,
  'digital-clock': { main: 'c3', band: true },
  'clock-time': DIAL, 'watch-time': DIAL, 'alarm-clock-time': DIAL, stopwatch: { main: 'c3', face: true },
  'bell-count': { main: 'c2' }, 'cart-count': { main: 'c1' }, 'mail-count': { main: 'c3' }, 'inbox-count': { main: 'c1' }, 'chat-count': { main: 'c3' },
  'battery-level': { main: 'c3' }, 'battery-percent': { main: 'c3' }, 'battery-vertical': { main: 'c3' }, 'battery-charging-level': { main: 'c3' },
  'map-pin-number': { main: 'c1' }, 'folder-label': { main: 'c1' }, 'thermometer-level': { main: 'c3' }, humidity: { main: 'c3' },
  'price-tag': { main: 'c1' }, 'tag-label': { main: 'c1' }, 'ticket-number': { main: 'c1' }, 'rating-stars': { main: 'c2' },
  'file-type': { main: 'c3' }, keycap: { main: 'c3' },
}
export const autoTune = name => T[name] || {}

// -------------------------------------------------------------------------------------------------
// LIVE compositions. A Live icon whose family has a hand-composed static sibling is drawn from that
// sibling's own Bauhaus composition (the same shapes, the same colours), with the live part (a level,
// a needle, a count badge, a reading) composed in the same vocabulary. Text always comes from the
// skeleton's stroke-font paths (ids 'text:<char>:<cap>:<n>'), so what is written never changes.
//   LIVE[name](p, icon, ctx) -> compose() layers; anything that throws falls back to the field composer.
const RAD = Math.PI / 180
const sib = (name, p) => { const f = (Render.EXEMPLAR && Render.EXEMPLAR[name]) || REDRAW[name]; return f ? f(p) : [] }
const isTextPath = q => typeof q.id === 'string' && q.id.startsWith('text:')
const capOf = q => { const a = String(q.id).split(':'); return +a[a.length - 2] || 5 }
const ptsOf = d => { try { return parsePath(d).flatMap(s => s.pts) } catch { return [] } }
const boxOf = d => { const P = ptsOf(d); return P.length ? bbox(P) : null }
// text weight by cap height: open counters at every size, still a bold Bauhaus letter
export const tw = cap => cap >= 6.5 ? 2.2 : cap >= 5 ? 1.8 : cap >= 4 ? 1.55 : 1.3

export function liveCtx(icon) {
  const paths = icon.paths || []
  const texts = paths.filter(isTextPath)
  const pick = plate => texts.filter(q => !plate || q.plate === plate)
  return {
    params: icon.params || {},
    texts,
    // the skeleton text of one plate (or all), stroked at its weight (k scales the weight)
    text(p, plate = null, k = 1) {
      const L = pick(plate)
      return L.length ? p.join(...L.map(q => p.stroke(q.d, tw(capOf(q)) * k))) : null
    },
    textBox(plate = null) {
      const L = pick(plate)
      return L.length ? bbox(L.flatMap(q => ptsOf(q.d))) : null
    },
    // non-text paths of a plate, with their boxes
    shapes(plate) { return paths.filter(q => !isTextPath(q) && q.plate === plate).map(q => ({ d: q.d, box: boxOf(q.d) })) },
  }
}

// map every shape of a layer list (nested arrays allowed) through f
const mapLayers = (layers, f) => layers.map(L => (L && L.length ? [L[0], ...L.slice(1).flat(Infinity).filter(Prim.isShape).map(f)] : L))

// ── COUNT family: the static sibling, scaled toward the corner opposite the badge (as the skeleton
// is), plus the badge: a disc or rounded tag in the contrasting primary, a cream count, a moat ──
const COUNT = {
  'bell-count': { base: 'bell', badge: 'c1' },
  'cart-count': { base: 'shopping-cart', badge: 'c3' },
  'mail-count': { base: 'mail', badge: 'c1' },
  'inbox-count': { base: 'inbox', badge: 'c2', glyph: 'shadow' },
  'chat-count': { base: q => (q.bubble === 'square' ? 'message-square' : 'message-circle'), badge: q => (q.bubble === 'square' ? 'c3' : 'c1') },
  'app-badge': { base: null, badge: 'c1' },
}
function countLayers(name, p, icon, ctx) {
  const C = COUNT[name], q = ctx.params
  const baseName = typeof C.base === 'function' ? C.base(q) : C.base
  let base = baseName ? sib(baseName, p) : [['c3', p.rr(3, 3, 21, 21, 5)]]
  const ring = ctx.shapes('S').find(s => s.box)
  if (!ring) return base
  const dot = q.dotOnly === true
  const label = ctx.texts.filter(t => t.plate === 'S')
  const chars = new Set(label.map(t => String(t.id).split(':').slice(1, -2).join(':') + '@' + Math.round(boxOf(t.d).x0 * 2))).size
  const k = dot ? 1 : chars <= 1 ? 0.85 : 0.8
  const [ox, oy] = q.corner === 'bottom-right' ? [2.5, 2.5] : [2.5, 21.5]
  if (k !== 1) base = mapLayers(base, s => p.scale(s, k, ox, oy))
  const b = ring.box, round = Math.abs(b.w - b.h) < 0.3
  const grow = g => (round ? p.circle(b.cx, b.cy, b.w / 2 + g) : p.rr(b.x0 - g, b.y0 - g, b.x1 + g, b.y1 + g, Math.min(b.h / 2, 3.5) + g))
  const role = typeof C.badge === 'function' ? C.badge(q) : C.badge
  // a base piece mostly under the moat (the bell's finial, a wheel) leaves a stray nub: drop it
  const M = Prim.ringsOf(grow(2))
  base = base.map(L => (L && L.length && L[0] !== 'cut' ? [L[0], ...L.slice(1).flat(Infinity).filter(Prim.isShape).filter(sh => {
    const R = Prim.ringsOf(sh), S = Prim.samplesOf(R, 0.3)
    const bb = bbox(R.flat())
    return !S.length || bb.w * bb.h > 16 || S.filter(pt => Prim.windingAt(pt, M)).length / S.length < 0.4
  })] : L))
  const out = [...base, ['cut', grow(0.75 + 1.25)], [role, grow(0.75)]]
  if (!dot && label.length) { const t = ctx.text(p, 'S', 0.95); if (t) out.push([C.glyph || 'tint', t]) }
  return out
}

// ── BATTERIES: the static cell (blue body, ink terminal), a level pill in yellow (red when low), the
// empty rest of the cell in cream, exactly like the static battery / battery-low ──
const lowOf = q => q.warnAt > 0 && Math.round((+q.level || 0) * 100) <= q.warnAt
function levelH(p, x0, x1, y0, y1, level, low, minW = 3) {
  const lv = Math.max(0, Math.min(1, +level || 0))
  let xe = x0 + (x1 - x0) * lv
  if (low) xe = Math.max(xe, x0 + 4)
  else if (lv > 0) xe = Math.max(xe, x0 + minW)
  if (lv >= 0.995) return [['c2', p.pill(x0, y0, x1, y1)]]
  const L = []
  if (xe > x0) L.push([low ? 'c1' : 'c2', p.rr(x0, y0, xe, y1, Math.min((y1 - y0) / 2, (xe - x0) / 2))])
  const g = xe > x0 ? 1.25 : 0
  if (x1 - (xe + g) >= 2) L.push(['tint', p.rr(xe + g, y0, x1, y1, Math.min((y1 - y0) / 2, (x1 - xe - g) / 2))])
  return L
}
const cellH = p => [['ink', p.half(20.25, 12, 2.25, 'e')], ['c3', p.rr(2, 6, 20.25, 18, 3)]]
const cellV = p => [['ink', p.half(12, 5.25, 2.25, 'n')], ['c3', p.rr(6, 5.25, 18, 21.75, 3)]]
const BOLT = [[12.75, 3.5], [6.5, 13], [11, 13], [9.5, 20.5], [15.75, 11], [11.25, 11]]

// the skeleton text stroked, then scaled about (its centre, cy) so its ink spans at most x0..x1
function fitText(p, ctx, plate, x0, x1, cy) {
  const t = ctx.text(p, plate)
  const b = ctx.textBox(plate)
  if (!t || !b) return t
  const w = b.w + 1.8, k = Math.min(1, (x1 - x0) / w)
  const out = k < 0.999 ? p.scale(t, k, b.cx, cy ?? b.cy) : t
  const dx = (x0 + x1) / 2 - b.cx
  return Math.abs(dx) > 0.05 ? p.move(out, dx, 0) : out
}


// ── CLOCKS: the static sibling's dial without its fixed hands; the live hands (skeleton A lines
// through the dial centre) mapped onto that dial, in ink, with the sibling's centre dot ──
function clockLayers(p, ctx, layers, c, face) {
  const K = ctx.shapes('K').filter(s => s.box && /Zs*$/i.test(s.d.trim())).sort((a, b) => b.box.w * b.box.h - a.box.w * a.box.h)
  const dial = K.find(s => Math.abs(s.box.cx - 12) < 1.5) || K[0]
  if (!dial) return layers
  const sc = [dial.box.cx, dial.box.cy], skR = Math.min(dial.box.w, dial.box.h) / 2
  const k = Math.min(1.15, face / Math.max(3, skR - 1.25))
  const hands = ctx.shapes('A').filter(s => s.box && !/Z/i.test(s.d) && ptsOf(s.d).some(q => Math.hypot(q[0] - sc[0], q[1] - sc[1]) < 1.6))
  if (!hands.length) return layers
  const H = p.join(...hands.map(h => p.move(p.scale(p.stroke(h.d, 2.1 / k), k, sc[0], sc[1]), c[0] - sc[0], c[1] - sc[1])))
  return [...layers, ['ink', H], ['c1', p.circle(c[0], c[1], 1.1)]]
}
const dropLast = (L, n) => L.slice(0, L.length - n)

// Live icons drawn as one object (a tag and its price): their nodes carry no plate classes, so the
// whole icon plays one motion (compose would otherwise split the body by the nearest skeleton plate)
export const LIVE_ONE = new Set(['price-tag', 'tag-label', 'badge-text', 'sale-sticker', 'file-type', 'folder-label', 'keycap', 'wifi-strength'])

// ── the compositions ──
export const LIVE = {
  ...Object.fromEntries(Object.keys(COUNT).map(k => [k, (p, icon, ctx) => countLayers(k, p, icon, ctx)])),

  'battery-level': (p, icon, ctx) => {
    const q = ctx.params
    return [...cellH(p), ...levelH(p, 4.75, 17.5, 8.75, 15.25, q.level, lowOf(q))]
  },
  'battery-vertical': (p, icon, ctx) => {
    const q = ctx.params
    // the horizontal level turned a quarter, filling from the bottom of the portrait cell
    const L = levelH(p, 8, 19, 8.75, 15.25, q.level, lowOf(q))
    return [...cellV(p), ...mapLayers(L, s => p.move(p.rot(s, -90, 12, 12), 0, 3))]
  },
  'battery-percent': (p, icon, ctx) => {
    const t = ctx.text(p, null, 0.95)
    return t ? [...cellH(p), ['tint', t]] : [...cellH(p), ['c2', p.pill(4.75, 8.75, 17.5, 15.25)]]
  },
  'battery-charging-level': (p, icon, ctx) => {
    const q = ctx.params
    // the cell lifted 1.5u, its level clear to read; the charge is a red badge disc with a cream bolt
    // sitting on the terminal end, cleared by a moat
    const cx = 18.25, cy = 17.5, r = 4.25
    return [
      ...mapLayers(cellH(p), sh => p.move(sh, 0, -1.5)),
      ...mapLayers(levelH(p, 4.75, 17.5, 8.75, 15.25, q.level, false), sh => p.move(sh, 0, -1.5)),
      ['cut', p.circle(cx, cy, r + 1.25)],
      ['c1', p.circle(cx, cy, r)],
      ['tint', p.bar([[cx + 1.1, cy - 2.6], [cx - 1.2, cy + 0.2], [cx + 1.2, cy - 0.2], [cx - 1.1, cy + 2.6]], 1.6)],
    ]
  },

  // a clean plate (pill or rounded) in red, the word in cream, scaled to keep >= 2.25u of padding
  'badge-text': (p, icon, ctx) => {
    const q = ctx.params, pill = q.shape !== 'rounded'
    const L = [['c1', p.rr(2, 5, 22, 19, pill ? 7 : 3.75)]]
    const t = fitText(p, ctx, null, 2 + 2.25 + (pill ? 1 : 0), 22 - 2.25 - (pill ? 1 : 0), 12)
    if (t) L.push(['tint', t])
    return L
  },
  // the key: a blue cap on a yellow front lip, its legend and symbol in cream
  keycap: (p, icon, ctx) => {
    const K = ctx.shapes('K').map(s => s.box).filter(Boolean)
    const cap = { x0: Math.min(...K.map(b => b.x0)), y0: Math.min(...K.map(b => b.y0)), x1: Math.max(...K.map(b => b.x1)), y1: Math.max(...K.map(b => b.y1)) }
    const lip = K.filter(b => b.h < 0.3 && b.y0 > (cap.y0 + cap.y1) / 2).sort((a, b) => b.y0 - a.y0)[0]
    const body = p.rr(cap.x0, cap.y0, cap.x1, cap.y1, 3.5)
    const L = [['c3', body]]
    if (lip) L.push(['c2', p.clip(body, p.rect(0, lip.y0 + 0.5, 24, 24))])
    const sym = ctx.shapes('A')
    if (sym.length) L.push(['tint', p.join(...sym.map(s => p.stroke(s.d, 1.8)))])
    const t = ctx.text(p)
    if (t) L.push(['tint', t])
    return L
  },
  // the static droplet: blue drop, the reading in cream, or the water level as the yellow pool
  humidity: (p, icon, ctx) => {
    const q = ctx.params
    const d = p.drop(12, 14.25, 7.75, 12, 1.75, 0.75)
    const L = [['c3', d]]
    const t = ctx.text(p)
    if (t) return [...L, ['tint', t]]
    const lv = Math.max(0, Math.min(1, (+q.humidity || 0) / 100))
    // the pool never swallows the tip, so a full drop still reads as a blue drop
    if (lv > 0) { const y = 21.5 - lv * 15.5; L.push(['c2', p.clip(d, p.circle(12, y + 14, 14))]) }
    L.push(['tint', p.lens(7.75, 13.5, 9.5, 9.5, 0.8)])
    return L
  },
  // the static wifi: red dot, yellow | blue | ink waves; an unlit wave is a row of small ink dots
  'wifi-strength': (p, icon, ctx) => {
    const q = ctx.params, n = Math.max(0, Math.min(3, +q.strength || 0))
    const roles = ['c2', 'c3', 'ink'], radii = [4.75, 8.75, 12.75]
    const L = [['c1', p.circle(12, 18.5, 2)]]
    radii.forEach((r, i) => {
      if (i < n) L.push([roles[i], p.arc(12, 18.5, r, 222, 318, 2.5)])
      else if (q.ghost !== false) {
        const k = Math.max(2, Math.floor((96 * RAD * r) / 4.6) + 1)
        L.push(['ink', ...Array.from({ length: k }, (_, j) => { const a = (222 + 96 * j / (k - 1)) * RAD; return p.circle(12 + Math.cos(a) * r, 18.5 + Math.sin(a) * r, 0.9) })])
      }
    })
    return L
  },
  // the static file page (blue, yellow dog-ear) wearing a red label band, the type in cream
  'file-type': (p, icon, ctx) => {
    const tb = ctx.textBox()
    const L = p.page('c3', 'c2', 4.5, 2, 19.5, 22, 5.5)
    if (!tb) return L
    const x0 = Math.min(3, tb.x0 - 1.75), x1 = Math.max(21, tb.x1 + 1.75)
    L.push(['c1', p.rr(x0, tb.y0 - 1.75, x1, tb.y1 + 1.75, 2.25)])
    L.push(['tint', ctx.text(p)])
    return L
  },
  // a scalloped sticker (the static badge-percent's rosette), the word in cream, scaled to fit inside
  'sale-sticker': (p, icon, ctx) => {
    const q = ctx.params, n = Math.max(8, Math.min(20, +q.points || 14))
    const R = 7.5, r = Math.min(3.25, (2 * Math.PI * R / n) * 0.62)
    const L = [['c3', p.around(p.circle(12, 12 - R, r), n), p.circle(12, 12, R + 0.25)]]
    const t = fitText(p, ctx, null, 5.75, 18.25, 12)
    if (t) L.push(['tint', t])
    return L
  },

  'alarm-clock-time': (p, icon, ctx) => clockLayers(p, ctx, dropLast(sib('alarm-clock', p), 1), [12, 12.75], 5.5),
  'clock-time': (p, icon, ctx) => ctx.params.shape === 'square'
    ? clockLayers(p, ctx, [['c1', p.rr(2.5, 2.5, 21.5, 21.5, 4.5)], ['c3', p.clip(p.rr(2.5, 2.5, 21.5, 21.5, 4.5), p.rect(0, 12, 24, 24))], ['tint', p.rr(5.25, 5.25, 18.75, 18.75, 2.5)]], [12, 12], 6.75)
    : clockLayers(p, ctx, dropLast(sib('clock', p), 2), [12, 12], 7),
  'watch-time': (p, icon, ctx) => ctx.params.shape === 'square'
    ? clockLayers(p, ctx, [['c3', p.rr(8.75, 2, 15.25, 22, 2.5)], ['c1', p.rr(5, 5, 19, 19, 3.75)], ['tint', p.rr(7, 7, 17, 17, 2.25)]], [12, 12], 5)
    : clockLayers(p, ctx, dropLast(sib('watch', p), 1), [12, 12], 5),

  // the static folder (red back with its half-disc tab, blue front), the label in cream on the front
  'folder-label': (p, icon, ctx) => {
    const L = p.folder('c1', 'c3', 20.5)
    const b = ctx.textBox()
    const t = fitText(p, ctx, null, 4.25, 19.75, b ? b.cy : 14)
    if (t) L.push(['tint', b && b.cy < 14.75 ? p.move(t, 0, 14.75 - b.cy) : t])
    return L
  },

  // a tag pointing left: red body, the point in yellow, a cream eyelet, the price in cream
  'price-tag': (p, icon, ctx) => {
    const body = p.poly([[1.75, 12], [7.25, 5.25], [22, 5.25], [22, 18.75], [7.25, 18.75]], [1.5, 1.25, 2.75, 2.75, 1.25])
    const L = [['c1', p.clip(body, p.rect(7.5, 0, 24, 24))], ['c2', p.clip(body, p.rect(0, 0, 7.5, 24))], ['tint', p.circle(5.5, 12, 1.4)]]
    const t = fitText(p, ctx, null, 8.75, 21, 12)
    if (t) L.push(['tint', t])
    return L
  },

  // a hang tag: red body with clipped shoulders, a yellow eyelet ring, the word in cream
  'tag-label': (p, icon, ctx) => {
    const L = [['c1', p.poly([[7.5, 3], [16.5, 3], [21.5, 8], [21.5, 21], [2.5, 21], [2.5, 8]], [1.75, 1.75, 1.5, 3, 3, 1.5])], ['c2', p.circle(12, 7.5, 2)], ['shadow', p.circle(12, 7.5, 0.9)]]
    const b = ctx.textBox()
    const t = fitText(p, ctx, null, 4.5, 19.5, b ? b.cy : 15)
    if (t) L.push(['tint', t])
    return L
  },

  // the static gauge's dial (yellow | blue | red, flush), the ink needle on the value, the reading below
  'gauge-value': (p, icon, ctx) => {
    const q = ctx.params, reading = q.reading !== false
    const cx = 12, cy = reading ? 11 : 13, r = reading ? 7.5 : 8.25, w = 3
    const t = Math.max(0, Math.min(1, (+q.value || 0) / Math.max(1, +q.max || 100)))
    const a0 = 165, a1 = 375, s = (a1 - a0) / 3
    const a = (a0 + (a1 - a0) * t) * RAD, len = r - 1.25
    const L = [
      ['c2', p.arcEnds(cx, cy, r, a0, a0 + s, w, 'round', 'flat')],
      ['c3', p.arcEnds(cx, cy, r, a0 + s, a0 + 2 * s, w, 'flat', 'flat')],
      ['c1', p.arcEnds(cx, cy, r, a0 + 2 * s, a1, w, 'flat', 'round')],
      ['ink', p.seg2(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len, 2.25), p.circle(cx, cy, 2.25)],
    ]
    const tx = ctx.text(p)
    if (tx) L.push(['ink', tx])
    return L
  },
}
