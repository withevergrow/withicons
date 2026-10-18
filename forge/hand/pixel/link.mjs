// forge/hand/pixel/link.mjs: two chunky chain links on the diagonal: thick outlined rings with hollow centres, overlapping and interlocked, tone body, one shine pixel per link
// Map: # ink  + tone  = shade  o shine  | a tone / b shade / A ink of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '...............AAAA.....', // 3
  '.............AAaaaaA....', // 4
  '............AaaAAAaaA...', // 5
  '...........AaaA...AaA...', // 6
  '..........AaaA....AaA...', // 7
  '..........AaA.....AaA...', // 8
  '.........#+#.....AaA....', // 9
  '.......##+++##..AaaA....', // 10
  '......#++#+++#.AaaA.....', // 11
  '.....#++#.Aa++#aaA......', // 12
  '....#++#..AA+++AA.......', // 13
  '....#+#.....#+#.........', // 14
  '...#+#.....#+#..........', // 15
  '...#o#....#++#..........', // 16
  '...#+#...#++#...........', // 17
  '...#++###++#............', // 18
  '....#++++##.............', // 19
  '.....####...............', // 20
  '........................', // 21
  '........................', // 22
  '........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'], ['o', SHINE, 'wm-shine']]
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
