// forge/hand/pixel/lightbulb-off.mjs: an unlit pixel bulb: round dome, neck and a striped screw base, struck through by a clean 2px diagonal slash with a one-pixel gap either side (the slash is the wm-s signal).
const ROWS = [
  '........................',
  '........................',
  '..SS.....######.........',
  '...SS..##ooooox##.......',
  '....SS.*oooooooox#......',
  '.....SS.ooooooooox#.....',
  '......SS.oooooooox#.....',
  '.....#.SS.ooooooox#.....',
  '.....#o.SS.oooooox#.....',
  '.....#oo.SS.ooooox#.....',
  '.....#xoo.SS.oooox#.....',
  '......#ooo.SS.oox#......',
  '......#xooo.SS.ox#......',
  '.......#xooo.SS.#.......',
  '........#xooo.SS........',
  '.........#xxxx.SS.......',
  '.........######.SS......',
  '........#xxxxxx#.SS.....',
  '........########..SS....',
  '........#xxxxxx#...SS...',
  '........########....SS..',
  '.........#xxxx#......SS.',
  '..........####..........',
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
