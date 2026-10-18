// forge/hand/pixel/chart-pie.mjs: a round three-quarter pie with a consistent one-pixel outline and its missing
// quarter pulled out by just one pixel (the moving slice), so the circle still reads whole.
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
  '........................', '........................', '........................', '........................', '........................',
  '...........aaa..........',
  '.......###.abbaa........',
  '.....##tt#.abbbba.......',
  '....#wttt#.abbbbba......',
  '...#ttttt#.abbbbca......',
  '...#ttttt#.abbbbbca.....',
  '..#tttttt#.acccccca.....',
  '..#tttttt#.aaaaaaaa.....',
  '..#tttttt#..............',
  '..#ttttttt########......',
  '..#tttttttttttttts#.....',
  '..#tttttttttttttts#.....',
  '...#ttttttttttss#.......',
  '...#tttttttttsss#.......',
  '....#tttsssssss#........',
  '.....##ssssss##.........',
  '.......######...........',
  '........................', '........................',
]

export default function render() {
  return sprite(ROWS, {
    t: TONE, s: SHADE, '#': {},
    b: { ...TONE, class: 'wm-a' }, c: { ...SHADE, class: 'wm-a' }, a: { class: 'wm-a' }, w: SHINE,
  })
}
