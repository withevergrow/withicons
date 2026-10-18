// forge/hand/pixel/pen-tool.mjs: fountain-pen nib on the diagonal, tip bottom-left: shaded teardrop nib with a breather hole and slit, an ink collar, and a distinct barrel block with end cap and a shine.
// Map: # ink  + tone  = shade  o shine | A ink / a tone / b shade / O shine of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '........................', // 3
  '................##......', // 4
  '...............#+=#.....', // 5
  '..............#+++=#....', // 6
  '.............#+++++=#...', // 7
  '............#+o+++==#...', // 8
  '...........#+o+++==#....', // 9
  '........###+++++==#.....', // 10
  '.......#+##++++==#......', // 11
  '......#o++##++==#.......', // 12
  '......#o+++##==#........', // 13
  '.....#++###+###.........', // 14
  '.....#++#.#++##.........', // 15
  '....#+++###+==#.........', // 16
  '....#++#++===#..........', // 17
  '....#+#+===##...........', // 18
  '....##===##.............', // 19
  '....#####...............', // 20
  '........................', // 21
  '........................', // 22
  '........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'], ['o', SHINE, 'wm-shine'], ['O', SHINE, 'wm-shine']]
export default function render() {
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    let d = ''
    MAP.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (row[x] !== ch) { x++; continue }
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n
      }
    })
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
