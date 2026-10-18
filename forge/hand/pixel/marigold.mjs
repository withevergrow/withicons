// forge/hand/pixel/marigold.mjs: scalloped marigold: ten round lobes around a white six-petal flower with a centre dot (part A)
// Hand-drawn 24x24 pixel map (1u cells). Legend: '#' ink, '+' tone, '=' shade, 'o' shine; 'w' shine (plain);
// 'A' ink wm-a, 'a' tone wm-a; 'S' ink wm-s; 'D' ink wm-deco
const MAP = [
  '........................',
  '........................',
  '........###..###........',
  '.......#+++##+++#.......',
  '.......#++++++++#.......',
  '....###+++++++++=###....',
  '...#+++++++WW++++++=#...',
  '...#++++++WWWW+++++=#...',
  '...#+++WW+WWWW+WW++=#...',
  '....#++WWW+WW+WWW+=#....',
  '..##+++WWW++++WWW++=##..',
  '..#+++++W++AA++W++++=#..',
  '..#+++++W++AA++W++++=#..',
  '..##+++WWW++++WWW++=##..',
  '....#++WWW+WW+WWW+=#....',
  '...#+++WW+WWWW+WW++=#...',
  '...#++++++WWWW+++++=#...',
  '...#===++++WW++++===#...',
  '....###=++++++++=###....',
  '.......#+++==++=#.......',
  '.......#===##===#.......',
  '........###..###........',
  '........................',
  '........................',
]

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE], ['=', SHADE], ['#', {}],
  ['a', TONE, 'wm-a'], ['A', {}, 'wm-a'], ['W', SHINE, 'wm-a'],
  ['S', {}, 'wm-s'],
  ['D', {}, 'wm-deco'],
  ['ow', SHINE],
]
function paint(rows) {
  const out = []
  for (const [chars, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (!chars.includes(row[x])) { x++; continue }
        let n = 1
        while (x + n < row.length && row[x + n] === row[x]) n++
        d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z'
        x += n
      }
    })
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
export default function render() {
  return paint(MAP)
}
