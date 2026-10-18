// forge/hand/pixel/avatar-older-man.mjs: a hand-drawn 24-grid older man bust: a bald head with two grey hair tufts at the sides, eyes, a moustache and shoulders
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
  '........................',
  '........................',
  '..........####..........',
  '.........#++++#.........',
  '........#+o++++#........',
  '......A#+o++++++#A......',
  '.....AbA+++++++=AbA.....',
  '....AbbA+++++++=AbbA....',
  '....AbbA+#++++#=AbbA....',
  '....AbbA+#++++#=AbbA....',
  '....AbbA+++++++=AbbA....',
  '....AbbA+######=AbbA....',
  '.....AA#+##++##=#AA.....',
  '........#+++++=#........',
  '.........#++++#.........',
  '..........####..........',
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
