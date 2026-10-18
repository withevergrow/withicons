// forge/hand/pixel/flask-conical.mjs: an Erlenmeyer flask, a narrow neck with a lip flaring to a wide triangular base, tinted liquid (wm-a) with a surface line; replaces the stepped tower.
// One character per 1u cell on the 24 grid; each legend char is painted as one merged path.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const INK = {}
const LAYERS = [
  ["#", INK],
  ["o", TONE],
  ["s", SHADE],
  ["L", { fill: 'var(--with-pixel-c2, #4FB3E8)' }, "wm-a"],
  ["M", { fill: 'var(--with-pixel-c2, #4FB3E8)', 'fill-opacity': 0.6 }, "wm-a"],
  ["w", SHINE, "wm-shine"],
]
const MAP = [
  "........................",
  "........................",
  "........########........",
  ".........#oooo#.........",
  ".........#ooos#.........",
  ".........#woos#.........",
  ".........#woos#.........",
  ".........#ooos#.........",
  ".........#ooos#.........",
  ".........#ooos#.........",
  "........#ooooos#........",
  ".......#oooooos#........",
  ".......#ooooooos#.......",
  "......#ooooooooos#......",
  "......############......",
  ".....#LLLLLLLLLLLM#.....",
  "....#LLwLLLLLLLLLM#.....",
  "....#LwLLLLLLLLLLLM#....",
  "...#LLLLLLLLLLLLLLLM#...",
  "...#MMMMMMMMMMMMMMMM#...",
  "....################....",
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
