// DUO build: skeleton -> IconNodes. See duo.mjs.
//
// Layers, back to front:
//   defs    (gradient render only) one linearGradient wg-duo-<icon>-0, userSpaceOnUse, along (1,1) across the ink:
//           var(--with-duo-from, currentColor) -> var(--with-duo-to, currentColor). Unset, both ends are currentColor.
//   tone    every fill silhouette at 20% of var(--with-duo, currentColor) (class by plate)
//   accent  the accent detail (_duo-accent.mjs), stroke var(--with-duo-accent, currentColor), UNDER the ink so the
//           outline stays whole where a detail meets it
//   ink     every other path: no stroke attribute (the root currentColor), or url(#wg-duo-<icon>-0) in the gradient render
// Strokes never set width/caps/joins: the root does, so the strokeWidth prop works.
import { distToPolyline } from '../kernel/geom.mjs'
import { PLATE_CLASS } from './line.mjs'
import { accentSet } from './_duo-accent.mjs'

// The default Duo output carries NO gradient: ink strokes inherit the root currentColor, so Duo stays a plain
// universal style (CSS-only classes stay one currentColor mask, a root `stroke` override still reaches the lines,
// design tools import plain strokes, ~480 B/icon). build(icon, { gradient: true }) is the opt-in gradient render
// (defs + url() strokes, ~+400 B/icon) behind the "Duo gradient" look. Flipping GRADIENT to true makes every Duo
// icon carry it (then emit-classes must treat an all-currentColor gradient as ink, or class icons lose `color`).
export const GRADIENT = false
export const V = {
  tone: 'var(--with-duo, currentColor)',
  accent: 'var(--with-duo-accent, currentColor)',
  from: 'var(--with-duo-from, currentColor)',
  to: 'var(--with-duo-to, currentColor)',
}
const r2 = v => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? 0 : r }
const safe = s => String(s || 'icon').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'icon'

// the plate a fill belongs to: the A or S plate when most of its outline runs along
// that plate's centrelines (within 0.4u) and closer than along K; otherwise K
export function fillPlate(f, lines) {
  const pts = f.subs.flatMap(s => s.pts)
  if (!pts.length) return 'K'
  const share = plate => {
    const ls = lines.filter(l => l.plate === plate && l.pts.length)
    if (!ls.length) return 0
    return pts.filter(p => ls.some(l => distToPolyline(p, l.pts, l.closed) < 0.4)).length / pts.length
  }
  const k = share('K')
  let best = 'K', bestShare = 0.6
  for (const pl of ['A', 'S']) { const s = share(pl); if (s > bestShare && s > k) { best = pl; bestShare = s } }
  return best
}

// gradient axis along (1,1) spanning the icon's ink (stroke half-width included), at least 16u long
export function axis(lines) {
  let lo = Infinity, hi = -Infinity, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (const l of lines) for (const p of l.pts || []) {
    const s = p[0] + p[1]
    if (s < lo) lo = s; if (s > hi) hi = s
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]
  }
  if (!isFinite(lo)) return [2, 2, 22, 22]
  lo -= 1.4; hi += 1.4
  if (hi - lo < 16) { const m = (lo + hi) / 2; lo = m - 8; hi = m + 8 }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, sc = cx + cy
  return [cx + (lo - sc) / 2, cy + (lo - sc) / 2, cx + (hi - sc) / 2, cy + (hi - sc) / 2].map(r2)
}

export function build(icon, { gradient = GRADIENT } = {}) {
  const paths = (icon.paths || []).filter(p => p && p.d)
  const parted = paths.some(p => PLATE_CLASS[p.plate])
  const cls = (a, plate) => (PLATE_CLASS[plate] ? { ...a, class: PLATE_CLASS[plate] } : a)
  const out = []
  const acc = accentSet(icon)
  const ink = paths.filter(p => !acc.has(p))
  let G = null
  if (gradient && ink.length) {
    const id = `wg-duo-${safe(icon.name)}-0`
    const [x1, y1, x2, y2] = axis((icon.lines || []).filter(l => l && l.pts && l.pts.length))
    out.push(['defs', {}, [['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V.from }],
      ['stop', { offset: 1, 'stop-color': V.to }],
    ]]]])
    G = `url(#${id})`
  }
  for (const f of icon.fills || []) {
    const a = { d: f.d, fill: V.tone, 'fill-opacity': 0.2, stroke: 'none', 'fill-rule': 'evenodd' }
    const c = parted ? PLATE_CLASS[fillPlate(f, icon.lines || [])] : null
    if (c) a.class = c
    out.push(['path', a])
  }
  for (const p of paths) if (acc.has(p)) out.push(['path', cls({ d: p.d, stroke: V.accent }, p.plate)])
  for (const p of ink) out.push(['path', cls(G ? { d: p.d, stroke: G } : { d: p.d }, p.plate)])
  return out
}

// today's Duo, exactly (the safety net: never throw)
export function plain(icon) {
  const parted = icon.paths.some(p => PLATE_CLASS[p.plate])
  const tone = (icon.fills || []).map(f => {
    const a = { d: f.d, fill: V.tone, 'fill-opacity': 0.2, stroke: 'none', 'fill-rule': 'evenodd' }
    const c = parted ? PLATE_CLASS[fillPlate(f, icon.lines || [])] : null
    if (c) a.class = c
    return ['path', a]
  })
  return [...tone, ...icon.paths.map(p => ['path', PLATE_CLASS[p.plate] ? { d: p.d, class: PLATE_CLASS[p.plate] } : { d: p.d }])]
}
