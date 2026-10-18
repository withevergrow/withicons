// forge/hand/pixel/shield-check.mjs: a heater shield in a shaded body with a bold two-pixel solid ink check.
// Cell-run sprite: each row string is 24 cells; # ink, t tone, s shade, w shine, a ink of the moving part (wm-a).
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
  '.....##############.....',
  '....#ttttttttttttts#....',
  '...#twwtttttttttttts#...',
  '...#twttttttttttttts#...',
  '...#ttttttttttttttts#...',
  '...#ttttttttttttaats#...',
  '...#tttttttttttaaats#...',
  '...#ttttttttttaaatts#...',
  '...#tttaattttaaattts#...',
  '...#tttaaattaaatttts#...',
  '....#tttaaaaaatttts#....',
  '....#ttttaaaattttts#....',
  '.....#ttttaattttts#.....',
  '.....#ttttttttttts#.....',
  '......#ttttttttts#......',
  '.......#ttttttts#.......',
  '........#ttttts#........',
  '.........#ttts#.........',
  '..........#ss#..........',
  '...........##...........',
  '........................',
  '........................',
]

export default function render() {
  return sprite(ROWS, { t: TONE, s: SHADE, '#': {}, a: { class: 'wm-a' }, w: SHINE })
}
