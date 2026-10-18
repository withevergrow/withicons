// forge/hand/pixel/badge-check.mjs: hand-drawn 24-grid sprite, an 8-fold symmetric stepped-scallop rosette with a bold 3-px-stair (2px-thick) solid ink check on a pale fill.
// Map: # ink  + tone  = shade  o shine  @ ink of the moving part (wm-a)  . paper
const MAP = [
  '........................',
  '........................',
  '.........######.........',
  '.....##.#++++++#.##.....',
  '....#++#++++++++#++#....',
  '...#++o+++++++++++++#...',
  '...#+oo+++++++++++++#...',
  '....#++++++++++++++#....',
  '...#+++++++++++@@@+=#...',
  '..#+++++++++++@@@+++=#..',
  '..#++++++++++@@@++++=#..',
  '..#+++@@@+++@@@+++++=#..',
  '..#++++@@@+@@@++++++=#..',
  '..#+++++@@@@@+++++++=#..',
  '..#++++++@@@++++++++=#..',
  '...#+++++++++++++++=#...',
  '....#+++++++++++++=#....',
  '...#+++++++++++++++=#...',
  '...#++++++++++++=++=#...',
  '....#++#=++++++=#==#....',
  '.....##.#======#.##.....',
  '.........######.........',
  '........................',
  '........................',
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.18 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.4 }
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
  add('o', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' })
  return out
}
