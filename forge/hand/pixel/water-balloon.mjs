// forge/hand/pixel/water-balloon.mjs: a tied water balloon: a pinched knot on top, a round body with a wavy water line (moving part wm-a) over a shaded water half.
// Map: # ink  + tone  = shade  o shine  w trim/white (shine colour)  A ink / a tone / b shade / W white of the moving part (wm-a)  S ink / s tone / t shade / Z white of the badge (wm-s)  O shine (wm-shine)  . paper
const MAP = [
  '........................',
  '........................',
  '........................',
  '..........####..........',
  '...........##...........',
  '..........####..........',
  '........##++++##........',
  '......##+o+++++=##......',
  '.....#+oo++++++++=#.....',
  '....#+o+++++++++++=#....',
  '....#+o+++++++++++=#....',
  '....#+++++++++++++=#....',
  '....#+++++++++++++=#....',
  '....#++AA++AA++AA++#....',
  '....#AA==AA==AA==AA#....',
  '....#==============#....',
  '....#==============#....',
  '....#==============#....',
  '.....#============#.....',
  '......#==========#......',
  '.......##======##.......',
  '.........######.........',
  '........................',
  '........................',
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['w', SHINE, 'wm-k'], ['#', {}, 'wm-k'],
  ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['W', SHINE, 'wm-a'], ['A', {}, 'wm-a'],
  ['s', TONE, 'wm-s'], ['t', SHADE, 'wm-s'], ['Z', SHINE, 'wm-s'], ['S', {}, 'wm-s'],
  ['o', SHINE, 'wm-shine'], ['O', SHINE, 'wm-shine'],
]
// one path per tone: each horizontal run of a character becomes a 1u-tall rectangle
function paint(rows) {
  const out = []
  for (const [chars, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (!chars.includes(row[x])) { x++; continue }
        let n = 1
        while (x + n < row.length && row[x + n] === row[x]) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n
      }
    })
    if (d) out.push(['path', { d, ...attrs, class: cls }])
  }
  return out
}
export default function render() {
  return paint(MAP)
}
