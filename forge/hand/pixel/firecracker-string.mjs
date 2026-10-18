// forge/hand/pixel/firecracker-string.mjs: a string of three red firecrackers hanging by fuses from a sagging cord, sparks bursting below the middle one (as in the line version).
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, F fuse, R cracker red (fill), S shade (shadow), Y gold band (c2), W shine, y/o spark gold/orange (c2/c3, deco)
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'.KKKKK............KKKKK.', // 2
'...F..KKK......KKK.F....', // 3
'...F.....KKKKKK....F....', // 4
'...F.......F.......F....', // 5
'..KKKK.....F......KKKK..', // 6
'.KWRRSK...KKKK...KWRRSK.', // 7
'.KYYYYK..KWRRSK..KYYYYK.', // 8
'.KRRRSK..KYYYYK..KRRRSK.', // 9
'.KRRRSK..KRRRSK..KRRRSK.', // 10
'.KRRRSK..KRRRSK..KRRRSK.', // 11
'.KRRRSK..KRRRSK..KRRRSK.', // 12
'.KRRRSK..KRRRSK..KRRRSK.', // 13
'.KYYYYK..KRRRSK..KYYYYK.', // 14
'.KRRRSK..KYYYYK..KRRRSK.', // 15
'..KKKK...KRRRSK...KKKK..', // 16
'..........KKKK..........', // 17
'........................', // 18
'..........yyyy..........', // 19
'.........y.yy.y.........', // 20
'........y..yy..y........', // 21
'.......o...oo...o.......', // 22
'...........oo...........', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [char, attrs, class] in paint order
const PAINT = [
  ["R", { fill: v('fill', '#D62839') }, 'wm-k'],
  ["S", { fill: v('shadow', '#8E1B28') }, 'wm-k'],
  ["Y", { fill: v('c2', '#F5C542') }, 'wm-k'],
  ["K", {}, 'wm-k'],
  ["F", {}, 'wm-k'],
  ["y", { fill: v('c2', '#F5C542') }, 'wm-deco'],
  ["o", { fill: v('c3', '#F58A1F') }, 'wm-deco'],
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
