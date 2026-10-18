// forge/hand/pixel/hand-heart.mjs — Hand heart: an open palm facing up (cuff left, fingers right, thumb raised) with a solid heart floating above it.
// Legend: + body tone, = shade, # ink, a ink detail (wm-a), o shine (wm-shine), w white shine (wm-a).
const MAP = [
  '........aaa...aaa.......',
  '.......aaaaa.aaaaa......',
  '.......awaaaaaaaaa......',
  '.......aaaaaaaaaaa......',
  '........aaaaaaaaa.......',
  '.........aaaaaaa........',
  '..........aaaaa.........',
  '...........aaa..........',
  '............a...........',
  '........................',
  '........................',
  '.........####...........',
  '........#o++=#..........',
  '..####..#+++=#..........',
  '..#o+####++++########...',
  '..#++#+++++++++++++=#...',
  '..#++#++++++++########..',
  '..#++#++++++++++++++=#..',
  '..#++#++++++++#########.',
  '..#++#++++++++++++++=#..',
  '..#==#========########..',
  '..####################..',
  '........................',
  '........................',
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const PAINT = {
  '+': TONE, '=': SHADE, '#': {}, a: { class: 'wm-a' },
  w: { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-a' },
  o: { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' },
}
const ORDER = ['+', '=', '#', 'a', 'w', 'o']
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
  return ORDER.map(ch => ['path', { d: pathOf(ch), ...PAINT[ch] }]).filter(n => n[1].d)
}
