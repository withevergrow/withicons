// forge/hand/pixel/image-plus.mjs — the pixel picture frame (shaded mountain, ring sun, shine) with a clean
// two-pixel plus badge cut into its bottom-right corner; replaces the generated cropped frame and blob badge.
const PAINT = {
  '+': { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 },
  '=': { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 },
  '#': {},
  a: { class: 'wm-a' },
  s: { class: 'wm-s' },
  o: { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' },
}
const ORDER = ['+', '=', '#', 'a', 's', 'o']
// one merged h/v path per paint: runs per row, stacked into rectangles while the run repeats on the next row
function pathOf(map, ch) {
  const rects = [], open = new Map()
  for (let j = 0; j <= map.length; j++) {
    const row = map[j] || '', runs = new Set()
    for (let i = 0; i < 24; i++) if (row[i] === ch) { let k = i; while (row[k + 1] === ch) k++; runs.add(i + ':' + (k - i + 1)); i = k }
    for (const [key, r] of open) if (!runs.has(key)) { rects.push(r); open.delete(key) }
    for (const key of runs) { if (open.has(key)) open.get(key).h++; else { const [x, w] = key.split(':').map(Number); open.set(key, { x, y: j, w, h: 1 }) } }
  }
  rects.sort((p, q) => p.y - q.y || p.x - q.x)
  return rects.map(r => `M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}z`).join('')
}
function put(g, ch, y, x0, x1 = x0) { for (let x = x0; x <= x1; x++) g[y][x] = ch }
export default function render() {
  const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
  put(g, '#', 3, 2, 20); put(g, '#', 19, 2, 20)
  for (let y = 4; y <= 18; y++) { put(g, '#', y, 1); put(g, '+', y, 2, 19); put(g, '=', y, 20); put(g, '#', y, 21) }
  put(g, 'o', 5, 3, 4); put(g, 'o', 6, 3)
  // ring sun
  put(g, 'a', 6, 13, 14); put(g, 'a', 7, 12); put(g, 'a', 7, 15); put(g, 'a', 8, 12); put(g, 'a', 8, 15); put(g, 'a', 9, 13, 14)
  // mountain: peak at x7-8 y10, one-pixel ridge stepping down both ways like the image sibling
  put(g, 'a', 10, 7, 8)
  for (let y = 11; y <= 18; y++) {
    const l = 7 - (y - 10), r = 8 + (y - 10)
    if (l >= 2) put(g, 'a', y, l)
    if (r <= 19) put(g, 'a', y, r)
  }
  // plus badge with a one-pixel gap round it
  const plus = []
  for (let v = 14; v <= 21; v++) plus.push([17, v], [18, v], [v, 17], [v, 18])
  const near = (x, y) => plus.some(([px, py]) => Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1)
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) if (g[y][x] !== '.' && near(x, y)) g[y][x] = '.'
  for (const [x, y] of plus) g[y][x] = 's'
  const map = g.map(r => r.join(''))
  return ORDER.map(ch => ['path', { d: pathOf(map, ch), ...PAINT[ch] }]).filter(n => n[1].d)
}
