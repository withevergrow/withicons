// forge/hand/pixel/cloud-download.mjs — a three-bump pixel cloud on a flat base with a two-pixel arrow dropping
// out through a gap in the base; replaces the generated lumpy mushroom with the arrow jammed in.
const CLOUD = [
  '........................',
  '........................',
  '.........#####..........',
  '.......##+++++##........',
  '......#+oo++++++#.......',
  '.....#++o+++++++#.###...',
  '.....#+++++++++++#+++#..',
  '..##.#++++++++++++++++#.',
  '.#++#++++++++++++++++=#.',
  '.#+++++++++++++++++++=#.',
  '.#+++++++++++++++++++=#.',
  '.#+++++++++++++++++++=#.',
  '.#+++++++++++++++++++=#.',
  '.#====================#.',
  '..####################..',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
]
const PAINT = {
  '+': { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 },
  '=': { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 },
  '#': {},
  s: { class: 'wm-s' },
  o: { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' },
}
const ORDER = ['+', '=', '#', 's', 'o']
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
  const g = CLOUD.map(r => r.split(''))
  for (let y = 7; y <= 17; y++) put(g, 's', y, 11, 12)
  put(g, '.', 14, 10); put(g, '.', 14, 13)
  put(g, 's', 16, 7, 8); put(g, 's', 16, 15, 16)
  put(g, 's', 17, 8, 9); put(g, 's', 17, 14, 15)
  put(g, 's', 18, 9, 14); put(g, 's', 19, 10, 13); put(g, 's', 20, 11, 12)
  const map = g.map(r => r.join(''))
  return ORDER.map(ch => ['path', { d: pathOf(map, ch), ...PAINT[ch] }]).filter(n => n[1].d)
}
