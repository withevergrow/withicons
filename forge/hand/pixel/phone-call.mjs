// forge/hand/pixel/phone-call.mjs — a thick chunky handset (earpiece top-left, mouthpiece bottom-right, ink outline all round) with two stepped signal arcs set well clear of it in the upper right.
// Each character is one 1u cell on the 24 grid: # ink, a body tone, b shade, w shine, s the signal arcs (wm-s).
const GRID = [
  '........................',
  '........................',
  '...######....ssss.......',
  '..#wwwaab#...sssss......',
  '..#waaaab#......ssss....',
  '..#aaaaab#........ss....',
  '..#aaaaab#...sss...ss...',
  '..#aaaaab#...ssss..sss..',
  '..#aaaab#......sss..ss..',
  '..#aaaab#.......ss..ss..',
  '..#aaaab#.......ss..ss..',
  '..#aaaab#...............',
  '..#baaaab#..............',
  '...#aaaab#..............',
  '...#aaaaab##....#####...',
  '...#baaaaaab####aaaab#..',
  '....#baaaaaaaaaaaaaab#..',
  '.....#baaaaaaaaaaaaab#..',
  '......#baaaaaaaaaaaab#..',
  '.......#bbbaaaaaaaaab#..',
  '........###bbbbbbbbbb#..',
  '...........##########...',
  '........................',
  '........................',
]

const FILL = 'var(--with-pixel-fill, currentColor)'
const SHINE = 'var(--with-pixel-shine, #FFFFFF)'
const LEGEND = [
  ['a', { fill: FILL, 'fill-opacity': '0.28' }],
  ['b', { fill: FILL, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['w', { fill: SHINE, class: 'wm-shine' }],
  ['s', { class: 'wm-s' }],
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
