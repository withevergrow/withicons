// forge/hand/pixel/crop.mjs — hand-drawn pixel art: two crisp interlocking 2px L brackets (top-left and bottom-right), no fill.
// Each character is one 1u cell on the 24 grid: # ink, a body tone, b shade, w shine,
// k / A / W the moving part (wm-a), s the badge (wm-s). Rows are converted to cell-aligned paths.
const GRID = [
  '........................',
  '........................',
  '.....##.................',
  '.....##.................',
  '.....##.................',
  '..#################.....',
  '..#################.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....##..........##.....',
  '.....#################..',
  '.....#################..',
  '.................##.....',
  '.................##.....',
  '.................##.....',
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
  ['A', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['k', { class: 'wm-a' }],
  ['W', { fill: SHINE, class: 'wm-a wm-shine' }],
  ['s', { class: 'wm-s' }],
]

function cells(ch) {
  let d = ''
  GRID.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (row[x] !== ch) { x++; continue }
      let n = 1
      while (row[x + n] === ch) n++
      d += `M${x} ${y}h${n}v1h-${n}z`
      x += n
    }
  })
  return d
}

export default function render() {
  const out = []
  for (const [ch, attrs] of LEGEND) {
    const d = cells(ch)
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
