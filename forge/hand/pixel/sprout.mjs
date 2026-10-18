// forge/hand/pixel/sprout.mjs: two rounded leaves, a lower left and a higher right one, on a short stem over a flat soil bar (wm-a); replaces the diagonal blade.
// One character per 1u cell on the 24 grid; each legend char is painted as one merged path.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const INK = {}
const LAYERS = [
  ["#", INK],
  ["o", TONE],
  ["s", SHADE],
  ["w", SHINE, "wm-shine"],
  ["A", INK, "wm-a"],
  ["p", TONE, "wm-a"],
  ["q", SHADE, "wm-a"],
]
const MAP = [
  "........................",
  "........................",
  "...................##...",
  "...............####o#...",
  "..............#oooos#...",
  "..#####......#owooos#...",
  "..#ooos##....#owooos#...",
  "...#wooos#..#ooooos#....",
  "...#woooos#.#oooos#.....",
  "...#ooooos#.#ssss#......",
  "....#ooooos######.......",
  "....#ssooos##...........",
  ".....##ssss##...........",
  ".......######...........",
  "...........##...........",
  "...........##...........",
  "...........##...........",
  "...........##...........",
  "...........##...........",
  "...........##...........",
  "......AAAAAAAAAAAA......",
  "......AAAAAAAAAAAA......",
  "........................",
  "........................",
]
function paint(rows) {
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (row[x] !== ch) { x++; continue }
        let n = 1
        while (x + n < row.length && row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
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
