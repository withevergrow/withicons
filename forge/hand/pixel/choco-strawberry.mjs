// forge/hand/pixel/choco-strawberry.mjs: chocolate-dipped strawberry: a heart-shaped berry with seeds and a leaf crown with a stem, its lower half dipped in dark chocolate under a wavy ink dip edge.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, + body tone (.28), = shade (.55), o shine; other
// letters are listed in PAINT. Each tone becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'..............S.........', // 2
'.............SS.........', // 3
'............SS..........', // 4
'.......SS...SS..SS......', // 5
'......SffS.SffSSffS.....', // 6
'.....SffffSfffffffS.....', // 7
'......SSSSSSSSSSSS......', // 8
'.....#o+++++++++++#.....', // 9
'....#o++=+++=+++=++#....', // 10
'....#+++++++++=++++#....', // 11
'....#+=+++=++++++++#....', // 12
'....###+++#####+++##....', // 13
'....#c##+##ccc##+###....', // 14
'.....#c###coccc####.....', // 15
'......#cccccccccc#......', // 16
'.......#cccccccc#.......', // 17
'........#cccccc#........', // 18
'.........#cccc#.........', // 19
'..........#cc#..........', // 20
'...........##...........', // 21
'........................', // 22
'........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
// [cells, attrs, class] in paint order
const PAINT = [['+', TONE, 'wm-k'], ['c', SHADE, 'wm-k'], ['=', SHADE, 'wm-k'], ['#', {}, 'wm-k'], ['f', SHADE, 'wm-a'], ['S', {}, 'wm-a'], ['o', SHINE, 'wm-shine']]

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
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
