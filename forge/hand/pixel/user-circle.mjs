// forge/hand/pixel/user-circle.mjs: a one-pixel ring with a shaded head disc and shoulder dome inside, ink outlines, shine pixels.
// Map legend: '#' ink, '+' tone, '=' shade, 'o' shine (wm-shine), 'S' ink (wm-s), 'A' ink (wm-a). One character per 1u cell on the 24 grid.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const MAP = [
  '........................',
  '........................',
  '........########........',
  '......##........##......',
  '.....#............#.....',
  '....#.....####.....#....',
  '...#.....#o++=#.....#...',
  '...#....#o++++=#....#...',
  '..#.....#+++++=#.....#..',
  '..#.....#+++++=#.....#..',
  '..#.....#=++++=#.....#..',
  '..#......#====#......#..',
  '..#.......####.......#..',
  '..#..................#..',
  '..#......######......#..',
  '..#...###o++++=###...#..',
  '...#.#+o+++++++++=#.#...',
  '...##+++++++++++++=##...',
  '....#=++++++++++++=#....',
  '.....#==++++++++==#.....',
  '......##========##......',
  '........########........',
  '........................',
  '........................',
]
const LAYERS = [
  ['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['#', {}, 'wm-k'],
  ['A', {}, 'wm-a'], ['S', {}, 'wm-s'], ['o', SHINE, 'wm-shine'],
]
function paint(rows) {
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (row[x] !== ch) { x++; continue }
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n
      }
    })
    if (d) out.push(['path', { d, ...attrs, class: cls }])
  }
  return out
}
export default function render() {
  return paint(MAP)
}
