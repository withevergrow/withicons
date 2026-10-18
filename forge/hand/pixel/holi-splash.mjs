// forge/hand/pixel/holi-splash.mjs: Holi colour splat: a chunky six-lobed blob with a solid ink core (part A) and three bold loose drops (part S)
// Hand-drawn 24x24 pixel map (1u cells). Legend: '#' ink, '+' tone, '=' shade, 'o' shine; 'w' shine (plain);
// 'A' ink wm-a, 'a' tone wm-a, 'e' shade wm-a, 'W' shine wm-a; 'S' ink wm-s; 'D' ink wm-deco
const MAP = [
  '........................',
  '.....................S..',
  '..........##........SSS.',
  '..........#+#........S..',
  '.........#++#...........',
  '.........#+++#..........',
  '.....####+++++#.........',
  '.....#+++++++++#####....',
  '.....#++++++++++++==#...',
  '......#++++++++++==#....',
  '.S....#+++WWAA+++=#.....',
  'SSS...#+++WAAA++==#.....',
  '.S...#++++AAAA++=#......',
  '....#+++++AAAA++=#......',
  '...#+++++++++++++=#.....',
  '...#####++++++==++=#....',
  '........#+++===#===#....',
  '........#++==##.####....',
  '.........#+=#...........',
  '.........#==#...........',
  '..........##.........S..',
  '....................SSS.',
  '.....................S..',
  '........................',
]

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE], ['=', SHADE], ['#', {}],
  ['a', TONE, 'wm-a'], ['e', SHADE, 'wm-a'], ['A', {}, 'wm-a'], ['W', SHINE, 'wm-a'],
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
