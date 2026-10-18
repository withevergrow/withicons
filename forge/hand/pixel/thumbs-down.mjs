// forge/hand/pixel/thumbs-down.mjs: the line version's silhouette in pixels: a shaded cuff bar on the left (static), a plain mitten-shaped hand with the thumb dropping from the bottom (moving part, wm-a).
// Map: # ink  + tone  = shade  o shine | A ink / a tone / b shade / O shine of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '..####..AAAAAAAAAAAAA...', // 3
  '..#o+#.AOOaaaaaaaaaabA..', // 4
  '..#+=#.AaaaaaaaaaaabbA..', // 5
  '..#+=#.AaaaaaaaaaaabbA..', // 6
  '..#+=#.AaaaaaaaaaaabbA..', // 7
  '..#+=#.AaaaaaaaaaaabbA..', // 8
  '..#+=#.AaaaaaaaaaaabbA..', // 9
  '..#+=#.AaaaaaaaaaaabbA..', // 10
  '..#+=#.AaaaabbbbbbbbA...', // 11
  '..#+=#..AAaabAAAAAAAA...', // 12
  '..####...AaabA..........', // 13
  '.........AaabA..........', // 14
  '.........AaabAA.........', // 15
  '.........AaaaabA........', // 16
  '.........AaaaabA........', // 17
  '.........AbbbbbA........', // 18
  '..........AAAAA.........', // 19
  '........................', // 20
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
