// forge/hand/pixel/scissors.mjs: hand-drawn 24-grid sprite. Two finger rings at the left and two bold blades that
// cross at a pivot and open to the right. The upper ring drives the lower blade (body), the lower ring drives the
// upper blade (moving part, wm-a).
// Map: # ink  + tone  = shade  o shine  @ ink of the moving part (wm-a)  a tone of the moving part  . paper
const MAP = [
  '........................',
  '...###..................',
  '..#####.................',
  '.##...##................',
  '.##...##................',
  '.##...##................',
  '..######............@@@.',
  '...######........@@@a@@.',
  '.......###....@@@@aa@@..',
  '........###.@@@@aa@@....',
  '.........###@@@a@@......',
  '..........#@@@@@........',
  '.........o@@@@##........',
  '.........@@@@##+##......',
  '........@@@.####++##....',
  '.......@@@....####++##..',
  '...@@@@@@........###+##.',
  '..@@@@@@............###.',
  '.@@...@@................',
  '.@@...@@................',
  '.@@...@@................',
  '..@@@@@.................',
  '...@@@..................',
  '........................',
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
function runs(chars) {
  let d = ''
  MAP.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!chars.includes(row[x])) continue
      let w = 1
      while (chars.includes(row[x + w])) w++
      d += `M${x} ${y}h${w}v1h-${w}z`
      x += w - 1
    }
  })
  return d
}
export default function render() {
  const out = []
  const add = (chars, attrs) => { const d = runs(chars); if (d) out.push(['path', { d, ...attrs }]) }
  add('+', TONE)
  add('=', SHADE)
  add('#', {})
  add('a', { ...TONE, class: 'wm-a' })
  add('@', { class: 'wm-a' })
  add('o', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' })
  return out
}
