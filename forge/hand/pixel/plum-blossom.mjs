// forge/hand/pixel/plum-blossom.mjs: plum blossom: a five-petal rounded blossom with a ringed centre and petal notches on a diagonal stem, with one small leaf at the upper left.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, + body tone (.28), = shade (.55), o shine; other
// letters are listed in PAINT. Each tone becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'...........###..###.....', // 2
'..........#o++##+++#....', // 3
'.........#o+++##++=+#...', // 4
'.........#++++##++=+#...', // 5
'..........##++CC++##....', // 6
'.........#++#CqqC#++#...', // 7
'..SS.....#+++CqqC+=+#...', // 8
'..SfSS...#++++CC++=+#...', // 9
'..SfffS...#++#++#=+#....', // 10
'...SffS...#+#+++=#+#....', // 11
'....SSS....##+++=##.....', // 12
'.....S.....S#++==#......', // 13
'......S...SS.####.......', // 14
'.......S.SS.............', // 15
'........SS..............', // 16
'.......SS...............', // 17
'......SS................', // 18
'.....SS.................', // 19
'....SS..................', // 20
'...SS...................', // 21
'........................', // 22
'........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
// [cells, attrs, class] in paint order
const PAINT = [['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['#', {}, 'wm-k'], ['f', SHADE, 'wm-a'], ['S', {}, 'wm-a'], ['q', SHADE, 'wm-s'], ['C', {}, 'wm-s'], ['o', SHINE, 'wm-shine']]

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
