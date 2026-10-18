// forge/hand/pixel/arrow-up.mjs: solid up arrow, 3-wide centred stem and a symmetric two-pixel diagonal head (the arrow-right sibling turned upward). Whole arrow is the moving part (wm-a).
// Map: # ink  + tone  = shade  o shine | A ink / a tone / b shade / O shine of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '........................', // 3
  '..........AAA...........', // 4
  '..........AAA...........', // 5
  '.........AAAAA..........', // 6
  '........AAAAAAA.........', // 7
  '.......AA.AAA.AA........', // 8
  '......AA..AAA..AA.......', // 9
  '.....AA...AAA...AA......', // 10
  '..........AAA...........', // 11
  '..........AAA...........', // 12
  '..........AAA...........', // 13
  '..........AAA...........', // 14
  '..........AAA...........', // 15
  '..........AAA...........', // 16
  '..........AAA...........', // 17
  '..........AAA...........', // 18
  '..........AAA...........', // 19
  '........................', // 20
  '........................', // 21
  '........................', // 22
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
