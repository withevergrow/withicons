// forge/hand/pixel/popcorn.mjs — pixel popcorn: a tapered box with alternating light/dark vertical stripes, topped by three distinct round puffs (the moving part).

const ROWS = [
  '........................',
  '........................',
  '..........*AAA..........',
  '.........AaaaaA.........',
  '........AaaaaaaA........',
  '....AAAAAaaaaaXAAAAA....',
  '....A*aaaAaaaXA*aaaA....',
  '...AaaaaaAAaXAAaaaaaA...',
  '...AaaaaXA.AA.AaaaaXA...',
  '....AaaXXA....AaaaXA....',
  '..####################..',
  '...#ooxxooxxooxxooxx#...',
  '...#ooxxooxxooxxooxx#...',
  '...#ooxxooxxooxxooxx#...',
  '....#oxxooxxooxxoox#....',
  '....#oxxooxxooxxoox#....',
  '....#oxxooxxooxxoox#....',
  '....#oxxooxxooxxoox#....',
  '.....#xxooxxooxxoo#.....',
  '.....#xxooxxooxxoo#.....',
  '.....#xxooxxooxxoo#.....',
  '.....##############.....',
  '........................',
  '........................',
]

const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
// one paint per grid character, emitted in this order (back to front)
const PAINT = [
  ['o', { fill: F, 'fill-opacity': '0.28' }],
  ['x', { fill: F, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['a', { fill: F, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['X', { fill: F, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['A', { class: 'wm-a' }],
  ['s', { fill: F, 'fill-opacity': '0.28', class: 'wm-s' }],
  ['z', { fill: F, 'fill-opacity': '0.55', class: 'wm-s' }],
  ['S', { class: 'wm-s' }],
  ['*', { fill: W, class: 'wm-shine' }],
]

function cells(rows) {
  const out = []
  for (const [ch, attrs] of PAINT) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== ch) continue
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}

export default function render() {
  return cells(ROWS)
}
