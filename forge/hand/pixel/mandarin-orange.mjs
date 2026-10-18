// forge/hand/pixel/mandarin-orange.mjs: a round mandarin with a stem and a leaf, three rind pores and a left highlight (as in the line version).
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, O orange body (fill), S shade (shadow), D pores (shadow), B stem, L leaf (c2), W shine
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'..................KKKK..', // 1
'...............KKKLLLLK.', // 2
'............KKLLLLLLKK..', // 3
'...........KLLLLKKKK....', // 4
'............KKKK........', // 5
'...........BB...........', // 6
'...........BB...........', // 7
'..........KBBK..........', // 8
'.......KKKOSSOKKK.......', // 9
'.....KKOOOOOOOOOOKK.....', // 10
'....KOOOOOOOOOOOOOOK....', // 11
'....KOOWWOOOOOOOOOSK....', // 12
'...KOOWOOOOOOKOOOOOSK...', // 13
'...KOWOOOOOOOOOOOOOSK...', // 14
'...KOWOOOOOOOOOOOOOSK...', // 15
'...KOOOOOOOOOOOOKOSSK...', // 16
'...KOOOOOOOOOOOOOSSSK...', // 17
'....KOOOOOOOKOOOSSSK....', // 18
'....KOOOOOOOOOOSSSSK....', // 19
'.....KKOOOOOOOSSSKK.....', // 20
'.......KKSSSSSSKK.......', // 21
'.........KKKKKK.........', // 22
'........................', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [char, attrs, class] in paint order
const PAINT = [
  ["O", { fill: v('fill', '#F58A1F') }, 'wm-k'],
  ["S", { fill: v('shadow', '#C25A0C') }, 'wm-k'],
  ["B", { fill: v('c4', '#7A4B2A') }, 'wm-k'],
  ["K", {}, 'wm-k'],
  ["L", { fill: v('c2', '#4CAF50') }, 'wm-a'],
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
