// forge/hand/pixel/dragon-head.mjs: a front-facing festival dragon head (as in the line version): branching gold antlers, red head with a forehead pearl, angry cream brows, glinting eyes, a snout with nostrils, fangs, a cream beard and gold whiskers curling out at the cheeks.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink outline, eyes and mouth (K), R head (c1), D head shade, C cream (tint), P pearl (accent), N nostril, W fang and glint, A antler and G whisker (c2).
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'..AA...AA......AA...AA..', // 1
'..AA...AA......AA...AA..', // 2
'...AA..AA......AA..AA...', // 3
'....AA.AA......AA.AA....', // 4
'.....AAAA......AAAA.....', // 5
'......AAA......AAA......', // 6
'.......AA......AA.......', // 7
'.......##########.......', // 8
'.....##RRRRRRRRRD##.....', // 9
'....#RRRRRRPPRRRRRD#....', // 10
'....#RCCCRRRRRRCCCD#....', // 11
'....#RRRRCCCCCCRRRD#....', // 12
'....#RWKRRRRRRRRKWD#....', // 13
'....#RKKRRRRRRRRKKD#....', // 14
'GGGG#RRRRCCCCCCRRRD#GGGG', // 15
'G...#RRRRCNCCNCRRRD#...G', // 16
'GG...#RRRCCCCCCRRD#...GG', // 17
'.....#KKKKKKKKKKKK#.....', // 18
'......#WRRWRRWRRW#......', // 19
'.......#RRRRRRRD#.......', // 20
'........#CCCCCC#........', // 21
'.........#CCCC#.........', // 22
'..........####..........', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [chars, attrs, class] in paint order (later paints over earlier)
const PAINT = [
  ['RD', { fill: v('fill', '#D7261E') }, 'wm-k'],
  ['D', { fill: v('shadow', '#5C0A08'), 'fill-opacity': 0.45 }, 'wm-k'],
  ['C', { fill: v('tint', '#FFF1CC') }, 'wm-k'],
  ['N', { fill: v('shadow', '#5C0A08') }, 'wm-k'],
  ['P', { fill: v('accent', '#F4C542') }, 'wm-s'],
  ['#K', {}, 'wm-k'],
  ['AG', { fill: v('c2', '#F4C542') }, 'wm-a'],
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
