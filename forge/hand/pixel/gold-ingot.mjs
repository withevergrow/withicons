// forge/hand/pixel/gold-ingot.mjs: one yuan-bao gold ingot (sycee): a boat-shaped bar with upturned ends, a domed centre, a flat top face and a front that tapers to the base.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink outline, Y top face (c2), G front face (fill c1), D front shade, W shine.
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'........................', // 2
'........................', // 3
'........................', // 4
'........................', // 5
'.........######.........', // 6
'........#YWYYYY#........', // 7
'..#####.#YYYYYY#.#####..', // 8
'.#YYYYY##YYYYYY##YYYYY#.', // 9
'#YWYYYYYYYYYYYYYYYYYYYY#', // 10
'#GWGGGGGGGGGGGGGGGGGGDD#', // 11
'.#GGGGGGGGGGGGGGGGGGDD#.', // 12
'..#GGGGGGGGGGGGGGGGDD#..', // 13
'...#GGGGGGGGGGGGGGDD#...', // 14
'....#GGGGGGGGGGGGDD#....', // 15
'.....#GGGGGGGGGGDD#.....', // 16
'......############......', // 17
'........................', // 18
'........................', // 19
'........................', // 20
'........................', // 21
'........................', // 22
'........................', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [chars, attrs, class] in paint order (later paints over earlier)
const PAINT = [
  ['GD', { fill: v('fill', '#E8B21E') }, 'wm-k'],
  ['D', { fill: v('shadow', '#7A5200'), 'fill-opacity': 0.5 }, 'wm-k'],
  ['Y', { fill: v('c2', '#FFD75E') }, 'wm-k'],
  ['#', {}, 'wm-k'],
  ['W', { fill: v('shine', '#FFFFFF') }, 'wm-shine'],
]
function runsD(chs) {
  let d = ''
  SPRITE.forEach((row, j) => {
    let i = 0
    while (i < row.length) {
      if (!chs.includes(row[i])) { i++; continue }
      let k = i
      while (k < row.length && chs.includes(row[k])) k++
      d += `M${i} ${j}h${k - i}v1h${i - k}z`
      i = k
    }
  })
  return d
}
export default function render() {
  const out = []
  for (const [chs, attrs, cls] of PAINT) {
    const d = runsD(chs)
    if (d) out.push(['path', { d, ...attrs, class: cls }])
  }
  return out
}
