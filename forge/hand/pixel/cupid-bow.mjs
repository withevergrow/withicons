// forge/hand/pixel/cupid-bow.mjs: cupid bow on the diagonal: a squared-off bow limb with a diagonal string, crossed by a two-pixel arrow that runs up-right and ends in a heart tip (pointing up-right, cleft towards the shaft), small feather at the nock
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink (bow, wm-k)  S ink string  | A ink arrow / + tone / f shade of the arrow and heart (wm-a)  o shine
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '..................AAAA..', // 3
  '...............AAA++fA..', // 4
  '..............Ao++++fA..', // 5
  '.............Ao+++++fA..', // 6
  '.............Afff+++fA..', // 7
  '..............AAA+++fA..', // 8
  '...............A.A++fA..', // 9
  '....######....A..AfffA..', // 10
  '....########.A....AAA...', // 11
  '....S.......AA..........', // 12
  '.....S.....AA...........', // 13
  '......S...AA.#..........', // 14
  '.......S.AA.##..........', // 15
  '........AA..##..........', // 16
  '.......AAS..##..........', // 17
  '......AA..S.##..........', // 18
  '...AAAA....S##..........', // 19
  '....AA......S#..........', // 20
  '.....A..................', // 21
  '........................', // 22
  '........................', // 23
]
// [chars, paint, class] in paint order
const LAYERS = [
  ['S', {}, 'wm-k'], ['#', {}, 'wm-k'], ['+', TONE, 'wm-a'], ['f', SHADE, 'wm-a'], ['A', {}, 'wm-a'], ['o', SHINE, 'wm-shine'],
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
