// PIXEL — five-point stars (Live icons: rating-stars, forge/dynamic/_parts-progress.mjs star() / halfStar()).
//
// A star polygon a few pixels wide rasterises into a blob (a 3x3 block, a lumpy ring), so pixel draws stars from
// hand-drawn sprites instead, picked by size and snapped mirror-symmetric about the grid's centre column:
//   small (R < 3.6u)   3x3   .#. / ### / #.#        a filled star; a half star lights its right column in body tone
//                            .#. / #.# / .#.        an outline-only star (an empty slot) is a hollow diamond
//   big                9x8   outlined star with a body-tone inside (left half only for a half star; empty when unfilled)
// Only exact 10-point stars (and the 6-point left halves) with a 0.3-0.6 inner ratio qualify, so the static set,
// whose stars are drawn with rounded joins, is untouched.
//
//   pixelStars(icon)         -> { icon (without the star lines and star fills), stars: [{ cx, cy, R, half, filled }] } | null
//   stampStars(L, stars, sh) mutates L.ink / L.tone / L.glint
import * as G from './_pixel-core.mjs'

const SMALL = ['.#.', '###', '#.#']
const HOLLOW = ['.#.', '#.#', '.#.']
const BIG = [
  '....#....',
  '...#+#...',
  '####+####',
  '.#+++++#.',
  '..#+++#..',
  '.#++#++#.',
  '.#+#.#+#.',
  '.##...##.',
]

const near = (a, b, t) => Math.abs(a - b) <= t
const q4 = v => Math.round(v * 4) / 4

// a closed 10-point star or its 6-point left half -> { cx, cy, R, half } | null
function starOf(l) {
  if (!l.closed || !l.pts) return null
  const p = l.pts
  if (p.length === 10) {
    const cx = p.reduce((s, q) => s + q[0], 0) / 10, cy = p.reduce((s, q) => s + q[1], 0) / 10
    const r = p.map(q => Math.hypot(q[0] - cx, q[1] - cy))
    for (const o of [0, 1]) {
      const outer = r.filter((_, k) => k % 2 === o), inner = r.filter((_, k) => k % 2 !== o)
      const R = outer.reduce((s, v) => s + v, 0) / 5, Ri = inner.reduce((s, v) => s + v, 0) / 5
      if (R < 1 || R > 7) continue
      if (!outer.every(v => near(v, R, 0.4)) || !inner.every(v => near(v, Ri, 0.4))) continue
      if (Ri / R < 0.3 || Ri / R > 0.6) continue
      // point up: the top tip sits straight above the centre
      const top = p.reduce((a, q) => q[1] < a[1] ? q : a)
      if (!near(top[0], cx, 0.3)) continue
      return { cx: q4(cx), cy: q4(cy), R, half: false }
    }
    return null
  }
  if (p.length === 6) {
    // top tip, then down the left side to the bottom inner vertex, both on the axis
    const [t, , o2, , , b] = p
    if (!near(t[0], b[0], 0.05) || !(t[1] < b[1]) || !p.slice(1, 5).every(q => q[0] < t[0] - 0.2)) return null
    // coordinates are snapped to 0.25u: average what the outer points say about R and the centre
    const s72 = Math.sin(72 * Math.PI / 180), s36 = Math.sin(36 * Math.PI / 180), c72 = Math.cos(72 * Math.PI / 180), c36 = Math.cos(36 * Math.PI / 180)
    const o4 = p[4]
    const R = ((t[0] - o2[0]) / s72 + (t[0] - o4[0]) / s36) / 2
    if (R < 1 || R > 7) return null
    const cy = q4((t[1] + R + o2[1] + R * c72 + o4[1] - R * c36) / 3)
    const Ri = b[1] - cy
    if (Ri / R < 0.3 || Ri / R > 0.6) return null
    return { cx: t[0], cy, R, half: true }
  }
  return null
}

const centroid = pts => [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length]

export function pixelStars(icon) {
  const stars = [], drop = new Set()
  for (const l of icon.lines || []) {
    const s = starOf(l)
    if (!s) continue
    stars.push({ ...s, line: l })
    drop.add(l)
  }
  if (!stars.length) return null
  // a fill ring that traces a star: the star is solid, and the ring leaves the mass (the sprite carries it)
  const isStarRing = pts => stars.find(s => {
    const [x, y] = centroid(pts)
    return pts.every(q => Math.hypot(q[0] - s.cx, q[1] - s.cy) <= s.R + 0.4) && Math.hypot(x - s.cx, y - s.cy) <= s.R * 0.7
  })
  for (const r of icon.fillSet || []) { const s = isStarRing(r); if (s) s.filled = true }
  return {
    icon: { ...icon, lines: (icon.lines || []).filter(l => !drop.has(l)), fillSet: (icon.fillSet || []).filter(r => !isStarRing(r)) },
    stars,
  }
}

// a sprite's left column / top row: centred on the star, a tie broken away from the centre column so stars
// mirrored about x = 12 stay mirrored in pixels
function origin(c, size, axis) {
  const u = c - size / 2
  if (Math.abs(u - Math.round(u)) < 1e-6) return Math.round(u)
  const f = Math.floor(u)
  if (Math.abs(u - f - 0.5) < 1e-6) return (u + size / 2 < axis + 0.5) ? f : f + 1
  return Math.round(u)
}

export function stampStars(L, stars, sh = [0, 0]) {
  for (const s of stars) {
    const big = s.R >= 3.6
    const rows = big ? BIG : s.filled || s.half ? SMALL : HOLLOW
    const w = rows[0].length, h = rows.length
    const [u, v] = G.toCell([s.cx, s.cy], sh)
    const i0 = origin(u, w, 7)
    // the big sprite's tip sits on the star's tip; a small one is centred
    const j0 = big ? Math.round(v - s.R / G.P) : origin(v, h, 7)
    rows.forEach((row, j) => [...row].forEach((c, i) => {
      const x = i0 + i, y = j0 + j
      if (!G.inb(x, y) || c === '.') return
      const k = G.ix(x, y)
      L.ink[k] = 0; L.tone[k] = 0; if (L.glint) L.glint[k] = 0
      if (c === '#') {
        // a half star: the small sprite's right column is body tone
        if (!big && s.half && i === w - 1) L.tone[k] = 1
        else L.ink[k] = 1
      } else if (s.filled && !(s.half && i > (w - 1) / 2)) L.tone[k] = 1
    }))
  }
}
