// pixel worried: round face with bold slanted worried brows (inner ends raised), tall eyes with catchlights and a wavy mouth;
// the sweat drop sits on the right temple, overlapping the head outline.
// Cell-aligned 24x24 sprite: '#'-type keys are 1px ink outline / 2px detail, then body .28, shade .55, one shine group.
const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
const FACE = [
  '........................',
  '........................',
  '........########........',
  '......##bbbbbbbb##......',
  '.....#bwwbbbbbbbbs#.....',
  '....#bwbbbbbbbbbbbs#....',
  '...#bwbbbbbbbbbbbbbs#...',
  '...#bbbbEEEbbEEEbbbs#...',
  '..#bbbEEEbbbbbbEEEbbs#..',
  '..#bbbbbbbbbbbbbbbbbs#..',
  '..#bbbbxEbbbbbbxEbbbs#..',
  '..#bbbbEEbbbbbbEEbbbs#..',
  '..#bbbbEEbbbbbbEEbbbs#..',
  '..#bbbbbbbbbbbbbbbbss#..',
  '..#bbbbbbbbbbbbbbbbss#..',
  '..#bbbbEEbbEEbbEEbbss#..',
  '...#bbbbbEEbbEEbbbss#...',
  '....#bbbbbbbbbbbsss#....',
  '.....#bbbbbbbbbsss#.....',
  '......##bbbbbsss##......',
  '........########........',
  '........................',
  '........................',
  '........................',
]
// sweat drop, laid over the face at column 17
const DROP = ['..D..', '.DcD.', 'DxccD', 'DccdD', 'DcddD', '.DDD.']
const ART = FACE.map((row, y) => {
  const r = DROP[y - 1]
  if (!r) return row
  const a = row.split('')
  for (let i = 0; i < r.length; i++) if (r[i] !== '.') a[17 + i] = r[i]
  return a.join('')
})
// paint order = legend order
const LEGEND = [
  ['b', { fill: F, 'fill-opacity': '0.14', class: 'wm-k' }],
  ['s', { fill: F, 'fill-opacity': '0.4', class: 'wm-k' }],
  ['#', { class: 'wm-k' }],
  ['E', { class: 'wm-a' }],
  ['c', { fill: F, 'fill-opacity': '0.28', class: 'wm-s' }],
  ['d', { fill: F, 'fill-opacity': '0.55', class: 'wm-s' }],
  ['D', { class: 'wm-s' }],
  ['w', { fill: W, class: 'wm-shine' }],
  ['x', { fill: W, class: 'wm-shine' }],
]
function cells(ch) {
  let d = ''
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ch) continue
      let e = x
      while (row[e + 1] === ch) e++
      const w = e - x + 1
      d += `M${x} ${y}h${w}v1h-${w}z`
      x = e
    }
  })
  return d
}
export default function render() {
  return LEGEND.map(([ch, attrs]) => ['path', { d: cells(ch), ...attrs }]).filter((n) => n[1].d)
}
