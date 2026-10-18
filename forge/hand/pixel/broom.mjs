// forge/hand/pixel/broom.mjs: a witch broom: a clean 2px diagonal handle, a binding band and a kite-shaped fan head of bristles (ink outline, centre bristle line, tone body, shade rim)
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink  + tone  = shade  o shine
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '....................##..', // 3
  '...................##...', // 4
  '..................##....', // 5
  '.................##.....', // 6
  '................##......', // 7
  '............##.##.......', // 8
  '..........##++##........', // 9
  '........###++++#........', // 10
  '......##==+#+++#........', // 11
  '.....#+===++#+#.........', // 12
  '...##+o==++++##.........', // 13
  '..#++==o+++==#..........', // 14
  '...#===+++===#..........', // 15
  '...#==+++===#...........', // 16
  '....#+++===+#...........', // 17
  '....#++===+#............', // 18
  '.....#===++#............', // 19
  '......###+#.............', // 20
  '.........##.............', // 21
  '........................', // 22
  '........................', // 23
]
// [chars, paint, class] in paint order
const LAYERS = [
  ['+', TONE], ['=', SHADE], ['#', {}], ['o', SHINE, 'wm-shine'],
]
function paint(rows) {
  const out = []
  for (const [chars, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (!chars.includes(row[x])) { x++; continue }
        let n = 1
        while (x + n < row.length && chars.includes(row[x + n])) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n
      }
    })
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
export default function render() { return paint(MAP) }
