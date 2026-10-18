// forge/hand/pixel/gem.mjs: gem: a brilliant-cut jewel, flat-topped crown with a girdle line and three facet bands, tapering to a point.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, + body tone (.28), = shade (.55), w/o shine, c cream tone; other
// letters are listed in PAINT. Each tone becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'........................', // 2
'........................', // 3
'......############......', // 4
'.....#++#wwwwww#==#.....', // 5
'....#o+#wwwwwwww#==#....', // 6
'...#oo+#wwwwwwww#===#...', // 7
'..#+++#wwwwwwwwww#===#..', // 8
'..####################..', // 9
'...#++++#wwwwww#====#...', // 10
'....#+++#wwwwww#===#....', // 11
'.....#+++#wwww#===#.....', // 12
'......#++#wwww#==#......', // 13
'.......#++#ww#==#.......', // 14
'........#+#ww#=#........', // 15
'.........#+##=#.........', // 16
'..........####..........', // 17
'...........##...........', // 18
'...........##...........', // 19
'........................', // 20
'........................', // 21
'........................', // 22
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
