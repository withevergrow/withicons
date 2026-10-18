// forge/hand/pixel/pin.mjs: upright pushpin: shaded cylinder head with a shine edge, a wide ink flange bar and a two-pixel needle below (the needle is the moving part)
// Map: # ink  + tone  = shade  o shine  | a tone / b shade / A ink of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '.........######.........', // 3
  '........#oo++++#........', // 4
  '........#o+++++#........', // 5
  '........#o+++==#........', // 6
  '........#+++===#........', // 7
  '........#+++===#........', // 8
  '........#+++===#........', // 9
  '.....##############.....', // 10
  '.....#============#.....', // 11
  '......############......', // 12
  '...........AA...........', // 13
  '...........AA...........', // 14
  '...........AA...........', // 15
  '...........AA...........', // 16
  '...........AA...........', // 17
  '...........AA...........', // 18
  '...........AA...........', // 19
  '...........AA...........', // 20
  '...........AA...........', // 21
  '...........AA...........', // 22
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
