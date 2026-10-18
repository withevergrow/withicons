// forge/hand/pixel/lucky-coin.mjs: lucky coin: round coin with a thin lit rim, a plain face and one crisp square hole in a 1px ink frame.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, + body tone (.28), = shade (.55), w light, o shine; other
// letters are listed in PAINT. Each tone becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'...........##...........', // 1
'........###ww###........', // 2
'......##wwwwwwww##......', // 3
'.....#wwwww++wwwww#.....', // 4
'....#www++++++++ww=#....', // 5
'...#www+o++++++++===#...', // 6
'...#ww++++++++++++==#...', // 7
'..#ww++++++++++++++==#..', // 8
'..#ww++++######++++==#..', // 9
'..#ww++++#....#++++==#..', // 10
'.#ww+++++#....#+++++==#.', // 11
'.#ww+++++#....#+++++==#.', // 12
'..#ww++++#....#++++==#..', // 13
'..#ww++++######++++==#..', // 14
'..#ww++++++++++++++==#..', // 15
'...#ww++++++++++++==#...', // 16
'...#ww=++++++++++===#...', // 17
'....#===++++++++===#....', // 18
'.....#=====++=====#.....', // 19
'......##========##......', // 20
'........###==###........', // 21
'...........##...........', // 22
'........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
// [cells, attrs, class] in paint order
const PAINT = [['w', SHINE, 'wm-k'], ['=', SHADE, 'wm-k'], ['+', TONE, 'wm-k'], ['#', {}, 'wm-k'], ['o', SHINE, 'wm-shine']]

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
