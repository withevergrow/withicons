// forge/hand/pixel/palm-tree.mjs: a palm on a sand mound: curved banded trunk, a crown of five green fronds with dark ribs (wm-a) and coconuts, in colour.
// Legend: G frond (c2), H frond rib (shadow), T trunk (c3), t trunk band (shadow), C coconut (c3 on ink), S sand (c4), d sand shade. Ink outline is added round every filled cell.
const ART = [
  '........................', // 0
  '.............GG.........', // 1
  '...GGGG.....GGGG..GGG...', // 2
  '..GGGGGGG..GGHGG.GGGGGG.', // 3
  '.GGHHGGGGGGGGHGGGGGGGGG.', // 4
  '.GGGGHHHGGGGHHGGGGHHHGG.', // 5
  '.GG..GGGHHGHHHHHGHHGGGG.', // 6
  '.G....GGGGHCCHHHHHG..GG.', // 7
  '.......G..HCCCCH........', // 8
  '..........TTCCTT........', // 9
  '..........TTTTT.........', // 10
  '..........ttTTT.........', // 11
  '..........TTTTt.........', // 12
  '...........TTTT.........', // 13
  '...........tTTT.........', // 14
  '...........TTTt.........', // 15
  '..........TTTT..........', // 16
  '..........tTTT..........', // 17
  '.........TTTTt..........', // 18
  '.........TTTT...........', // 19
  '......SSSSSSSSSSSS......', // 20
  '....SSSSSSSSSSSSSSSS....', // 21
  '....dddddddddddddddd....', // 22
  '........................', // 23
]
const g = ART.map(r => r.split(''))
const solid = (x, y) => x >= 0 && y >= 0 && x < 24 && y < 24 && g[y][x] !== '.' && g[y][x] !== '#'
const ink = []
for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
  if (g[y][x] === '.' && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) ink.push([x, y])
}
for (const [x, y] of ink) g[y][x] = '#'

const LAYERS = [
  ['S', { fill: 'var(--with-pixel-c4, #F2D49A)' }],
  ['d', { fill: 'var(--with-pixel-c4, #F2D49A)', 'fill-opacity': '0.6' }],
  ['T', { fill: 'var(--with-pixel-c3, #A86E3E)' }],
  ['t', { fill: 'var(--with-pixel-shadow, #6B4220)' }],
  ['#', {}],
  ['C', {}],
  ['G', { fill: 'var(--with-pixel-c2, #4E9F3D)', class: 'wm-a' }],
  ['H', { fill: 'var(--with-pixel-shadow, #2F6B2A)', class: 'wm-a' }],
]

export default function render() {
  const out = []
  for (const [ch, attrs] of LAYERS) {
    let d = ''
    g.forEach((row, y) => {
      for (let x = 0; x < 24; x++) {
        if (row[x] !== ch) continue
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
