// forge/hand/pixel/bluetooth.mjs: the Bluetooth rune as bold two-pixel stair-stepped ink (vertical spine, two right-pointing
// chevrons) on a rounded grey pill badge, darker grey inside the two chevron pockets and a white highlight on the pill's top-left.
const RUNE = [
  '........................',
  '........................',
  '...........##...........',
  '...........###..........',
  '...........####.........',
  '...........##.##........',
  '...........##..##.......',
  '.......##..##...##......',
  '........##.##..##.......',
  '.........####.##........',
  '..........#####.........',
  '...........###..........',
  '...........###..........',
  '..........#####.........',
  '.........####.##........',
  '........##.##..##.......',
  '.......##..##...##......',
  '...........##..##.......',
  '...........##.##........',
  '...........####.........',
  '...........###..........',
  '...........##...........',
  '........................',
  '........................',
]
// compose: pill body '+', chevron pockets '=', highlight 'o', then the rune '#' on top
const PILL = { 1: [7, 16], 2: [6, 17], 21: [6, 17], 22: [7, 16] }
const POCKETS = { 5: [13], 6: [13, 14], 7: [13, 14, 15], 8: [13, 14], 9: [13], 14: [13], 15: [13, 14], 16: [13, 14, 15], 17: [13, 14], 18: [13] }
const SHINE = [[7, 3], [6, 4], [6, 5], [6, 6]]
const MAP = RUNE.map((row, y) => {
  const cells = row.split('')
  const [a, b] = PILL[y] || (y >= 3 && y <= 20 ? [5, 18] : [1, 0])
  for (let x = a; x <= b; x++) cells[x] = '+'
  for (const x of POCKETS[y] || []) cells[x] = '='
  for (const [sx, sy] of SHINE) if (sy === y) cells[sx] = 'o'
  for (let x = 0; x < 24; x++) if (row[x] === '#') cells[x] = '#'
  return cells.join('')
})
const PAINT = {
  '+': [{ fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }],
  '=': [{ fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }],
  '#': [{ class: 'wm-k' }],
  a: [{ class: 'wm-a' }],
  o: [{ fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }],
}
const ORDER = ['+', '=', '#', 'a', 'o']
// one merged h/v path per paint: each row's runs, stacked into rectangles while the run repeats on the next row
function pathOf(ch) {
  const rects = [], open = new Map()
  for (let j = 0; j <= MAP.length; j++) {
    const row = MAP[j] || '', runs = new Set()
    for (let i = 0; i < 24; i++) if (row[i] === ch) { let k = i; while (row[k + 1] === ch) k++; runs.add(i + ':' + (k - i + 1)); i = k }
    for (const [key, r] of open) if (!runs.has(key)) { rects.push(r); open.delete(key) }
    for (const key of runs) { if (open.has(key)) open.get(key).h++; else { const [x, w] = key.split(':').map(Number); open.set(key, { x, y: j, w, h: 1 }) } }
  }
  rects.sort((p, q) => p.y - q.y || p.x - q.x)
  return rects.map(r => `M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}z`).join('')
}
export default function render() {
  return ORDER.map(ch => ['path', { d: pathOf(ch), ...PAINT[ch][0] }]).filter(n => n[1].d)
}
