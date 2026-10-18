// forge/hand/pixel/text-cursor-input.mjs: hand-drawn 24-grid sprite, one wide outlined input box on paper with a short text tick, crossed by a single I-beam cursor with paper gaps where it passes the frame.
// Map: # ink  + tone  = shade  o shine  @ ink of the moving part (wm-a)  . paper
const MAP = [
  '........................',
  '........................',
  '........................',
  '........................',
  '.............@@@@@@.....',
  '...............@@.......',
  '...............@@.......',
  '..############.@@.####..',
  '..#oooo........@@...=#..',
  '..#o...........@@...=#..',
  '..#............@@...=#..',
  '..#..######....@@...=#..',
  '..#..######....@@...=#..',
  '..#............@@...=#..',
  '..#............@@...=#..',
  '..#===========.@@.===#..',
  '..############.@@.####..',
  '...............@@.......',
  '...............@@.......',
  '.............@@@@@@.....',
  '........................',
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
  add('#', { class: 'wm-k' })
  add('@', { class: 'wm-a' })
  add('o', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' })
  return out
}
