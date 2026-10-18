// forge/hand/pixel/ring-box.mjs: ring box: an open ring box, the lid standing open behind with a light lining, the base in front, and a bold 2px ring (wm-a) standing in it with a faceted diamond (wm-s) on top.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, + body tone (.28), = shade (.55), o shine; other
// letters are listed in PAINT. Each tone becomes one merged run path, like the generated sprites.
const SPRITE = [
'........................', // 0
'........................', // 1
'.....##############.....', // 2
'....#==============#....', // 3
'....#=o++GGGGGG+++=#....', // 4
'....#=++GwwpqqqG++=#....', // 5
'....#=+++GwpqqG+++=#....', // 6
'....#=++++GpqG++++=#....', // 7
'....#=++++AAAA++++=#....', // 8
'....#=+++AA++AA+++=#....', // 9
'....#=++AA++++AA++=#....', // 10
'....#=++AA++++AA++=#....', // 11
'....#=++AA++++AA++=#....', // 12
'....#=++AA++++AA++=#....', // 13
'....#=+++AA++AA+++=#....', // 14
'....#=++++AAAA++++=#....', // 15
'...##################...', // 16
'...#o+++++++++++++==#...', // 17
'...#+++++++++++++++=#...', // 18
'...#++++++++++++++==#...', // 19
'...#================#...', // 20
'....################....', // 21
'........................', // 22
'........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
// [cells, attrs, class] in paint order
const PAINT = [['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['#', {}, 'wm-k'], ['A', {}, 'wm-a'], ['G', {}, 'wm-s'], ['w', SHINE, 'wm-s'], ['p', TONE, 'wm-s'], ['q', SHADE, 'wm-s'], ['o', SHINE, 'wm-shine']]

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
