// forge/hand/pixel/holly.mjs: two splayed serrated holly leaves under a cluster of three red berries (as in the line version).
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, G leaf green (fill), S leaf shade + vein (shadow), R berry red (c2), W shine; berries are the moving part
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'...........kk...........', // 1
'..........kWRk..........', // 2
'..........kRRk..........', // 3
'.........kkkkkk.........', // 4
'........kWRkkWRk........', // 5
'........kRRkkRRk........', // 6
'.........kk..kk.........', // 7
'...........KK...........', // 8
'...........KK...........', // 9
'.........KKKKKK.........', // 10
'.......KKSGKKGSKK.......', // 11
'.....KKGSGGKKGGSGKK.....', // 12
'......KGSGSKKSGSGK......', // 13
'...KKKGSGSK..KSGSGKKK...', // 14
'....KGSGGK....KGGSGK....', // 15
'..KKGSGGSKK..KKSGGSGKK..', // 16
'...KGSGSK......KSGSGK...', // 17
'.KKGSGSKKK....KKKSGSGKK.', // 18
'..KSSSK..........KSSSK..', // 19
'.KSKKK............KKKSK.', // 20
'.KK..................KK.', // 21
'........................', // 22
'........................', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [char, attrs, class] in paint order
const PAINT = [
  ["G", { fill: v('fill', '#2E7D32') }, 'wm-k'],
  ["S", { fill: v('shadow', '#153816') }, 'wm-k'],
  ["K", {}, 'wm-k'],
  ["R", { fill: v('c2', '#D62839') }, 'wm-a'],
  ["k", {}, 'wm-a'],
  ["W", { fill: v('shine', '#FFFFFF') }, 'wm-shine'],
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
