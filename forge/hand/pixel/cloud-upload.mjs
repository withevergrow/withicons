// forge/hand/pixel/cloud-upload.mjs — a three-bump pixel cloud with a bold two-pixel up arrow whose solid head sits inside the cloud and whose shaft leaves through a gap in the base.
// Each character is one 1u cell on the 24 grid: # ink, + body tone, = shade, w shine, s the arrow (wm-s).
const GRID = [
  '........................',
  '........................',
  '.........#####..........',
  '.......##+++++##........',
  '......#+ww++++++#.......',
  '.....#++w+++++++#.###...',
  '.....#+++++ss++++#+++#..',
  '..##.#++++ssss++++++++#.',
  '.#++#++++ssssss++++++=#.',
  '.#++++++ssssssss+++++=#.',
  '.#+++++++++ss++++++++=#.',
  '.#+++++++++ss++++++++=#.',
  '.#+++++++++ss++++++++=#.',
  '.#=========ss=========#.',
  '..########.ss.########..',
  '...........ss...........',
  '...........ss...........',
  '...........ss...........',
  '...........ss...........',
  '...........ss...........',
  '...........ss...........',
  '........................',
  '........................',
  '........................',
]

const FILL = 'var(--with-pixel-fill, currentColor)'
const SHINE = 'var(--with-pixel-shine, #FFFFFF)'
const LEGEND = [
  ['+', { fill: FILL, 'fill-opacity': '0.28' }],
  ['=', { fill: FILL, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['s', { class: 'wm-s' }],
  ['w', { fill: SHINE, class: 'wm-shine' }],
]

// one merged h/v path per paint: row runs, stacked into rectangles while the run repeats on the next row
function cells(ch) {
  const rects = [], open = new Map()
  for (let y = 0; y <= GRID.length; y++) {
    const row = GRID[y] || ''
    const runs = new Map()
    for (let x = 0; x < row.length;) {
      if (row[x] !== ch) { x++; continue }
      let n = 1
      while (row[x + n] === ch) n++
      runs.set(x + ':' + n, [x, n]); x += n
    }
    for (const [k, r] of open) if (!runs.has(k)) { rects.push(r); open.delete(k) }
    for (const [k, [x, n]] of runs) { if (open.has(k)) open.get(k)[3]++; else open.set(k, [x, n, y, 1]) }
  }
  return rects.map(([x, n, y, h]) => 'M' + x + ' ' + y + 'h' + n + 'v' + h + 'h-' + n + 'z').join('')
}

export default function render() {
  const out = []
  for (const [ch, attrs] of LEGEND) {
    const d = cells(ch)
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
