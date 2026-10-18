// forge/hand/pixel/eye-off.mjs: a whole pixel eye (outlined almond, shaded white, round pupil with a glint) crossed by
// one clean two-pixel slash from top left to bottom right, with no moat cut beside it.
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

const EYE = [
  '........................', '........................', '........................', '........................', '........................',
  '.........######.........',
  '.......##ttwttt##.......',
  '.....##tttttttttt##.....',
  '....#tttttttttttttt#....',
  '...#ttttttpppptttttt#...',
  '..#ttttttpppppptttttt#..',
  '.#tttttttppppppttttttt#.',
  '.#tttttttpppppptttttts#.',
  '..#ttttttppppppttttts#..',
  '...#ttttttppppttttts#...',
  '....#ttttttttttttss#....',
  '.....##ttttttttss##.....',
  '.......##ssssss##.......',
  '.........######.........',
  '........................', '........................', '........................', '........................', '........................',
]

export default function render() {
  const g = EYE.map((r) => [...r])
  for (let y = 2; y <= 20; y++) { g[y][y] = 'S'; g[y][y + 1] = 'S' }
  return sprite(g.map((r) => r.join('')), {
    t: TONE, s: SHADE, '#': {}, p: { class: 'wm-a' }, S: { class: 'wm-s' }, w: SHINE,
  })
}
