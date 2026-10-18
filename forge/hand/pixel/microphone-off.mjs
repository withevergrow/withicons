// forge/hand/pixel/microphone-off.mjs — the pixel microphone (wide, solid-outlined capsule with a strong shaded body,
// two-pixel U-arc, stand and foot) struck by a thin one-pixel diagonal slash with a clear one-pixel gap cut round it.
const MIC = [
  '........................',
  '.........######.........',
  '........#oo+++=#........',
  '........#o++++=#........',
  '........#+++++=#........',
  '........#+++++=#........',
  '........#+++++=#........',
  '........#+++++=#........',
  '....aa..#+++++=#..aa....',
  '....aa..#+++++=#..aa....',
  '....aa..#======#..aa....',
  '....aa...######...aa....',
  '....aaa..........aaa....',
  '.....aaa........aaa.....',
  '......aaaaaaaaaaaa......',
  '........aaaaaaaa........',
  '...........aa...........',
  '...........aa...........',
  '...........aa...........',
  '...........aa...........',
  '.......aaaaaaaaaa.......',
  '.......aaaaaaaaaa.......',
  '........................',
  '........................',
]
const PAINT = {
  '+': { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.5 },
  '=': { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.8 },
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
export default function render() {
  const g = MIC.map(r => r.split(''))
  // thin slash on x = y from (3,3) to (20,20); one clear pixel either side of it
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) if (g[y][x] !== '.' && Math.abs(x - y) <= 1 && x >= 2 && x <= 21) g[y][x] = '.'
  for (let i = 3; i <= 20; i++) g[i][i] = 's'
  const map = g.map(r => r.join(''))
  return ORDER.map(ch => ['path', { d: pathOf(map, ch), ...PAINT[ch] }]).filter(n => n[1].d)
}
