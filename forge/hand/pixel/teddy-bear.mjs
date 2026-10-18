// forge/hand/pixel/teddy-bear.mjs: a teddy bear with round ears and a cream snout holding a red heart in both arms (as in the line version).
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, B fur (fill), S fur shade (shadow), M muzzle cream (c3), D dark eyes/nose/inner ear (shadow role, stays dark on light and dark), R heart red (c2), W shine
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'.....KKK........KKK.....', // 2
'....KBDBKKKKKKKKBDBK....', // 3
'....KBDKKBBBBBSKKDBK....', // 4
'....KKKWBBBBBBBBSKKK....', // 5
'......KBBBBBBBBBSK......', // 6
'......KBWDBBBBWDBK......', // 7
'......KBDDBBBBDDBK......', // 8
'......KBBBMMMMBBSK......', // 9
'......KBBMMDDMMBSK......', // 10
'.......KKBMMMMBKK.......', // 11
'.......KKKKKKKKKK.......', // 12
'......KBBBBBBSSBSK......', // 13
'.....KKBBkkBSkkSSKK.....', // 14
'.....KKBkWrkkrrkSKK.....', // 15
'.....KBKkrrrrrrkKSK.....', // 16
'.....KBBBkrrrrkBBSK.....', // 17
'.....KBBBkkrrkkBBSK.....', // 18
'.....KBBBBkkkkBBBSK.....', // 19
'......KSBBBBBBBBSK......', // 20
'.......KSSSSSSSSK.......', // 21
'........KKKKKKKK........', // 22
'........................', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [char, attrs, class] in paint order
const PAINT = [
  ["B", { fill: v('fill', '#C98A4B') }, 'wm-k'],
  ["S", { fill: v('shadow', '#8A5A2B') }, 'wm-k'],
  ["D", { fill: v('shadow', '#8A5A2B') }, 'wm-k'],
  ["M", { fill: v('c3', '#F3DDB8') }, 'wm-k'],
  ["r", { fill: v('c2', '#E63B5A') }, 'wm-a'],
  ["k", {}, 'wm-a'],
  ["K", {}, 'wm-k'],
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
