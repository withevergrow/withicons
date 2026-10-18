// forge/hand/pixel/route.mjs — a smooth stepped S route in the two-pixel brush (part A) between two identical round pins: bottom-left start and top-right end, the drawing symmetric by half-turn.
// Cell map on the 24 grid (1u cells), first row at y=2: # ink, . tone, s shade, w shine; parts as tagged in KEY.
const Y0 = 2
const ROWS = [
  '                 ####   ',
  '                #w...#  ',
  '        aaaaaaaa#...s#  ',
  '      aaaaaaaaaa#...s#  ',
  '     aaa        #ssss#  ',
  '     aa          ####   ',
  '     aa                 ',
  '     aaa                ',
  '      aaa               ',
  '       aaaaaaaaa        ',
  '        aaaaaaaaa       ',
  '               aaa      ',
  '                aaa     ',
  '                 aa     ',
  '   ####          aa     ',
  '  #w...#        aaa     ',
  '  #...s#aaaaaaaaaa      ',
  '  #...s#aaaaaaaa        ',
  '  #ssss#                ',
  '   ####                 ',
]
const KEY = {'#':['ink','wm-k'],'.':['tone',''],'s':['shade',''],'w':['shine','wm-shine'],'a':['ink','wm-a']}

// one merged h/v path per tone, one row-run per cell strip (the generated pixel style's construction)
const FILL = 'var(--with-pixel-fill, currentColor)'
const PAINT = {
  tone: { fill: FILL, 'fill-opacity': '0.28' },
  shade: { fill: FILL, 'fill-opacity': '0.55' },
  ink: {},
  shine: { fill: 'var(--with-pixel-shine, #FFFFFF)' },
}
function sprite(rows, y0, key) {
  const runs = new Map()
  rows.forEach((row, k) => {
    let i = 0
    while (i < row.length) {
      const c = row[i]
      if (!key[c]) { i++; continue }
      let n = 1
      while (row[i + n] === c) n++
      const id = key[c].join('|')
      if (!runs.has(id)) runs.set(id, [])
      runs.get(id).push(`M${i} ${y0 + k}h${n}v1h-${n}z`)
      i += n
    }
  })
  const order = ['tone', 'shade', 'ink', 'shine']
  return [...runs.entries()]
    .sort((a, b) => order.indexOf(a[0].split('|')[0]) - order.indexOf(b[0].split('|')[0]))
    .map(([id, ds]) => {
      const [paint, cls] = id.split('|')
      const attrs = { d: ds.join(''), ...PAINT[paint] }
      if (cls) attrs.class = cls
      return ['path', attrs]
    })
}

export default function render() {
  return sprite(ROWS, Y0, KEY)
}
