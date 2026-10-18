// forge/hand/pixel/house-plus.mjs: a wide pitched house like home (45 degree roof, eaves, boxy body) with a bold plus cross (the wm-s badge) on the wall.
// Cell-run sprite: each row string is 24 cells; # ink, t body tone, s shade, o shine; A/a/b moving part (wm-a) ink/tone/shade, S badge ink (wm-s).
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const KEYS = {
  t: TONE,
  s: SHADE,
  '#': {},
  a: { ...TONE, class: 'wm-a' },
  b: { ...SHADE, class: 'wm-a' },
  A: { class: 'wm-a' },
  S: { class: 'wm-s' },
  o: { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' },
}
const ROWS = [
  '........................',
  '........................',
  '........................',
  '...........##...........',
  '..........#ss#..........',
  '.........#osss#.........',
  '........#osssss#........',
  '.......#osssssss#.......',
  '......#ssssssssss#......',
  '.....#ssssssssssss#.....',
  '....#ssssssssssssss#....',
  '...##################...',
  '....#otttttttttttts#....',
  '....#ttttttSSttttts#....',
  '....#ttttttSSttttts#....',
  '....#ttttSSSSSSttts#....',
  '....#ttttSSSSSSttts#....',
  '....#ttttttSSttttts#....',
  '....#ttttttSSttttts#....',
  '....#ssssssssssssss#....',
  '....################....',
  '........................',
  '........................',
  '........................',
]
export default function render() {
  const runs = {}
  ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const c = row[x]
      if (!KEYS[c]) { x++; continue }
      let w = 1
      while (row[x + w] === c) w++
      ;(runs[c] = runs[c] || []).push(`M${x} ${y}h${w}v1h-${w}z`)
      x += w
    }
  })
  return Object.keys(KEYS).filter((k) => runs[k]).map((k) => ['path', { d: runs[k].join(''), ...KEYS[k] }])
}
