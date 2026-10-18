// forge/hand/pixel/palette.mjs: the artist's palette of the line drawing: a round board with the thumb notch bitten
// out of the lower right and three solid paint wells (two at the top, one at the lower left), one-pixel ink rim,
// tone board, shade along the lower-right rim, a glint at the upper left.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }
// outer extent [x0, x1] of each row of the board
const EXT = {
  2: [9, 14], 3: [7, 16], 4: [5, 18], 5: [4, 19], 6: [3, 20], 7: [3, 20], 8: [2, 21], 9: [2, 21], 10: [2, 21],
  11: [2, 21], 12: [2, 21], 13: [2, 20], 14: [2, 19], 15: [2, 18], 16: [3, 16], 17: [3, 15], 18: [4, 15],
  19: [5, 15], 20: [7, 15], 21: [9, 14],
}
const HOLE = [[1, 2], [0, 3], [0, 3], [1, 2]] // 4x4 octagon: per row [from, to]
const HOLES = [[7, 7], [13, 6], [5, 13]] // [left x, top y]

export default function render() {
  const inS = (x, y) => { const e = EXT[y]; return !!e && x >= e[0] && x <= e[1] }
  const isInk = (x, y) => inS(x, y) && (!inS(x - 1, y) || !inS(x + 1, y) || !inS(x, y - 1) || !inS(x, y + 1))
  const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
  for (let y = 2; y <= 21; y++) {
    for (let x = EXT[y][0]; x <= EXT[y][1]; x++) {
      if (isInk(x, y)) g[y][x] = '#'
      else g[y][x] = (isInk(x + 1, y) || isInk(x, y + 1)) && x + y >= 22 ? 's' : 't'
    }
  }
  g[4][7] = 'w'; g[4][8] = 'w'; g[5][6] = 'w'
  for (const [hx, hy] of HOLES) HOLE.forEach(([a, b], r) => { for (let c = a; c <= b; c++) g[hy + r][hx + c] = 'a' })
  const runs = {}
  g.forEach((row, y) => {
    for (let x = 0; x < 24;) {
      const c = row[x]
      if (c === '.') { x++; continue }
      let w = 1
      while (row[x + w] === c) w++
      ;(runs[c] = runs[c] || []).push(`M${x} ${y}h${w}v1h-${w}z`)
      x += w
    }
  })
  const keys = { t: TONE, s: SHADE, '#': { class: 'wm-k' }, a: { class: 'wm-a' }, w: SHINE }
  return Object.keys(keys).filter((k) => runs[k]).map((k) => ['path', { d: runs[k].join(''), ...keys[k] }])
}
