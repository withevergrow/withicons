// forge/hand/pixel/rose.mjs: a rose on a straight stem: tulip-shaped bud with a scalloped three-tip rim and a spiral centre, a two-pixel stem and two mirrored leaves (stem and leaves sway as the A part)
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink  + tone  = shade  o shine | A ink / a tone / b shade of the stem and leaves (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '.......##..##..##.......', // 3
  '......#++##++##+=#......', // 4
  '......#o++#####+=#......', // 5
  '......#o++#+++#+=#......', // 6
  '......#+++#+###+=#......', // 7
  '......#=++#+++++=#......', // 8
  '.......#=+#####=#.......', // 9
  '........#=++++=#........', // 10
  '.........#====#.........', // 11
  '....AAAA..####..AAAA....', // 12
  '....AaabA..Ab..AaabA....', // 13
  '....AbaabA.Ab.AaaabA....', // 14
  '.....AbbbbAAbAabbbA.....', // 15
  '......AAAbAAbAbAAA......', // 16
  '.........AAAbAA.........', // 17
  '...........Ab...........', // 18
  '...........Ab...........', // 19
  '...........Ab...........', // 20
  '...........Ab...........', // 21
  '........................', // 22
  '........................', // 23
]
// [chars, paint, class] in paint order
const LAYERS = [
  ['+', TONE], ['=', SHADE], ['#', {}], ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'], ['o', SHINE, 'wm-shine'],
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
