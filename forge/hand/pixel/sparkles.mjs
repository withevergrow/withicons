// forge/hand/pixel/sparkles.mjs: one solid four-point star at the lower left (outlined, shaded body, a glint) and two
// small solid twinkles at the upper and lower right, as in the line drawing.
// Cell-run sprite: each row string is 24 cells; every key maps to one path of horizontal runs.
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
  '........................', '........................', '........................',
  '..................a.....',
  '..................a.....',
  '.........#.......aaa....',
  '.........#.....aaaaaaa..',
  '........#t#......aaa....',
  '........#t#.......a.....',
  '.......#wtt#......a.....',
  '.......#ttt#............',
  '......#ttttt#...........',
  '.....#ttttttt#..........',
  '...##tttttttss##........',
  '.....#tttttss#....a.....',
  '......#tttss#.....a.....',
  '.......#tss#.....aaa....',
  '.......#tss#...aaaaaaa..',
  '........#s#......aaa....',
  '........#s#.......a.....',
  '.........#........a.....',
  '.........#..............',
  '........................', '........................',
]

export default function render() {
  return sprite(ROWS, { t: TONE, s: SHADE, '#': {}, a: { class: 'wm-a' }, w: SHINE })
}
