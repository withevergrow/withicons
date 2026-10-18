// forge/hand/pixel/shuffle.mjs — two crossing stair-stepped 2px strokes with one continuous over the other, the other broken at the crossing, and solid arrowheads at the right (arrowheads are the moving part).
// Legend: # ink, + body tone, = shade, o shine; @ - ~ are the wm-a part's ink, tone and shade.
const ART = [
  '........................',
  '........................',
  '........................',
  '.................@@.....',
  '.................@@@....',
  '.................@@@@...',
  '..#####........##@@@@@..',
  '..######......###@@@@@..',
  '.......##....##..@@@@...',
  '........##..##...@@@....',
  '.........#..##...@@.....',
  '...........##...........',
  '..........##............',
  '..........##............',
  '.........##..#...@@.....',
  '........##..##...@@@....',
  '.......##....##..@@@@...',
  '..######......###@@@@@..',
  '..#####........##@@@@@..',
  '.................@@@@...',
  '.................@@@....',
  '.................@@.....',
  '........................',
  '........................',
]

const FILL = 'var(--with-pixel-fill, currentColor)'
const LAYERS = [
  ['+', { fill: FILL, 'fill-opacity': '0.28' }],
  ['=', { fill: FILL, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['-', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['~', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['@', { class: 'wm-a' }],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }],
]

// merged h/v rectangles: runs per row, stacked while the same run repeats on the next row
function pathOf(ch) {
  const rects = [], open = new Map()
  for (let j = 0; j <= ART.length; j++) {
    const row = ART[j] || '', runs = new Set()
    if (row && row.length !== 24) throw new Error('row ' + j + ' is ' + row.length + ' wide')
    for (let i = 0; i < 24; i++) if (row[i] === ch) { let k = i; while (row[k + 1] === ch) k++; runs.add(i + ':' + (k - i + 1)); i = k }
    for (const [key, r] of open) if (!runs.has(key)) { rects.push(r); open.delete(key) }
    for (const key of runs) { if (open.has(key)) open.get(key).h++; else { const [x, w] = key.split(':').map(Number); open.set(key, { x, y: j, w, h: 1 }) } }
  }
  rects.sort((p, q) => p.y - q.y || p.x - q.x)
  return rects.map(r => 'M' + r.x + ' ' + r.y + 'h' + r.w + 'v' + r.h + 'h-' + r.w + 'z').join('')
}

export default function render() {
  const out = []
  for (const [ch, attrs] of LAYERS) {
    const d = pathOf(ch)
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
