// forge/hand/pixel/external-link.mjs: hand-drawn 24-grid sprite, a 2u stepped outline box open at the top right,
// and a 2u diagonal arrow with an L-shaped head leaving through the gap (clear of the box on every side).
// Map: # box ink  @ arrow ink (wm-a)  . paper
const MAP = [
  '........................',
  '........................',
  '........................',
  '.............@@@@@@@@...',
  '.............@@@@@@@@...',
  '....######.......@@@@...',
  '...#######......@@.@@...',
  '...##..........@@..@@...',
  '...##.........@@...@@...',
  '...##........@@....@@...',
  '...##.......@@.....@@...',
  '...##......@@...........',
  '...##.....@@............',
  '...##....@@.......##....',
  '...##.............##....',
  '...##.............##....',
  '...##.............##....',
  '...##.............##....',
  '...##.............##....',
  '...################.....',
  '....##############......',
  '........................',
  '........................',
  '........................',
]
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
  return [
    ['path', { d: runs('#') }],
    ['path', { d: runs('@'), class: 'wm-a' }],
  ]
}
