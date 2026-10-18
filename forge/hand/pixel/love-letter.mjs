// forge/hand/pixel/love-letter.mjs: love letter: an open envelope with a stepped V flap, a dark inside and a light front pocket, and a white heart card rising from it.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, + body tone (.28), = shade (.55), o shine; other
// letters are listed in PAINT. Each tone becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'......CCCCCCCCCCCC......', // 2
'.....CwwwwwwwwwwwwC.....', // 3
'.....CwwwwwwwwwwwwC.....', // 4
'.....CwwwHHwwHHwwwC.....', // 5
'.....CwwHpqHHqqHwwC.....', // 6
'.....CwwHqqqqqqHwwC.....', // 7
'.....CwwwHqqqqHwwwC.....', // 8
'.....CwwwwHqqHwwwwC.....', // 9
'.....CwwwwwHHwwwwwC.....', // 10
'...###wwwwwwwwwwww###...', // 11
'..##=CwwwwwwwwwwwwC=##..', // 12
'..#+################+#..', // 13
'..#o++#==========#++=#..', // 14
'..#++++##======##+++=#..', // 15
'..#++++++##==##+++++=#..', // 16
'..#+++++++++##++++++=#..', // 17
'..#+++++++++++++++++=#..', // 18
'..#+++++++++++++++++=#..', // 19
'..#==================#..', // 20
'...##################...', // 21
'........................', // 22
'........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
// [cells, attrs, class] in paint order
const PAINT = [['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['#', {}, 'wm-k'], ['C', {}, 'wm-a'], ['w', SHINE, 'wm-a'], ['p', TONE, 'wm-s'], ['q', SHADE, 'wm-s'], ['H', {}, 'wm-s'], ['o', SHINE, 'wm-shine']]

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
