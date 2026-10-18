// forge/hand/pixel/plane-landing.mjs: a top-down airliner banking nose-down to the right (white fuselage, blue swept wings and tailplane, ink outline) over a slim runway (wm-a).
// The plane is rasterised from a polygon in plane space (u along the nose, v across), rotated 38 degrees; pure arithmetic, so the output is deterministic.
const W = 24
const g = Array.from({ length: 24 }, () => Array(W).fill('.'))
const TH = (38 * Math.PI) / 180
const C = Math.cos(TH), S = Math.sin(TH)
const CX = 12, CY = 12.5
const inPoly = (pts, px, py) => {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j]
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
// plane space polygons [u, v]
const FUSE = [[-9, -1.6], [3, -1.8], [7.5, -1.5], [10, 0], [7.5, 1.5], [3, 1.8], [-9, 1.6]]
const WING_A = [[-0.5, -1.6], [3.5, -1.6], [-1.5, -7.5], [-4.5, -7.5], [-3.5, -1.6]]
const WING_B = [[-0.5, 1.6], [3.5, 1.6], [-1.5, 7.5], [-4.5, 7.5], [-3.5, 1.6]]
const TAIL_A = [[-9, -1.6], [-6, -1.6], [-8.5, -4.2], [-10, -4.2]]
const TAIL_B = [[-9, 1.6], [-6, 1.6], [-8.5, 4.2], [-10, 4.2]]
const SHAPES = [[FUSE, 'B'], [WING_A, 'W'], [TAIL_A, 'W'], [WING_B, 'V'], [TAIL_B, 'V']]
for (let y = 0; y < 24; y++) for (let x = 0; x < W; x++) {
  const dx = x + 0.5 - CX, dy = y + 0.5 - CY
  const u = dx * C + dy * S, v = -dx * S + dy * C
  for (const [poly, ch] of SHAPES) if (inPoly(poly, u, v)) g[y][x] = ch
}
const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < 24 && g[y][x] !== '.'
const ink = []
for (let y = 0; y < 24; y++) for (let x = 0; x < W; x++) {
  if (g[y][x] === '.' && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) ink.push([x, y])
}
for (const [x, y] of ink) g[y][x] = '#'
// runway: slim tarmac with centre dashes
for (let x = 1; x <= 22; x++) { g[21][x] = 'R'; g[22][x] = 'R' }
for (const x of [3, 4, 9, 10, 15, 16, 21]) g[21][x] = 'D'

const LAYERS = [
  ['B', { fill: 'var(--with-pixel-tint, #FFFFFF)' }],
  ['W', { fill: 'var(--with-pixel-c2, #3F8FE0)' }],
  ['V', { fill: 'var(--with-pixel-shadow, #2A6AB0)' }],
  ['#', {}],
  ['R', { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55', class: 'wm-a' }],
  ['D', { fill: 'var(--with-pixel-tint, #FFFFFF)', class: 'wm-a' }],
]

export default function render() {
  const out = []
  for (const [ch, attrs] of LAYERS) {
    let d = ''
    g.forEach((row, y) => {
      for (let x = 0; x < W; x++) {
        if (row[x] !== ch) continue
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
