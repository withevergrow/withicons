// forge/hand/pixel/paw-print.mjs: a rounded main pad with a notched base and four separate oval toes (wm-a), two high and two on the sides; replaces the tiny spread toes.
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
  ["W", SHINE, "wm-a"],
]
const MAP = [
  "........................",
  "........................",
  "......AAA......AAA......",
  ".....AWpqA....AWpqA.....",
  ".....AppqA....AppqA.....",
  ".....AqqqA....AqqqA.....",
  "......AAA......AAA......",
  "........................",
  "..AAA..............AAA..",
  ".AWpqA............AWpqA.",
  ".AppqA............AppqA.",
  ".AqqqA............AqqqA.",
  "..AAA.....####.....AAA..",
  "........##oooo##........",
  ".......#wwooooos#.......",
  "......#ooooooooos#......",
  ".....#owooooooooos#.....",
  ".....#owooooooooos#.....",
  ".....#ooooooooooos#.....",
  "......#ooo####ooo#......",
  ".......###....###.......",
  "........................",
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
