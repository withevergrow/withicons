// forge/hand/pixel/candy-cane.mjs: a thick J-shaped candy cane with a round hook (as in the line version), red and white diagonal stripe bands and a 1px ink outline.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink outline, T white stripe (c1), R red stripe (c2), W shine.
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'........................', // 2
'........########........', // 3
'.......#WRTTTRRR#.......', // 4
'......#RRTTTRRRTT#......', // 5
'.....#RRTTTRRRTTTR#.....', // 6
'.....#RTTT####TTRR#.....', // 7
'....#WTTT#....#RRRT#....', // 8
'....#TTT#......#RTT#....', // 9
'....#TTR#......#TTT#....', // 10
'....#TRR#......#TTR#....', // 11
'....#RRR#......#TRR#....', // 12
'....#RRT#......#RRR#....', // 13
'....#RTT#.......###.....', // 14
'....#TTT#...............', // 15
'....#TTR#...............', // 16
'....#TRR#...............', // 17
'....#RRR#...............', // 18
'....#RRT#...............', // 19
'.....###................', // 20
'........................', // 21
'........................', // 22
'........................', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [char, attrs, class] in paint order
const PAINT = [
  ['T', { fill: v('fill', '#FFFFFF') }, 'wm-k'],
  ['R', { fill: v('c2', '#E0262F') }, 'wm-k'],
  ['#', {}, 'wm-k'],
  ['W', { fill: v('shine', '#FFFFFF') }, 'wm-shine'],
]
function runsD(ch) {
  let d = ''
  SPRITE.forEach((row, j) => {
    let i = 0
    while (i < row.length) {
      if (row[i] !== ch) { i++; continue }
      let k = i
      while (k < row.length && row[k] === ch) k++
      d += `M${i} ${j}h${k - i}v1h${i - k}z`
      i = k
    }
  })
  return d
}
export default function render() {
  const out = []
  for (const [ch, attrs, cls] of PAINT) {
    const d = runsD(ch)
    if (d) out.push(['path', { d, ...attrs, class: cls }])
  }
  return out
}
