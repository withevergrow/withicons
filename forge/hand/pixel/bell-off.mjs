// forge/hand/pixel/bell-off.mjs — the pixel bell with a two-pixel slash (part S) corner to corner and a one-pixel gap on its upper side only; the bell keeps a clean outline on both sides and its clapper (part A).
// Cell map on the 24 grid (1u cells), first row at y=3: # ink, . tone, s shade, w shine; parts as tagged in KEY.
const Y0 = 3
const ROWS = [
  '   SS                   ',
  '    SS   #####          ',
  '     SS #.....#         ',
  '      SS #ww...#        ',
  '      #SS #.....#       ',
  '     #..SS #.....#      ',
  '     #...SS #...s#      ',
  '     #....SS #..s#      ',
  '     #.....SS #.s#      ',
  '     #......SS #s#      ',
  '     #.......SS ##      ',
  '     #........SS #      ',
  '     #.........SS       ',
  '     #..........SS      ',
  '    #.ssssssssssSS      ',
  '   ###############SS    ',
  '        aaaaaa     SS   ',
  '         aaaa       SS  ',
]
const KEY = {'S':['ink','wm-s'],'#':['ink',''],'.':['tone',''],'w':['shine','wm-shine'],'s':['shade',''],'a':['ink','wm-a']}

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
