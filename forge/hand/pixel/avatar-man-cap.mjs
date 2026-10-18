// forge/hand/pixel/avatar-man-cap.mjs: a hand-drawn 24-grid man bust in a baseball cap: a shaded dome with a brim pointing right, a light face with two eyes and a smile, shoulders
// Map legend: '#' ink, '+' tone, '=' shade, 'o' shine; 'A' ink wm-a, 'a' tone wm-a, 'b' shade wm-a, 'O' shine (wm-shine).
// One character per 1u cell on the 24 grid.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE], ['=', SHADE], ['#', {}],
  ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'],
  ['o', SHINE], ['O', SHINE, 'wm-shine'],
]
function paint(rows) {
  const out = []
  for (const [chars, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (!chars.includes(row[x])) { x++; continue }
        let n = 1
        while (x + n < row.length && row[x + n] === row[x]) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n
      }
    })
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}

const MAP = [
  '............A...........',
  '.........AAAbAA.........',
  '........AbbbbbbA........',
  '.......AbobbbbbbA.......',
  '......AbbbobbbbbbA......',
  '......AbbbbbbbbbbA......',
  '......AbbbbbbbbbbAAAAA..',
  '......AaAAAAAAAAabbbbbA.',
  '.......A++++++++AbbbbA..',
  '.......#+++++++=#AAAA...',
  '.......#+#++++#=#.......',
  '.......#+#++++#=#.......',
  '.......#+++++++=#.......',
  '.......#++#++#++#.......',
  '.......#+++##+++#.......',
  '........#++++==#........',
  '........AA++++AA........',
  '......AAaaAAAAaaAA......',
  '.....AaaaaaaaaaaabA.....',
  '.....AaaaaaaaaaaabA.....',
  '.....AaaaaaaaaabbbA.....',
  '......AAAAAAAAAAAA......',
  '........................',
  '........................',
]

export default function render() {
  return paint(MAP)
}
