// forge/hand/pixel/arrow-right.mjs: right arrow, 3-wide centred shaft and the same open two-pixel diagonal chevron head as arrow-up/arrow-down (arrow-up turned clockwise). Whole arrow is the moving part (wm-a).
// Map: # ink  + tone  = shade  o shine  | a tone / b shade / A ink of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '........................', // 3
  '........................', // 4
  '.............A..........', // 5
  '.............AA.........', // 6
  '..............AA........', // 7
  '...............AA.......', // 8
  '................AAA.....', // 9
  '....AAAAAAAAAAAAAAAA....', // 10
  '....AAAAAAAAAAAAAAAA....', // 11
  '....AAAAAAAAAAAAAAAA....', // 12
  '................AAA.....', // 13
  '...............AA.......', // 14
  '..............AA........', // 15
  '.............AA.........', // 16
  '.............A..........', // 17
  '........................', // 18
  '........................', // 19
  '........................', // 20
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
