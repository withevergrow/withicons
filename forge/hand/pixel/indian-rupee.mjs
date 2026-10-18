// forge/hand/pixel/indian-rupee.mjs: solid ink rupee glyph on the grid: two full-width bars, a rounded bowl on the right and a stepped diagonal leg, as in line.
// Map: # ink  + tone  = shade  o shine  @ ink of the moving part (wm-a)  % badge ink (wm-s)  . paper
const MAP = [
  '........................',
  '........................',
  '........................',
  '.....##############.....',
  '.....##############.....',
  '.............###........',
  '..............###.......',
  '.....@@@@@@@@@@@@@@.....',
  '.....@@@@@@@@@@@@@@.....',
  '...............##.......',
  '...............##.......',
  '..............##........',
  '......#########.........',
  '......#######...........',
  '.......###..............',
  '........###.............',
  '.........###............',
  '..........###...........',
  '...........###..........',
  '............###.........',
  '.............###........',
  '........................',
  '........................',
  '........................',
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
// one path per tone: each horizontal run of a character becomes a 1u-tall rectangle
function runs(ch) {
  let d = ''
  MAP.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ch) continue
      let w = 1
      while (row[x + w] === ch) w++
      d += `M${x} ${y}h${w}v1h-${w}z`
      x += w - 1
    }
  })
  return d
}
export default function render() {
  const out = []
  const add = (ch, attrs) => { const d = runs(ch); if (d) out.push(['path', { d, ...attrs }]) }
  add('+', TONE)
  add('=', SHADE)
  add('#', {})
  add('@', { class: 'wm-a' })
  add('%', { class: 'wm-s' })
  add('o', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' })
  return out
}
