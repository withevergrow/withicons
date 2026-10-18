// forge/hand/pixel/file-lock.mjs — a dog-eared page with a centred padlock: solid 7x5 body and a 1px arched shackle (part A)
// Drawn as a 24x24 cell map (one char per pixel); each layer becomes one path of row runs.
const FILL = 'var(--with-pixel-fill, currentColor)'
const MAP = [
  '........................',
  '.....#########..........',
  '....#tttttttt##.........',
  '....#twtttttt#s#........',
  '....#twtttttt#ss#.......',
  '....#tttttttt#sss#......',
  '....#tttttttt######.....',
  '....#tttttttttttts#.....',
  '....#tttttttttttts#.....',
  '....#tttttttttttts#.....',
  '....#tttttAAAtttts#.....',
  '....#ttttAtttAttts#.....',
  '....#ttttAtttAttts#.....',
  '....#ttttAtttAttts#.....',
  '....#tttAAAAAAAtts#.....',
  '....#tttAAAaAAAtts#.....',
  '....#tttAAAaAAAtts#.....',
  '....#tttAAAAAAAtts#.....',
  '....#tttAAAAAAAtts#.....',
  '....#tttttttttttts#.....',
  '....#sssssssssssss#.....',
  '.....#############......',
  '........................',
  '........................',
]
// char -> attrs, in paint order
const LAYERS = [["t",{"fill":FILL,"fill-opacity":"0.28"}],["s",{"fill":FILL,"fill-opacity":"0.55"}],["#",{}],["a",{"fill":FILL,"fill-opacity":"0.28","class":"wm-a"}],["b",{"fill":FILL,"fill-opacity":"0.55","class":"wm-a"}],["A",{"class":"wm-a"}],["S",{"class":"wm-s"}],["w",{"fill":"var(--with-pixel-shine, #FFFFFF)","class":"wm-shine"}]]

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
