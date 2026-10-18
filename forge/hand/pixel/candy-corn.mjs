// forge/hand/pixel/candy-corn.mjs: candy corn: a rounded upright triangle with a wider base, three warm tiers (cream tip, orange middle, yellow base) split by 1px ink seams, ink outline, soft shade on the right and a shine on the left.
// Hand-drawn 24x24 pixel sprite (1u cells), built row by row from the inner half-widths below so the silhouette stays symmetric.
// Cells: # ink, w cream tip, o orange middle, y yellow base, s shade, h shine.
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [row, inner x0, inner x1, tier] ; tier t tip, m middle, b base, '#' seam/base ink row
const ROWS = [
  [2, 10, 13, '#'],
  [3, 10, 13, 't'], [4, 10, 13, 't'],
  [5, 9, 14, 't'], [6, 9, 14, 't'],
  [7, 8, 15, 't'],
  [8, 8, 15, '#'],
  [9, 7, 16, 'm'], [10, 7, 16, 'm'],
  [11, 6, 17, 'm'], [12, 6, 17, 'm'],
  [13, 5, 18, 'm'],
  [14, 5, 18, '#'],
  [15, 4, 19, 'b'], [16, 4, 19, 'b'],
  [17, 3, 20, 'b'], [18, 3, 20, 'b'], [19, 3, 20, 'b'],
  [20, 3, 20, '#'],
]
const SPRITE = Array.from({ length: 24 }, () => Array(24).fill('.'))
const tone = { t: 'w', m: 'o', b: 'y' }
for (const [j, a, b, t] of ROWS) {
  if (t === '#') { for (let i = a; i <= b; i++) SPRITE[j][i] = '#'; if (j !== 2 && j !== 20) { SPRITE[j][a - 1] = '#'; SPRITE[j][b + 1] = '#' } continue }
  SPRITE[j][a - 1] = '#'; SPRITE[j][b + 1] = '#'
  for (let i = a; i <= b; i++) SPRITE[j][i] = tone[t]
  SPRITE[j][b] = 's'
}
// seam rows carry their outline too, bottom row stays inset so the base is rounded
SPRITE[8][7] = '#'; SPRITE[8][16] = '#'; SPRITE[14][4] = '#'; SPRITE[14][19] = '#'
SPRITE[20][2] = '.'; SPRITE[20][21] = '.'
SPRITE[19][2] = '#'; SPRITE[19][21] = '#'
// shine on the left of the middle and base tiers
SPRITE[9][7] = 'h'; SPRITE[10][7] = 'h'; SPRITE[15][4] = 'h'; SPRITE[16][4] = 'h'; SPRITE[17][3] = 'h'
SPRITE[4][10] = 'h'

const SHADE = { fill: v('shadow', '#9A5A08'), 'fill-opacity': 0.45 }
const PAINT = [
  ['w', { fill: v('c3', '#FFF8EC') }, 'wm-k'],
  ['o', { fill: v('c2', '#FF8C1A') }, 'wm-k'],
  ['y', { fill: v('c1', '#FFC93C') }, 'wm-k'],
  ['s', SHADE, 'wm-k'],
  ['#', {}, 'wm-k'],
  ['h', { fill: v('shine', '#FFFFFF'), 'fill-opacity': 0.7 }, 'wm-shine'],
]

function runsD(ch) {
  let d = ''
  SPRITE.forEach((row, j) => {
    let i = 0
    while (i < 24) {
      if (row[i] !== ch) { i++; continue }
      let k = i
      while (k < 24 && row[k] === ch) k++
      d += `M${i} ${j}h${k - i}v1h${i - k}z`
      i = k
    }
  })
  return d
}

export default function render() {
  const out = []
  for (const [ch, attrs, cls] of PAINT) {
    const d = runsD(ch)
    if (d) out.push(['path', { d, ...attrs, class: cls }])
  }
  return out
}
