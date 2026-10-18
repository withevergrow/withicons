// forge/hand/pixel/moon.mjs: a fat stair-stepped crescent (opening to the upper right, horns up and right) with a one-cell ink outline, a shaded lower-right rim and a shine on the upper left.
// Cell-run sprite: each row string is 24 cells; # ink, t tone, s shade, w shine.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }
function sprite(rows, keys) {
  const runs = {}
  rows.forEach((row, y) => {
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

const ROWS = [
  '........................',
  '........................',
  '.........#..............',
  '......####..............',
  '.....#tt#...............',
  '....#ttt#...............',
  '...#wttt#...............',
  '..#wttt#................',
  '..#wtttt#...............',
  '..#ttttt#...............',
  '.#tttttt#...............',
  '.#ttttttt#..............',
  '.#ttttttt#..............',
  '.#tttttttt#.............',
  '..#tttttttt##...........',
  '..#tttttttttt###.###....',
  '..#ttttttttttttt#ts#....',
  '...#ttttttttttttts#.....',
  '....#ttttttttttts#......',
  '.....#sssttttsss#.......',
  '......###ssss###........',
  '.........####...........',
  '........................',
  '........................',
]

export default function render() {
  return sprite(ROWS, { t: TONE, s: SHADE, '#': {}, w: SHINE })
}
