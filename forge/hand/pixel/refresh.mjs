// forge/hand/pixel/refresh.mjs: two point-symmetric stepped two-pixel arcs, the top one ending in a solid square-stepped arrowhead pointing right, the bottom one ending in one pointing left (the line version's refresh-cw).
// Map: # ink  + tone  = shade  o shine | A ink / a tone / b shade / O shine of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '................A.......', // 2
  '................AA......', // 3
  '........AAAAAAAAAAA.....', // 4
  '.......AAAAAAAA.AAAA....', // 5
  '......AAA.......AAA.....', // 6
  '.....AA.........AA......', // 7
  '....AAA.........A.......', // 8
  '....AA..................', // 9
  '....AA..................', // 10
  '....AA..................', // 11
  '..................AA....', // 12
  '..................AA....', // 13
  '..................AA....', // 14
  '.......A.........AAA....', // 15
  '......AA.........AA.....', // 16
  '.....AAA.......AAA......', // 17
  '....AAAA.AAAAAAAA.......', // 18
  '.....AAAAAAAAAAA........', // 19
  '......AA................', // 20
  '.......A................', // 21
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
