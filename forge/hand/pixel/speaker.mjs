// forge/hand/pixel/speaker.mjs — a tall cabinet with a small tweeter ring above and a larger woofer below (outer ring, cone and a solid dust cap, part A); no notch on top.
// Cell map on the 24 grid (1u cells), first row at y=2: # ink, . tone, s shade, w shine; parts as tagged in KEY.
const Y0 = 2
const ROWS = [
  '      ############      ',
  '     #ww.........s#     ',
  '     #w..........s#     ',
  '     #.....##....s#     ',
  '     #....#xx#...s#     ',
  '     #....#xx#...s#     ',
  '     #.....##....s#     ',
  '     #...........s#     ',
  '     #....aaaa...s#     ',
  '     #...acccca..s#     ',
  '     #..acccccca.s#     ',
  '     #.acccaacccas#     ',
  '     #.accawaaccas#     ',
  '     #.accaaaaccas#     ',
  '     #.acccaacccas#     ',
  '     #..acccccca.s#     ',
  '     #...acccca..s#     ',
  '     #....aaaa...s#     ',
  '     #ssssssssssss#     ',
  '      ############      ',
]
const KEY = {'#':['ink','wm-k'],'.':['tone',''],'s':['shade',''],'x':['shade',''],'w':['shine','wm-shine'],'a':['ink','wm-a'],'c':['shade','wm-a']}

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
