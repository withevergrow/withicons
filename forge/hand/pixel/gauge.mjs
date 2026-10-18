// forge/hand/pixel/gauge.mjs: a clean pixel dome (the line drawing's open-bottomed dial) with a one-pixel ink rim,
// tone body, shade along the right rim and the bottom row, one glint, a round hub and one bold diagonal needle.
// No tick marks, so it reads at 16 px.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }
// outer extent [x0, x1] of each dome row
const EXT = { 2: [9, 14], 3: [7, 16], 4: [5, 18], 5: [4, 19], 6: [3, 20], 7: [3, 20], 8: [2, 21], 9: [2, 21], 10: [2, 21], 11: [2, 21], 12: [2, 21], 13: [2, 21], 14: [2, 21], 15: [2, 21], 16: [3, 20], 17: [3, 20], 18: [4, 19], 19: [5, 18] }
const LAST = 19

function sprite(g, keys) {
  const runs = {}
  g.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const c = row[x]
      if (!keys[c]) { x++; continue }
      let w = 1
      while (row[x + w] === c) w++
      ;(runs[c] = runs[c] || []).push(`M${x} ${y}h${w}v1h-${w}z`)
      x += w
    }
  })
  return Object.keys(keys).filter((k) => runs[k]).map((k) => ['path', { d: runs[k].join(''), ...keys[k] }])
}

export default function render() {
  const inS = (x, y) => { if (y > LAST) return y <= LAST + 1 && x >= 5 && x <= 18 ? true : x >= 5 && x <= 18; const e = EXT[y]; return !!e && x >= e[0] && x <= e[1] }
  const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
  for (let y = 2; y <= LAST; y++) {
    for (let x = EXT[y][0]; x <= EXT[y][1]; x++) {
      const edge = !inS(x - 1, y) || !inS(x + 1, y) || !inS(x, y - 1) || !inS(x, y + 1)
      if (edge) { g[y][x] = '#'; continue }
      const rim = !inS(x + 1, y) || (inS(x + 1, y) && ((EXT[y][1] === x + 1)))
      g[y][x] = (y === LAST || (EXT[y][1] === x + 1 && x + y >= 20) || (y + 1 <= LAST && EXT[y + 1][1] === x + 1 && x + y >= 20 && false)) ? 's' : 't'
    }
  }
  // shine: a short arc glint at the upper left
  g[4][7] = 'w'; g[4][8] = 'w'; g[5][6] = 'w'
  // hub (4x4 octagon) and needle (two-pixel diagonal)
  const hub = [[12, 11, 12], [13, 10, 13], [14, 10, 13], [15, 11, 12]]
  for (const [y, a, b] of hub) for (let x = a; x <= b; x++) g[y][x] = 'a'
  const needle = [[12, 13, 14], [11, 14, 15], [10, 15, 16], [9, 16, 17], [8, 17, 18]]
  for (const [y, a, b] of needle) for (let x = a; x <= b; x++) g[y][x] = 'a'
  return sprite(g.map((r) => r.join('')), { t: TONE, s: SHADE, '#': { class: 'wm-k' }, a: { class: 'wm-a' }, w: SHINE })
}
