// forge/hand/pixel/wifi-off.mjs: three 2px stepped wifi arcs over a soft grey fan, cut by a 2px slash with a clear gap on both sides.
// The grid is built from a fixed map (deterministic): wifi arcs, translucent fan, a diagonal gap, then the slash.
const WIFI = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........########........',
  '......############......',
  '....####........####....',
  '...###............###...',
  '...##..............##...',
  '..........####..........',
  '........########........',
  '......####....####......',
  '.....###........###.....',
  '.....##..........##.....',
  '..........####..........',
  '........########........',
  '.......###....###.......',
  '.......##......##.......',
  '........................',
  '..........####..........',
  '..........####..........',
  '..........####..........',
  '........................',
]
const g = WIFI.map(r => r.split(''))
// soft fan between and under the arcs
for (let y = 6; y < 19; y++) {
  const lo = g[y].indexOf('#'), hi = g[y].lastIndexOf('#')
  for (let x = lo; x <= hi; x++) if (g[y][x] === '.') g[y][x] = '+'
}
// clear a 1.5px lane either side of the slash so it reads on any background
for (let y = 1; y <= 22; y++) for (let x = 1; x <= 22; x++) {
  const d = x - y
  if (d >= -2 && d <= 3) g[y][x] = '.'
}
// the 2px slash
for (let i = 2; i <= 21; i++) { g[i][i] = 'S'; g[i][i + 1] = 'S' }

const PAINT = {
  '+': { fill: 'var(--with-pixel-c2, #C9CED6)' },
  '#': { fill: 'var(--with-pixel-fill, currentColor)', class: 'wm-k' },
  S: { class: 'wm-s' },
}
// one merged path per paint: runs stacked into rectangles while the run repeats on the next row
function pathOf(ch) {
  const rects = [], open = new Map()
  for (let j = 0; j <= g.length; j++) {
    const row = g[j] || [], runs = new Set()
    for (let i = 0; i < 24; i++) if (row[i] === ch) { let k = i; while (row[k + 1] === ch) k++; runs.add(i + ':' + (k - i + 1)); i = k }
    for (const [key, r] of open) if (!runs.has(key)) { rects.push(r); open.delete(key) }
    for (const key of runs) { if (open.has(key)) open.get(key).h++; else { const [x, w] = key.split(':').map(Number); open.set(key, { x, y: j, w, h: 1 }) } }
  }
  rects.sort((p, q) => p.y - q.y || p.x - q.x)
  return rects.map(r => `M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}z`).join('')
}
export default function render() {
  return ['+', '#', 'S'].map(ch => ['path', { d: pathOf(ch), ...PAINT[ch] }]).filter(n => n[1].d)
}
