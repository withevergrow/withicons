// forge/hand/pixel/salad.mjs: a footed bowl heaped with a light and a dark lettuce leaf (wm-a), a halved egg with a yolk and a tomato, in colour; replaces the grey lump.
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
  ["G", { fill: 'var(--with-pixel-c4, #A8D26B)' }, "wm-a"],
  ["H", { fill: 'var(--with-pixel-c2, #4E9F3D)' }, "wm-a"],
  ["A", INK, "wm-a"],
  ["K", { fill: 'var(--with-pixel-c2, #4E9F3D)' }],
  ["e", { fill: 'var(--with-pixel-tint, #FFFFFF)' }],
  ["Y", { fill: 'var(--with-pixel-accent, #F2A93B)' }],
  ["T", { fill: 'var(--with-pixel-c3, #E2522F)' }],
]
const MAP = [
  "........................",
  "...............AAAA.....",
  "..............AHHHA.....",
  "..AAAA.......AHHHHA.....",
  ".AGHGGA...###AHHHHA.....",
  ".AGGHGGA.#eee#HHH####...",
  "..AGGHGG#eeeee#H#TKKT#..",
  "..AGGGHG#eYYee#A#TTTT#..",
  "..AGGGGH#eYYee#.#wTTT#..",
  "...AGGGG#eeeee#.#wTTT#..",
  "....AGGG#eeeee#.#TTTT#..",
  ".....AGGG#eee#..#TTTT#..",
  ".######################.",
  "...#owooooooooooooos#...",
  "...#woooooooooooooos#...",
  "....#ooooooooooooos#....",
  ".....#ooooooooooos#.....",
  "......#ssssssssss#......",
  ".......##########.......",
  ".........#oooo#.........",
  ".........######.........",
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
