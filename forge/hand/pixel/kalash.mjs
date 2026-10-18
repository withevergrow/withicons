// forge/hand/pixel/kalash.mjs: a round-bellied kalash pot with a wide patterned band and a mouth rim, topped with a pointed coconut between two mango leaves (the leaves are the wm-a swaying part).
const ROWS = [
  '........................',
  '...........##...........',
  '..........#ox#..........',
  '.........#ooox#.........',
  '........#*oooox#........',
  '.AAA....#*oooox#....AAA.',
  '.AXXAAA.#ooooox#.AAAaXA.',
  '..AXXXXA#ooooox#AXXXXA..',
  '...AAAAA#xxxxxx#AAAAA...',
  '....################....',
  '.....#oooooooooooo#.....',
  '....#ooooooooooooox#....',
  '...#*oooooooooooooox#...',
  '...#*xxxxxxxxxxxxxxx#...',
  '...##################...',
  '...#xxxxxxxxxxxxxxxx#...',
  '...##################...',
  '...#ooooooooooooooox#...',
  '...#xoooooooooooooox#...',
  '....#ooooooooooooox#....',
  '....#xoooooooooooox#....',
  '.....#xxxxxxxxxxxx#.....',
  '......############......',
  '........................',
]
const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
// one paint per grid character, emitted back to front
const PAINT = [
  ['o', { fill: F, 'fill-opacity': '0.28' }],
  ['x', { fill: F, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['a', { fill: F, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['X', { fill: F, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['A', { class: 'wm-a' }],
  ['s', { fill: F, 'fill-opacity': '0.28', class: 'wm-s' }],
  ['S', { class: 'wm-s' }],
  ['d', { class: 'wm-deco' }],
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
        d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z'
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
