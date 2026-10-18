// forge/hand/pixel/chinese-knot.mjs: a diamond Chinese knot with a woven lattice, two side loops, a bead and a tassel (as in the line version).
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, R knot red (fill), S lattice + shade (shadow), W shine, Y bead + tassel gold (c2)
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'...........KK...........', // 1
'..........KSSK..........', // 2
'..KKK....KSRRSK....KKK..', // 3
'.KWRRK..KSSRRSSK..KWRRK.', // 4
'.KRKSK.KSRRSSRRSK.KRKSK.', // 5
'.KRKSKKSSRRSSRRSSKKRKSK.', // 6
'.KRKSKKRRSSRRSSRRKKRKSK.', // 7
'.KRKSK.KRSSRRSSRK.KRKSK.', // 8
'.KRSSK..KRRSSRRK..KRSSK.', // 9
'..KKK....KRSSRK....KKK..', // 10
'..........KRRK..........', // 11
'...........KK...........', // 12
'...........KK...........', // 13
'..........KWYK..........', // 14
'..........KYYK..........', // 15
'...........KK...........', // 16
'..........KKKK..........', // 17
'.........KYYYYK.........', // 18
'.........KYSYSK.........', // 19
'.........KYSYSK.........', // 20
'.........KYSYSK.........', // 21
'.........KYSYSK.........', // 22
'.........KKKKKK.........', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [char, attrs, class] in paint order
const PAINT = [
  ["R", { fill: v('fill', '#D62839') }, 'wm-k'],
  ["S", { fill: v('shadow', '#8E1B28') }, 'wm-k'],
  ["Y", { fill: v('c2', '#F5C542') }, 'wm-a'],
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
