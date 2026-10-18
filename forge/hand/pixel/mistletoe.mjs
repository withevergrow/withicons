// forge/hand/pixel/mistletoe.mjs: a mistletoe sprig: two clear oval green leaves splayed up from a short stem, with a bold pair of white berries (wm-s) at the junction.
// Map: # ink  G leaf green  H leaf shadow (midrib)  S ink / Z white / t shade of the berry pair (wm-s)  . paper
const MAP = [
  '........................',
  '........................',
  '........................',
  '...####..........####...',
  '..#GHGG##......##GGHG#..',
  '..#GHHGGG#....#GGGHHG#..',
  '..#GGHHGGG#..#GGGHHGG#..',
  '...#GGHHGG#..#GGHHGG#...',
  '...#GGGHHGG##GGHHGGG#...',
  '....#GGGHHG##GHHGGG#....',
  '.....##GGHH##HHGG##.....',
  '.......SSSS..SSSS.......',
  '......SZZZZSSZZZZS......',
  '......SZZZtSSZZZtS......',
  '......SZZttSSZZttS......',
  '......SZtttSSZtttS......',
  '.......SSSS..SSSS.......',
  '...........##...........',
  '...........##...........',
  '...........##...........',
  '...........##...........',
  '...........##...........',
  '........................',
  '........................',
]
const GREEN = { fill: 'var(--with-pixel-fill, #2E7D32)' }
const VEIN = { fill: 'var(--with-pixel-shadow, #153816)' }
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['G', GREEN, 'wm-k'], ['H', VEIN, 'wm-k'], ['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['w', SHINE, 'wm-k'], ['#', {}, 'wm-k'],
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
