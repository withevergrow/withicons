// forge/hand/pixel/christmas-tree.mjs: a single-triangle fir (as in the line version) with a gold star, a gold garland swoosh, red baubles and a trunk.
// Hand-drawn 24x24 pixel sprite (1u cells, symmetric about x=12). Legend: # ink outline, O star outline, Y star gold, y garland gold,
// G needle green (c1), S needle shade, R bauble red (c3), B trunk (c4), W shine. Each letter becomes one merged run path.
const SPRITE = [
'...........OO...........', // 0
'..........OYYO..........', // 1
'........OOOYYOOO........', // 2
'........OWYYYYYO........', // 3
'.........OYYYYO.........', // 4
'........OYYOOYYO........', // 5
'........OOO..OOO........', // 6
'...........##...........', // 7
'..........#GG#..........', // 8
'..........#GG#..........', // 9
'.........#GGGS#.........', // 10
'.........#WGRS#.........', // 11
'........#GGGGGS#........', // 12
'.......#GGGGGGGS#.......', // 13
'.......#WGRGGGGS#.......', // 14
'......#GGGGGGGyyS#......', // 15
'.....#GyyGGGGyyGSS#.....', // 16
'.....#WGGyyyyGGGSS#.....', // 17
'....#GGGGGGGGGGGGSS#....', // 18
'....#GGRGGGGGGRGGSS#....', // 19
'...##################...', // 20
'..........#BB#..........', // 21
'..........#BB#..........', // 22
'..........####..........', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [char, attrs, class] in paint order
const PAINT = [
  ['G', { fill: v('fill', '#2E7D32') }, 'wm-k'],
  ['S', { fill: v('shadow', '#153816') }, 'wm-k'],
  ['y', { fill: v('c2', '#F5C542') }, 'wm-k'],
  ['R', { fill: v('c3', '#D62839') }, 'wm-k'],
  ['B', { fill: v('c4', '#7A4B2A') }, 'wm-k'],
  ['#', {}, 'wm-k'],
  ['Y', { fill: v('c2', '#F5C542') }, 'wm-a'],
  ['O', {}, 'wm-a'],
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
