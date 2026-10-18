// forge/hand/pixel/reindeer.mjs: a front-facing reindeer head (as in the line version): two branching antlers, tan ears, a tapering face, two eyes and a round red nose.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink outline and eyes, F fur (c1), D fur shade, W shine, M ear and muzzle (c2), N nose (c3), A antler (ink).
// Each letter becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'..AA....AA....AA....AA..', // 1
'..AA....AA....AA....AA..', // 2
'...AA...AA....AA...AA...', // 3
'....AA..AA....AA..AA....', // 4
'.....AA.AA....AA.AA.....', // 5
'......AAAA....AAAA......', // 6
'.......AAA....AAA.......', // 7
'........AA....AA........', // 8
'.........######.........', // 9
'....#####WFFFFD#####....', // 10
'...#MMMM#FFFFFD#MMMM#...', // 11
'..#MMMMM#FKFFKD#MMMMM#..', // 12
'..#MMMMM#FKFFKD#MMMMM#..', // 13
'...######FFFFFD######...', // 14
'........#FFFFFD#........', // 15
'.........#FFFD#.........', // 16
'.........#MMMM#.........', // 17
'.........#MNNM#.........', // 18
'.........#NNNN#.........', // 19
'.........#NNNN#.........', // 20
'..........####..........', // 21
'........................', // 22
'........................', // 23
]
const v = (role, hex) => `var(--with-pixel-${role}, ${hex})`
// [chars, attrs, class] in paint order (later paints over earlier)
const PAINT = [
  ['FD', { fill: v('fill', '#8B5A2B') }, 'wm-k'],
  ['D', { fill: v('shadow', '#3F2813'), 'fill-opacity': 0.45 }, 'wm-k'],
  ['M', { fill: v('c2', '#D9B98A') }, 'wm-k'],
  ['#KA', {}, 'wm-k'],
  ['N', { fill: v('c3', '#E0262F') }, 'wm-s'],
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
