// forge/hand/pixel/sky-lantern.mjs: a hexagonal paper lantern: a pointed roof with a finial, a body with a lit window band crossed by a centre pole, a tapered base and three tassels hanging below (the tassels are the wm-a part).
const ROWS = [
  '........................',
  '...........##...........',
  '...........##...........',
  '.........######.........',
  '.......##ox##ox##.......',
  '.....##xxxx##xxxx##.....',
  '.....##############.....',
  '.....#*ooox##oooox#.....',
  '.....#oooox##oooox#.....',
  '.....#xxxxx##xxxxx#.....',
  '.....##############.....',
  '.....#oooox##oooox#.....',
  '.....#oooox##oooox#.....',
  '.....#xxxxx##xxxxx#.....',
  '.....##############.....',
  '......#xoox##ooox#......',
  '.......#xxx##xxx#.......',
  '........########........',
  '........A..AA..A........',
  '........A..AA..A........',
  '........A..AA..A........',
  '.......AA..AA..AA.......',
  '........................',
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
