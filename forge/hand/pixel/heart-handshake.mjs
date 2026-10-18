// forge/hand/pixel/heart-handshake.mjs: an even light-toned heart whose lower half is a handshake: ink cuffs, a white hand with thumb mark, a darker hand with finger steps, and the hands' V forming the heart tip.
// Map legend: '#' ink, '+' tone, '=' shade, 'w' shine, '.' paper
const MAP = [
  '........................',
  '........................',
  '........................',
  '....#####......#####....',
  '...#+++++#....#+++++#...',
  '..#+++++++#..#+++++++#..',
  '.#+++ww++++##+++++++++#.',
  '.#++w+++++++++++++++++#.',
  '.###++++++++++++++++###.',
  '.######################.',
  '.###======#.##......###.',
  '.###=====#..........###.',
  '.###====#...##......###.',
  '.###====####==#.....###.',
  '.###====#======####.###.',
  '.###===#============###.',
  '.###==#===#=========###.',
  '.....##==#===#===##.....',
  '.......##===#==##.......',
  '.........###=##.........',
  '...........##...........',
  '........................',
  '........................',
  '........................',
]

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE], ['=', SHADE], ['#', {}],
  ['A', {}, 'wm-a'],
  ['S', {}, 'wm-s'],
  ['w', SHINE, 'wm-shine'],
]
function paint(rows) {
  const out = []
  for (const [chars, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (!chars.includes(row[x])) { x++; continue }
        let n = 1
        while (x + n < row.length && row[x + n] === row[x]) n++
        d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z'
        x += n
      }
    })
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
export default function render() {
  return paint(MAP)
}
