// ANIME kit — layer constructors and family parts. FROZEN for redrawers.
//
// A redraw returns a list of OPS, bottom to top. compose() (_anime-compose.mjs) adds the
// outline, the cel shadow, cast shadows, rim light and shine to every surface for you.
//
//   surf(shape, role, o)     a cel-shaded surface with an ink outline.
//       o.part   'k' | 'a' | 's'        motion plate (default 'k')
//       o.shade  0 | number              crescent strength (default 1); 0 = flat
//       o.inset  true                    a recess (screen, window, keyhole): shadow under its upper-left rim, casts nothing
//       o.cast   false                   receive no cast shadows from the surfaces above
//       o.casts  false                   cast no shadow onto the surfaces below
//       o.shine  'streak' | 'dot' | 'glass' | 'glint' | 'none'   (default 'streak')
//       o.shineSize  1                   scale the highlight
//       o.ol     0.6                     outline width beyond the surface (0 = none)
//       o.olShift 1                      shadow-side thickening of the outline
//       o.rim    true                    a rim light (role edge) along the shadow edge
//   ink(lines, o)            brush ink: o.w (0.95), o.taper (true | number), o.role ('ink'), o.part, o.shift
//   tube(lines, role, o)     coloured line with outline: o.w (1.55), o.ol (0.5), o.shade, o.part
//   paint(shape, role, o)    flat paint, no outline: o.op opacity, o.part
//   shine(shape, o)          explicit specular shape (white), wm-shine
//   deco(shape, role, o)     decoration beside the object (wm-deco), o.ol thin outline
//   sparkle(o)               4-point sparkle in the freest corner: o.r (2.4), o.min, o.role ('c3'), o.mini (true), o.where [[x,y,mx,my]...]
//   sparkleAt(x, y, r, o)    a sparkle exactly there (+ a mini dot unless o.mini === false)
//   speed(x, y, deg, o)      speed lines trailing from (x,y) in direction deg: o.n (3), o.len (4), o.gap (1.8), o.w (0.8)
//   ground(cx, cy, rx, ry)   flat contact shadow (wm-shadow)
//   moat(shape, gap)         erase shape (+gap) from everything painted so far (a gap around a badge or slash)
//   asPart(ops, part)        set the motion plate of a group of ops
// Lines are path data strings, point lists or [{pts, closed}].
import * as P from './_anime-prim.mjs'

export const surf = (shape, role = 'c1', o = {}) => ({ t: 'surf', shape, role, part: 'k', ...o })
export const ink = (lines, o = {}) => ({ t: 'ink', lines, ...o })
export const tube = (lines, role = 'c1', o = {}) => ({ t: 'tube', lines, role, ...o })
export const paint = (shape, role = 'ink', o = {}) => ({ t: 'paint', shape, role, ...o })
export const shine = (shape, o = {}) => ({ t: 'shine', shape, ...o })
export const deco = (shape, role = 'c3', o = {}) => ({ t: 'deco', shape, role, ...o })
export const sparkle = (o = {}) => ({ t: 'sparkle', auto: true, ...o })
export const sparkleAt = (x, y, r = 2, o = {}) => ({ t: 'sparkle', x, y, r, mx: o.mx ?? 1, my: o.my ?? -1, ...o })
export const ground = (cx, cy, rx, ry = 1.1, o = {}) => ({ t: 'ground', shape: P.ellipse(cx, cy, rx, ry), ...o })
export const moat = (shape, gap = 0) => ({ t: 'cut', shape, gap })
export const asPart = (ops, part) => [ops].flat(Infinity).filter(Boolean).map(o => ({ ...o, part }))

// speed lines: n parallel tapered strokes trailing behind a moving object
export function speed(x, y, deg, o = {}) {
  const n = o.n ?? 3, len = o.len ?? 4, gap = o.gap ?? 1.8, w = o.w ?? 0.8
  const a = deg * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx
  const lines = []
  for (let i = 0; i < n; i++) {
    const k = i - (n - 1) / 2, L = len * (1 - Math.abs(k) * 0.28)
    const sx = x + nx * k * gap, sy = y + ny * k * gap
    lines.push([[sx, sy], [sx + dx * L, sy + dy * L]])
  }
  return { t: 'ink', lines, w, taper: 3, shift: 0, part: 'deco', role: o.role || 'c1' }
}

// ---------------------------------------------------------------------------
// family parts (shapes). Use these so every family is drawn the same way.

// the anime heart: two round lobes and a soft point
export function heartShape(cx = 12, cy = 12.5, s = 1) {
  const pts = []
  for (let i = 0; i <= 64; i++) {
    const t = i / 64 * Math.PI * 2
    const x = 16 * Math.sin(t) ** 3
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    pts.push([cx + x * 0.58 * s, cy + y * 0.58 * s - 0.6 * s])
  }
  pts.pop()
  return [pts]
}
// a page with a folded corner: [sheet, fold] shapes
export function page(x0 = 4.5, y0 = 2.5, x1 = 19.5, y1 = 21.5, fold = 5, r = 2) {
  const sheet = P.poly([[x0, y0], [x1 - fold, y0], [x1, y0 + fold], [x1, y1], [x0, y1]], [r, 0.6, 0.6, r, r])
  const flap = P.poly([[x1 - fold, y0], [x1 - fold, y0 + fold - 0.8], [x1 - fold + 0.8, y0 + fold], [x1, y0 + fold]], [0.4, 0.8, 0.8, 0.4])
  return { sheet, flap }
}
// a puffy anime cloud (three lobes on a flat-ish base)
export function cloudShape(cx = 12, cy = 13, s = 1) {
  const c = (x, y, r) => P.circle(cx + x * s, cy + y * s, r * s)
  return P.unite(c(-5, 2, 4.2), c(0.5, -1.5, 5.8), c(5.6, 2.2, 3.9), P.rr(cx - 6.8 * s, cy + 1 * s, cx + 7.2 * s, cy + 6.2 * s, 3 * s))
}
// a gear: n rounded teeth around a disc
export function gearShape(cx = 12, cy = 12, r = 7.2, n = 8, tooth = 2.4, tw = 3.4) {
  const teeth = P.around(P.rr(cx - tw / 2, cy - r - tooth + 0.4, cx + tw / 2, cy - r + 1.5, [1, 1, 0, 0]), n, cx, cy)
  return P.unite(P.circle(cx, cy, r), teeth)
}
// an anime person: head disc + rounded shoulders: { head, body, hair }
export function person(cx = 12, top = 3, s = 1) {
  const hr = 4.1 * s, hy = top + hr
  const head = P.circle(cx, hy, hr)
  const body = P.poly([[cx - 8 * s, top + 19 * s], [cx - 6.6 * s, top + 12.6 * s], [cx + 6.6 * s, top + 12.6 * s], [cx + 8 * s, top + 19 * s]], [1.4 * s, 4.2 * s, 4.2 * s, 1.4 * s])
  // spiky anime fringe: the cap of the head plus three locks falling over the forehead
  const cap = P.clip(P.circle(cx, hy - 0.35 * s, hr + 0.55 * s), P.rect(cx - 6 * s, top - 2, cx + 6 * s, hy - 0.2 * s))
  const locks = P.join(
    P.poly([[cx - 4.4 * s, hy - 1.2 * s], [cx - 1.6 * s, hy - 1.2 * s], [cx - 3.4 * s, hy + 1.9 * s]], 0.35 * s),
    P.poly([[cx - 2.2 * s, hy - 1.2 * s], [cx + 1.6 * s, hy - 1.2 * s], [cx - 0.6 * s, hy + 1.5 * s]], 0.35 * s),
    P.poly([[cx + 0.8 * s, hy - 1.2 * s], [cx + 4.5 * s, hy - 1.2 * s], [cx + 3.6 * s, hy + 2.2 * s]], 0.35 * s),
  )
  const hair = P.unite(cap, locks)
  return { head, body, hair }
}
// a 5-point anime star (soft points)
export const starShape = (cx = 12, cy = 12.6, R = 10, r = 4.6, round = 1) => P.star(cx, cy, R, r, 5, -90, round)
