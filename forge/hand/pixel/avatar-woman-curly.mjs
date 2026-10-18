// forge/hand/pixel/avatar-woman-curly.mjs: a hand-drawn 24-grid bust: a big symmetric scalloped cloud of dark curls framing a clear light face (eyes, smile) above the shoulder bar; clearly different from the straight-haired and afro avatars
// Map legend: '#' ink, '+' tone, '=' shade, 'o' shine; 'A' ink wm-a, 'a' tone wm-a, 'b' shade wm-a, 'S' ink wm-s,
// 's' tone wm-s, 'O' shine (wm-shine). One character per 1u cell on the 24 grid.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE], ['=', SHADE], ['#', {}],
  ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'],
  ['s', TONE, 'wm-s'], ['S', {}, 'wm-s'],
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
  '.........AAAAAA.........',
  '........AOAAAAAA........',
  '....AAA.AAAAAAAA.AAA....',
  '...AAAAAAAAAAAAAAAAAA...',
  '..AAOAAAAAAAAAAAAAAAAA..',
  '..AAAAAAAAAAAAAAAAAAAA..',
  '..AAAAAAAAAAAAAAAAAAAA..',
  '...AAAAAAAAAAAAAAAAAA...',
  '..AAAAAAA++++++AAAAAAA..',
  '.AAAAAAA++++++++AAAAAAA.',
  '.AAAAAA++#++++#+=AAAAAA.',
  '.AAAAAA++#++++#+=AAAAAA.',
  '..AAAAA+++#++#++=AAAAA..',
  '..AAAAAA+++##++=AAAAAA..',
  '...AAAAAA+++++=AAAAAA...',
  '....AAA..######..AAA....',
  '........................',
  '.......AAAA..AAAA.......',
  '.....AAOaaaaaaaabAA.....',
  '....AaaaaaaaaaaaabbA....',
  '....AAAAAAAAAAAAAAAA....',
  '........................',
  '........................',
]

export default function render() {
  return paint(MAP)
}
