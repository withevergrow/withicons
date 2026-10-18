// forge/hand/pixel/api.mjs — upright rounded block with a port node on the left and two on the right (the ports are part A)
// Drawn as a 24x24 cell map (one char per pixel); each layer becomes one path of row runs.
const FILL = 'var(--with-pixel-fill, currentColor)'
const MAP = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '.........######.........',
  '........#wwttts#...AA...',
  '........#wtttts#AAAaaA..',
  '........#ttttts#AAAabA..',
  '...AA...#ttttts#...AA...',
  '..AaaAAA#ttttts#........',
  '..AabAAA#ttttts#........',
  '...AA...#ttttts#...AA...',
  '........#ttttts#AAAaaA..',
  '........#ttttts#AAAabA..',
  '........#ssssss#...AA...',
  '.........######.........',
  '........................',
  '........................',
  '........................',
  '........................',
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
