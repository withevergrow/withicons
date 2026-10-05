// ANIME live — the Live icons (forge/DYNAMIC.md) drawn in the colours and the construction of their
// static siblings, so a live clock sits next to the static clock as one family.
//
//   LIVE[name](params, icon) -> { col?, draw? }
//     col    overrides of the automatic casting (main second panel tube badge) for the generic path
//     draw   ctx -> ops: the whole icon, drawn from the fitted skeleton (_anime-auto.mjs builds ctx):
//            ctx.fills  [rings] per fill (author order)      ctx.cuts   [rings] per cutout
//            ctx.lines  non-text lines {pts, closed, plate}  ctx.texts  text lines inside a fill
//            ctx.free   free text lines {pts, closed, cap}   ctx.S(shape) / ctx.X(pts) skeleton -> icon space
//            ctx.s      the fit scale; ctx.params the live params
// Every draw returns plain kit ops; compose() adds outline, cel shadow, shine and the motion tags.
import * as K from './_anime-kit.mjs'
import * as P from './_anime-prim.mjs'
import { bbox, pointInRing } from '../kernel/geom.mjs'

const k = { ...K, ...P }
const fracIn = (pts, ring) => pts.length ? pts.filter(p => pointInRing(p, ring)).length / pts.length : 0
const inAny = (pts, rings) => pts.length ? pts.filter(p => rings.some(r => pointInRing(p, r))).length / pts.length : 0
const boxOf = rings => bbox(rings.flat())
const largest = rings => rings.reduce((a, r) => (bboxArea(r) > bboxArea(a) ? r : a), rings[0])
const bboxArea = r => { const b = bbox(r); return b.w * b.h }
// shrink a shape by d (> 1.5 in steps: the field reach is limited)
const shrink = (sh, d) => { let out = sh; let left = d; while (left > 1e-6) { const step = Math.min(1.35, left); out = P.grow(out, -step); left -= step } return out }

// Live text (forge/DYNAMIC.md). The stroke font is spaced for a 1.75u stroke at full size; the anime fit draws the
// icon at ~0.9, so lettering is cut at TEXT_W (= 1.75 x 0.9, minus a hair): heavy enough to read at 16px, light
// enough that every counter of 0 4 6 8 9 A % stays open. An outlined (manga) letter is core + 2 x outline wide,
// which closes those counters at 24px, so live lettering is solid: ink on light fields, cream on coloured plates.
export const TEXT_W = 1.5
export const FREE_TEXT = 'accent'   // free lettering (no field behind it): coral reads on light and dark pages
// a small cap (fitted cap < 4.6u: a calendar's day, a timer's count) of a digit with a counter (0 4 6 8 9 %) is
// cut lighter, down to 1.25u, so the counter keeps >= 0.6u² open at 24px
const COUNTER = new Set([...'04689%'])
// a bare stem (I 1 ! |) has no counter to keep open and at 24px a 1.5u stem lands on a pixel and a half of grey:
// a lettering of stems only is cut a quarter heavier, so a lone "I" on a key holds its contrast
const STEM = new Set([...'I1!|'])
export const textW = (l, lone = false) => !l ? TEXT_W : STEM.has(l.ch) ? (lone ? 1.85 : TEXT_W) : !COUNTER.has(l.ch) || !(l.capS < 4.6) ? TEXT_W : Math.max(1.25, TEXT_W - (4.6 - l.capS) * 0.45)
// ink ops for lettering: one per stroke weight
export function inkText(L, o) {
  const by = new Map(), lone = L.every(l => STEM.has(l.ch))
  for (const l of L) { const w = o.role === 'ink' || lone ? +textW(l, lone).toFixed(3) : TEXT_W; (by.get(w) || by.set(w, []).get(w)).push(l) }
  return [...by.entries()].map(([w, ls]) => K.ink(ls, { taper: false, shift: 0, text: true, ...o, w }))
}
const textInk = (L, role = 'ink') => L.length ? inkText(L, { part: 'a', role }) : []
function freeText(L, role = 'tint') {
  if (!L.length) return []
  if (role === 'ink') return textInk(L, FREE_TEXT)
  return [K.tube(L, role, { part: 'a', w: TEXT_W, ol: 0, shade: 0, casts: false })]
}
// a plate behind free text: a rounded slab padded around the lettering, kept on the canvas
function plate(L, role, pad = 1.5, r = null) {
  const b = bbox(L.flatMap(l => l.pts))
  const x0 = Math.max(1.3, b.x0 - pad), x1 = Math.min(22.7, b.x1 + pad), y0 = Math.max(1.3, b.y0 - pad), y1 = Math.min(22.7, b.y1 + pad)
  return K.surf(P.rr(x0, y0, x1, y1, r ?? Math.min(2.6, (y1 - y0) / 2)), role, { shineSize: 0.7 })
}

// ------------------------------------------------------------------------------------------------
// clocks: a coloured rim, a cream face under glass, ink hands, a pin (the static clock / timer / watch)
function clockFace(ctx, o) {
  const face = ctx.fills[0]
  const fb = boxOf(face), cx = (fb.x0 + fb.x1) / 2, cy = (fb.y0 + fb.y1) / 2
  const hands = ctx.lines.filter(l => l.plate !== 'S' && fracIn(l.pts, largest(face)) > 0.8 && !l.closed)
  const sweeps = ctx.lines.filter(l => l.closed && fracIn(l.pts, largest(face)) > 0.8)
  const inner = shrink(face, o.rimW ?? 2.1)
  const ops = [K.surf(face, o.rim, { shineSize: o.shineSize ?? 0.95 })]
  ops.push(K.surf(inner, 'tint', { inset: true, ol: 0.4, shine: o.glass ? 'glass' : 'none', shade: 0.7 }))
  // an elapsed sweep (stopwatch, timer): a solid coral sector edged in ink, so the reading is as strong as a hand
  if (sweeps.length) {
    ops.push(K.paint(P.clip(P.join(...sweeps.map(l => [l.pts])), shrink(inner, 0.3)), o.sweep || 'accent', { part: 'a' }))
    ops.push(K.ink(sweeps, { w: 0.85, part: 'a', taper: false, shift: 0 }))
  }
  // hour ticks where no hand points
  if (o.ticks) {
    const ib = boxOf(inner), R = Math.min(ib.w, ib.h) / 2 - 1.05
    const tips = hands.flatMap(l => [l.pts[0], l.pts.at(-1)]).filter(p => Math.hypot(p[0] - cx, p[1] - cy) > 1.5).map(p => Math.atan2(p[1] - cy, p[0] - cx))
    const dots = [-90, 0, 90, 180].filter(a => !tips.some(t => Math.abs(((t * 180 / Math.PI - a + 540) % 360) - 180) < 24))
      .map(a => P.circle(cx + R * Math.cos(a * Math.PI / 180), cy + R * Math.sin(a * Math.PI / 180), 0.55))
    if (dots.length) ops.push(K.paint(P.join(...dots), o.rim === 'accent' ? 'accent' : 'c1'))
  }
  if (hands.length) ops.push(K.ink(hands, { w: o.handW ?? 1.2, part: 'a', taper: 0.6 }))
  ops.push(K.surf(P.circle(cx, cy, o.pinR ?? 1.1), o.pin || 'c2', { part: 'a', shine: 'none', ol: 0.32, shade: 0 }))
  return { ops, face, hands, inner, cx, cy }
}

const outside = (ctx, face) => ctx.lines.filter(l => l.plate !== 'S' && fracIn(l.pts, largest(face)) < 0.5)

// ------------------------------------------------------------------------------------------------
// calendars: cream sheet, sakura header, sky binder rings, ink numerals (the static calendar)
function calendar(ctx, mode) {
  const sheet = ctx.fills[0], sb = boxOf(sheet)
  const T = ctx.texts
  // text rows by vertical position
  const rows = []
  for (const l of T) {
    const b = bbox(l.pts)
    let r = rows.find(r => b.y0 <= r.y1 + 0.6 && b.y1 >= r.y0 - 0.6)
    if (!r) rows.push(r = { y0: b.y0, y1: b.y1 })
    r.y0 = Math.min(r.y0, b.y0); r.y1 = Math.max(r.y1, b.y1)
  }
  rows.sort((a, b) => a.y0 - b.y0)
  for (let i = 0; i + 1 < rows.length;) {
    if (rows[i + 1].y0 <= rows[i].y1 + 0.6) { rows[i].y1 = Math.max(rows[i].y1, rows[i + 1].y1); rows.splice(i + 1, 1) } else i++
  }
  const divider = ctx.lines.find(l => l.plate === 'K' && !l.closed && bbox(l.pts).h < 0.2 && bbox(l.pts).w > sb.w * 0.6)
  let yh
  if (divider) yh = bbox(divider.pts).y0
  else if (mode !== 'strip' && rows.length >= 2 && (rows[0].y1 - rows[0].y0) < (rows[1].y1 - rows[1].y0) * 0.9) yh = (rows[0].y1 + rows[1].y0) / 2
  else if (mode !== 'strip' && rows.length === 1 && rows[0].y1 < 12.5) yh = rows[0].y1 + 1.4
  // a strip calendar (no header word) keeps one thin sakura band whatever its text: a band that followed the
  // day's height would move, and its edge would run through the top of a 9 or a 0
  else if (mode === 'strip') yh = Math.min(sb.y0 + 1.3, (rows[0] ? rows[0].y0 : 99) - 1.3)
  else yh = Math.min(sb.y0 + 2.6, (rows[0] ? rows[0].y0 : 99) - 1.3)
  const head = P.clip(sheet, P.rect(0, 0, 24, yh))
  // binder rings: the short stubs above the sheet
  const rings = ctx.lines.filter(l => l.plate !== 'S' && !l.closed && bbox(l.pts).y1 < sb.y0 + 1.8 && bbox(l.pts).h < 3.2 && bbox(l.pts).w < 0.6)
  const ringOps = rings.map(l => { const b = bbox(l.pts), x = (b.x0 + b.x1) / 2; return K.surf(P.pill(x - 1, sb.y0 - 1.5, x + 1, Math.max(sb.y0 + 0.9, Math.min(sb.y0 + 2.4, (rows[0] ? rows[0].y0 : 99) - 1.6))), 'c1', { part: 'a', shine: 'none', ol: 0.4 }) })
  // anything else drawn inside the sheet: small closed loops are picked days, the rest ink
  const rest = ctx.lines.filter(l => l !== divider && !rings.includes(l) && l.plate !== 'S')
  const picked = rest.filter(l => l.closed && Math.max(bbox(l.pts).w, bbox(l.pts).h) < 3.4)
  const other = rest.filter(l => !picked.includes(l) && fracIn(l.pts, largest(sheet)) > 0.5)
  const ops = [
    K.surf(sheet, 'tint', { shine: 'none' }),
    K.surf(head, 'c2', { cast: false }),
  ]
  if (divider) ops.push(K.ink([divider], { w: 0.7 }))
  for (const l of picked) { const b = bbox(l.pts); ops.push(K.surf(P.circle((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, Math.max(b.w, b.h) / 2 + 0.5), 'c1', { shine: 'dot', shineSize: 0.6, ol: 0.35, part: 'a' })) }
  // day pips (the skeleton's zero-length dots) print as round ink dots at the reference dot size, not as a
  // hairline speck; everything else drawn on the sheet is fine ink line art
  const pip = l => { const b = bbox(l.pts); return Math.max(b.w, b.h) < 0.6 }
  const pips = other.filter(pip), art = other.filter(l => !pip(l))
  if (pips.length) ops.push(K.paint(P.join(...pips.map(l => { const b = bbox(l.pts); return P.circle((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, 0.8 * ctx.s / 0.9) })), 'ink', { part: 'a' }))
  if (art.length) ops.push(K.ink(art, { w: 0.9, part: 'a', taper: false, shift: 0 }))
  ops.push(...textInk(T, 'ink'), ...ringOps)
  return ops
}

// ------------------------------------------------------------------------------------------------
// batteries: sky case, dark window inset, green cells (coral when low), a "!" on an empty one
function battery(ctx, o = {}) {
  const level = Number(ctx.params.level ?? 1)
  const low = level <= 0.2
  const body = ctx.fills[0]
  const cut = ctx.cuts[0] || []
  const win = cut.length ? largest(cut) : null
  // the window never pokes out of the case (a case left open for a charge bolt): kept 0.8u inside the body
  const window = win ? P.clip(shrink([win], 0.55), shrink(body, 0.8)) : shrink(body, 1.6)
  const holes = cut.filter(r => r !== win)
  const ops = []
  // terminal: the short open A line beside the case
  const term = ctx.lines.filter(l => l.plate === 'A' && !l.closed && fracIn(l.pts, largest(body)) < 0.3 && !ctx.texts.includes(l))
  if (term.length) ops.push(K.surf(P.stroke(term, 2.3), 'c1', { part: 'a', shine: 'none', ol: 0.4 }))
  ops.push(K.surf(body, 'c1', { shineSize: 0.85 }))
  const bolt = ctx.lines.filter(l => l.plate === 'S' && fracIn(l.pts, largest(body)) < 0.5)
  const bang = ctx.lines.filter(l => l.plate === 'S' && !bolt.includes(l))
  if (o.printed || ctx.texts.length) {
    // battery-percent (with or without its figures, so the window never changes colour with them): the window itself is the charge, the number printed on it
    // no glass bars: a shine streak across the figures reads as a stroke of them
    ops.push(K.surf(window, low ? 'accent' : 'c4', { inset: true, ol: 0.38, shine: 'none', shade: 0.6 }))
    ops.push(...textInk(ctx.texts, low ? 'shine' : 'ink'))   // white on the coral low window, navy on green
  } else {
    ops.push(K.surf(window, 'ink', { inset: true, ol: 0, shine: 'none', shade: 0, tone: ['ink', 0.3] }))
    if (holes.length && !bang.length) {
      // the charge is the skeleton's level bar (its knock-out is the bar + 1u clearance, the slot runs 2u inside
      // the window), mapped as a fraction onto this window (which may be narrower: a case left open for a bolt)
      const sw = boxOf([win]), hb = boxOf(holes), vert = o.vertical
      const inner = shrink(window, 0.6), ib = boxOf(inner)
      let lv
      if (vert) {
        const frac = Math.max(0, Math.min(1, (hb.h - 2) / Math.max(0.1, sw.h - 6)))
        lv = P.clip(inner, P.rect(0, ib.y1 - Math.max(ib.h * frac, 1.6), 24, 24))   // a low charge still reads as a cell
      } else {
        const frac = Math.max(0, Math.min(1, (hb.w - 2) / Math.max(0.1, sw.w - 6)))
        lv = P.clip(inner, P.rect(0, 0, ib.x0 + Math.max(ib.w * frac, 1.6), 24))
      }
      ops.push(K.surf(lv, low ? 'accent' : 'c4', { ol: 0, shine: 'streak', shineSize: 0.6, cast: false, casts: false, shade: 0.6 }))
      // cell dividers at thirds of the full window
      const wb = boxOf(window)
      const divs = [1, 2].map(i => vert
        ? [[wb.x0, wb.y0 + wb.h * i / 3], [wb.x1, wb.y0 + wb.h * i / 3]]
        : [[wb.x0 + wb.w * i / 3, wb.y0], [wb.x0 + wb.w * i / 3, wb.y1]])
      ops.push(K.ink(divs, { w: 0.6, taper: false, shift: 0 }))
    }
  }
  if (bang.length) ops.push(K.tube(bang, 'accent', { part: 's', w: 1.6, ol: 0.35 }))
  if (bolt.length) {
    ops.push(K.moat(bolt.map(l => l.pts), 0.7))
    ops.push(K.surf(bolt.map(l => l.pts), 'c3', { part: 's', shine: 'dot', shineSize: 0.6, ol: 0.45 }))
  }
  return ops
}

// ------------------------------------------------------------------------------------------------
export const LIVE = Object.assign(Object.create(null), {
  'clock-time': () => ({ draw: ctx => clockFace(ctx, { rim: 'c1', ticks: true, glass: true, pin: 'c2' }).ops }),

  'alarm-clock-time': () => ({
    draw: ctx => {
      const face = ctx.fills[0]
      const bells = ctx.fills.slice(1)
      const legs = outside(ctx, face).filter(l => !l.closed && !bells.some(b => inAny(l.pts, b) > 0.3))
      const c = clockFace(ctx, { rim: 'accent', ticks: false, pin: 'accent', pinR: 0.85, rimW: 2.2, handW: 1.1 })
      // ringing: the skeleton's S arcs either side, as gold tubes (they read on light and dark)
      const ring = ctx.lines.filter(l => l.plate === 'S' && !l.closed)
      return [
        ...(legs.length ? [K.surf(P.stroke(legs, 1.9), 'c3', { shine: 'none', shade: 0, ol: 0.35 })] : []),
        ...bells.map(b => K.surf(b, 'c3', { part: 'a', shine: 'none' })),
        ...c.ops,
        ...(ring.length ? [K.tube(ring, 'c3', { part: 's', w: 1.3, ol: 0.38 })] : []),
      ]
    },
  }),

  stopwatch: () => ({
    draw: ctx => {
      const face = ctx.fills[0]
      const knobs = outside(ctx, face).filter(l => !l.closed)
      const c = clockFace(ctx, { rim: 'c1', ticks: false, pin: 'accent', pinR: 0.85, rimW: 2.1, handW: 1.1 })
      return [...(knobs.length ? [K.surf(P.stroke(knobs, 2), 'c3', { part: 'a', shine: 'none', ol: 0.38, shade: 0 })] : []), ...c.ops]
    },
  }),

  'watch-time': () => ({
    draw: ctx => {
      const [face, ...straps] = ctx.fills
      const c = clockFace({ ...ctx, fills: [face] }, { rim: 'c3', ticks: false, pin: 'accent', pinR: 0.7, rimW: 1.7, handW: 1, shineSize: 0.75 })
      return [...straps.map(s => K.surf(s, 'c2', { shine: 'none' })), ...c.ops]
    },
  }),

  'calendar-date': () => ({ draw: ctx => calendar(ctx, 'row') }),
  'calendar-month': () => ({ draw: ctx => calendar(ctx, 'row') }),
  'calendar-weekday': () => ({ draw: ctx => calendar(ctx, 'row') }),
  'calendar-event': () => ({ draw: ctx => calendar(ctx, 'strip') }),
  'calendar-range': () => ({ draw: ctx => calendar(ctx, 'strip') }),
  'calendar-tear': () => ({ draw: ctx => calendar(ctx, 'strip') }),

  'battery-level': () => ({ draw: ctx => battery(ctx) }),
  'battery-percent': () => ({ draw: ctx => battery(ctx, { printed: true }) }),
  'battery-charging-level': () => ({ draw: ctx => battery(ctx) }),
  'battery-vertical': () => ({ draw: ctx => battery(ctx, { vertical: true }) }),

  // colour families of the static siblings
  'uv-index': p => ({ col: { main: 'c3', second: Number(p.index) >= 6 ? 'accent' : 'c3', tube: 'c3' } }),
  'map-pin-number': () => ({
    draw: ctx => {
      const pin = ctx.fills[0], T = ctx.texts
      const ops = [K.surf(pin, 'accent', { shineSize: 0.9 })]
      const pb = boxOf(pin)
      const b = T.length ? bbox(T.flatMap(l => l.pts)) : { x0: 12, x1: 12, y0: pb.y0 + pb.w * 0.42, y1: pb.y0 + pb.w * 0.42 }
      const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2
      const r = T.length ? Math.min(pb.w / 2 - 1.6, Math.max(b.x1 - b.x0, b.y1 - b.y0) / 2 + 1.3) : 2.6
      ops.push(K.surf(P.circle(cx, cy, r), 'tint', { part: 'a', inset: true, ol: 0.4, shine: 'none', shade: 0.6 }))
      return [...ops, ...textInk(T, 'ink')]
    },
  }),
  'volume-level': () => ({ col: { main: 'c1', second: 'c2', tube: 'c2' } }),
  // gold bars: the one tube colour whose height reads on a dark page as well as a light one
  // gold bars (the one colour whose height reads on a dark page as well as a light one), each the skeleton's bar
  // at the reference weight, on a sky baseline
  'bar-values': () => ({
    draw: ctx => {
      const h = 0.875 * ctx.s
      const bars = ctx.fills.map(f => boxOf(f)).sort((a, b) => a.x0 - b.x0)
      const base = ctx.lines.filter(l => l.plate === 'A' && !l.closed)
      const ops = []
      if (base.length) ops.push(K.tube(base, 'c1', { part: 'a', w: 1.5 * ctx.s }))
      for (const b of bars) {
        const x0 = b.x0 - h, x1 = b.x1 + h, y0 = b.y0 - h, y1 = b.y1 + h
        ops.push(K.surf(P.rr(x0, y0, x1, y1, Math.min((x1 - x0) / 2, (y1 - y0) / 2, 1.2)), 'c3', { part: 'k', shine: 'dot', shineSize: 0.5 }))
      }
      return ops
    },
  }),
  'cart-count': () => ({ col: { main: 'c1', second: 'c3', tube: 'c1' } }),

  // free lettering always sits on a plate
  'cellular-tech': () => ({
    draw: ctx => {
      if (!ctx.free.length) return null
      return [plate(ctx.free, 'c1', 1.6), ...freeText(ctx.free, 'tint')]
    },
  }),
  'digital-clock': () => ({
    draw: ctx => {
      if (!ctx.free.length) return null
      return [plate(ctx.free, 'c1', 1.7, 2.4), ...freeText(ctx.free, 'tint')]
    },
  }),
  'wind-speed': () => ({
    draw: ctx => {
      if (!ctx.free.length) return null
      // the gusts in sky tubes over the top, the reading on a cream plate below
      const g = ctx.lines.filter(l => !l.closed)
      const fb = bbox(ctx.free.flatMap(l => l.pts))
      const gb = g.length ? bbox(g.flatMap(l => l.pts)) : null
      const ops = []
      if (g.length) {
        // squeeze the gusts into the space above the plate
        const top = 2.2, bot = Math.max(top + 4, fb.y0 - 2.6)
        const sy = Math.min(1, (bot - top) / Math.max(0.1, gb.h))
        const G = g.map(l => ({ ...l, pts: l.pts.map(p => [p[0], top + (p[1] - gb.y0) * sy]) }))
        ops.push(K.tube(G.filter(l => l.plate !== 'A'), 'c1', { w: 1.6 }), K.tube(G.filter(l => l.plate === 'A'), 'c1', { part: 'a', w: 1.45 }))
      }
      ops.push(plate(ctx.free, 'tint', 1.3), ...freeText(ctx.free, 'ink'))
      return ops
    },
  }),
  'price-tag': () => ({
    draw: ctx => {
      // the tag is the skeleton's: its fill plus its outline (the generator grows the outline with the price)
      const T = ctx.texts
      const edge = ctx.lines.filter(l => l.plate === 'K' && !ctx.texts.includes(l))
      const tag = edge.length ? P.unite(ctx.fills[0], P.stroke(edge, 1.6 * ctx.s)) : ctx.fills[0]
      const ops = [K.surf(tag, 'c2', { shineSize: 0.85 })]
      // the string hole: only where it clears the lettering by a margin
      const holes = ctx.lines.filter(l => l.closed && !ctx.texts.includes(l) && Math.max(bbox(l.pts).w, bbox(l.pts).h) < 3)
      const tb = T.length ? bbox(T.flatMap(l => l.pts)) : null
      for (const h of holes) {
        const b = bbox(h.pts), cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, r = Math.max(0.9, b.w / 2 + 0.15)
        if (tb && cx + r + 1.1 > tb.x0 && cy + r > tb.y0 - 0.5 && cy - r < tb.y1 + 0.5) continue
        ops.push(K.surf(P.circle(cx, cy, r), 'tint', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }))
      }
      return [...ops, ...textInk(T, 'ink')]
    },
  }),
})
