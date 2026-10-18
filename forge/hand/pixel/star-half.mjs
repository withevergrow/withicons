// forge/hand/pixel/star-half.mjs — a five-point star with exactly the left half filled and the right half left as an outline.
const PAINT = [
  ['o', { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }],
  ['s', { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }],
  ['#', {}],
  ['A', { class: 'wm-a' }],
  ['S', { class: 'wm-s' }],
  ['w', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }],
]
// one 1u cell per character on the 24 grid: # ink outline, o body tone, s shade, w shine, A/S ink parts
function cells(rows, ch) {
  let d = ''
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      if (r[x] !== ch) continue
      const s = x
      while (r[x + 1] === ch) x++
      d += `M${s} ${y}h${x - s + 1}v1h-${x - s + 1}z`
    }
  })
  return d
}

const G = [
  "........................",
  "........................",
  "...........##...........",
  "...........##...........",
  "..........#w.#..........",
  "..........#o.#..........",
  ".........#oo..#.........",
  ".........#oo..#.........",
  "........#ooo...#........",
  ".#######oooo....#######.",
  "..#soooooooo.........#..",
  "...#sooooooo........#...",
  "....#soooooo.......#....",
  ".....#sooooo......#.....",
  "......#ooooo.....#......",
  "......#ooos##....#......",
  ".....#ooos#..#....#.....",
  ".....#oos#....#...#.....",
  "....#oss#......#...#....",
  "....#s##........##.#....",
  "...#s#............#.#...",
  "...##..............##...",
  "........................",
  "........................",
]

export default function render() {
  return PAINT.map(([c, a]) => [c, a, cells(G, c)]).filter(p => p[2]).map(([, a, d]) => ['path', { d, ...a }])
}
