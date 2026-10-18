// forge/hand/pixel/dices.mjs — pixel dices: a back die (moving part, top-right) with two diagonal pips,
// mostly whole with only its lower-left corner tucked behind the front die, and a larger front die
// (bottom-left) with three diagonal pips; a 1px gap ring separates them.

const N = 24

// die(grid, x, y, size, pips, k): outline k.toUpperCase-style chars passed in k = [outline, face, shade, pip]
function die(g, x0, y0, s, pips, [O, F, S]) {
  const x1 = x0 + s - 1, y1 = y0 + s - 1
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const cornerX = x === x0 || x === x1, cornerY = y === y0 || y === y1
      if (cornerX && cornerY) { g[y][x] = '.'; continue }
      if (cornerX || cornerY) { g[y][x] = O; continue }
      g[y][x] = (x === x1 - 1 || y === y1 - 1) ? S : F
    }
  }
  g[y0 + 1][x0 + 1] = '*'
  for (const [px, py] of pips) for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) g[y0 + py + dy][x0 + px + dx] = O
}

function grid() {
  const g = Array.from({ length: N }, () => Array(N).fill('.'))
  // back die, 11x11, top-right
  die(g, 11, 2, 11, [[2, 2], [6, 6]], ['A', 'a', 'X'])
  // gap ring + front die, 12x12, bottom-left
  for (let y = 9; y <= 22; y++) for (let x = 1; x <= 14; x++) g[y][x] = '.'
  die(g, 2, 10, 12, [[2, 2], [5, 5], [8, 8]], ['#', 'o', 'x'])
  return g.map((r) => r.join(''))
}

const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
// one paint per grid character, emitted in this order (back to front)
const PAINT = [
  ['a', { fill: F, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['X', { fill: F, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['A', { class: 'wm-a' }],
  ['o', { fill: F, 'fill-opacity': '0.28' }],
  ['x', { fill: F, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['*', { fill: W, class: 'wm-shine' }],
]

function cells(rows) {
  const out = []
  for (const [ch, attrs] of PAINT) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== ch) continue
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}

export default function render() {
  return cells(grid())
}
