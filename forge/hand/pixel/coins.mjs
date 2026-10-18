// forge/hand/pixel/coins.mjs — a stack of three coins in perspective: the top coin (part A) shows a rim, a face and a bar mark, the two below show their edge walls separated by ink lines.
// Each character is one 1u cell on the 24 grid: # ink, +/= face and wall tone, k/p/q/W the top coin (wm-a), w shine.
const GRID = [
'........................',
  '........................',
  '.......kkkkkkkkkk.......',
  '.....kkqqqqqqqqqqkk.....',
  '...kkqpWWppkkpppppqkk...',
  '...kqpWppppkkppppppqk...',
  '...kqqpppppkkpppppqqk...',
  '...kpqqqqqqqqqqqqqqpk...',
  '...kpppqqqqqqqqqqpppk...',
  '...kppppppppppppppppk...',
  '...kkppppppppppppppkk...',
  '...#+kkppppppppppkk=#...',
  '...#+++kkkkkkkkkk===#...',
  '...#+++++++++++++===#...',
  '...##++++++++++++==##...',
  '...#+##++++++++++##=#...',
  '...#+++##########===#...',
  '...#+++++++++++++===#...',
  '...##++++++++++++==##...',
  '.....##++++++++++##.....',
  '.......##########.......',
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
  ['w', { fill: SHINE, class: 'wm-shine' }],
  ['p', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['q', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['k', { class: 'wm-a' }],
  ['W', { fill: SHINE, class: 'wm-a wm-shine' }],
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
