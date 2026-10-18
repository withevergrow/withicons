// pixel shopping bag: a widening trapezoid bag with a bold two-pixel handle loop (part A) and eyelets.
// Map legend: see LAYERS (each character is one 1u cell on the 24 grid).
const ART = [
  "                        ",
  "                        ",
  "          @@@@          ",
  "         @@@@@@         ",
  "        @@    @@        ",
  "        @@    @@        ",
  "        @@    @@        ",
  "     ##############     ",
  "     #..dd....dd..#     ",
  "     #ww.........s#     ",
  "     #w..........s#     ",
  "     #...........s#     ",
  "     #...........s#     ",
  "     #...........s#     ",
  "     #...........s#     ",
  "    ##...........s##    ",
  "    #.............s#    ",
  "    #.............s#    ",
  "    #.............s#    ",
  "    #.............s#    ",
  "    #ssssssssssssss#    ",
  "     ##############     ",
  "                        ",
  "                        ",
]

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
// one merged h/v path for every cell of the map whose character is in `set` (row runs, stacked runs merged)
function cells(set) {
  const runs = []
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      if (!set.includes(row[x])) { x++; continue }
      let e = x
      while (e < row.length && set.includes(row[e])) e++
      runs.push([x, y, e - x]); x = e
    }
  })
  const done = new Set(), out = []
  runs.forEach((r, i) => {
    if (done.has(i)) return
    let h = 1, j
    while ((j = runs.findIndex((q, k) => !done.has(k) && k !== i && q[0] === r[0] && q[2] === r[2] && q[1] === r[1] + h)) >= 0) { done.add(j); h++ }
    out.push('M' + r[0] + ' ' + r[1] + 'h' + r[2] + 'v' + h + 'h-' + r[2] + 'z')
  })
  return out.join('')
}
const LAYERS = [
  ["@", { class: 'wm-a' }],
  [".", { ...TONE, class: 'wm-k' }],
  ["s", { ...SHADE, class: 'wm-k' }],
  ["#d", { class: 'wm-k' }],
  ["w", { ...SHINE, class: 'wm-shine' }],
]
export default function render() {
  return LAYERS.map(([set, attrs]) => ['path', { d: cells(set), ...attrs }]).filter(n => n[1].d)
}
