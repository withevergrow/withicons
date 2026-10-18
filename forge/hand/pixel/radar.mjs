// forge/hand/pixel/radar.mjs — round scope: range ring, a lit wedge with its sweep line and a blip, centre dot
// Drawn as a 24x24 cell map (one char per pixel); each layer becomes one path of row runs.
const FILL = 'var(--with-pixel-fill, currentColor)'
const MAP = [
  '........................',
  '........................',
  '.........######.........',
  '.......##Abbbbb##.......',
  '......#ttAbbbbbbb#......',
  '.....#wwttAbbbbbbbAA....',
  '....#wttttAAAwwbbAA#....',
  '...#twtttAAbbwwbAAtt#...',
  '...#ttttAtAbbbbAAttt#...',
  '..#ttttAtttAbbAAAtttt#..',
  '..#ttttAtttAbAAtAtttt#..',
  '..#tttAttttAAAtttAtss#..',
  '..#tttAttttAAttttAtss#..',
  '..#ttttAttttttttAttss#..',
  '..#ttttAttttttttAttss#..',
  '...#ttttAttttttAttts#...',
  '...#tttttAAttAAtttss#...',
  '....#ttttttAAttttss#....',
  '.....#tsttttttttss#.....',
  '......#ssssssssss#......',
  '.......##ssssss##.......',
  '.........######.........',
  '........................',
  '........................',
]
// char -> attrs, in paint order
const LAYERS = [["t",{"fill":FILL,"fill-opacity":"0.28"}],["s",{"fill":FILL,"fill-opacity":"0.55"}],["#",{}],["a",{"fill":FILL,"fill-opacity":"0.28","class":"wm-a"}],["b",{"fill":FILL,"fill-opacity":"0.55","class":"wm-a"}],["A",{"class":"wm-a"}],["w",{"fill":"var(--with-pixel-shine, #FFFFFF)","class":"wm-shine"}]]

function runs(ch) {
  let d = ''
  MAP.forEach((row, y) => {
    let x = 0
    while (x < 24) {
      if (row[x] !== ch) { x++; continue }
      let w = 1
      while (x + w < 24 && row[x + w] === ch) w++
      d += `M${x} ${y}h${w}v1h-${w}z`
      x += w
    }
  })
  return d
}

export default function render() {
  return LAYERS.map(([ch, attrs]) => ['path', { d: runs(ch), ...attrs }]).filter(n => n[1].d)
}
