// forge/hand/pixel/fast-forward.mjs — two identical, aligned pixel triangles (the back one is part A, it chases)
// Drawn as a 24x24 cell map (one char per pixel); each layer becomes one path of row runs.
const FILL = 'var(--with-pixel-fill, currentColor)'
const MAP = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '..AA........##..........',
  '..AaA.......#t#.........',
  '..AwaAA.....#wt##.......',
  '..AwaaaA....#wttt#......',
  '..AaaaaaAA..#ttttt##....',
  '..AaaaaaaaA.#ttttttt#...',
  '..AaaaaaaabA#ttttttts#..',
  '..AaaaaaabA.#tttttts#...',
  '..AaaaabAA..#tttts##....',
  '..AaaabA....#ttts#......',
  '..AabAA.....#ts##.......',
  '..AbA.......#s#.........',
  '..AA........##..........',
  '........................',
  '........................',
  '........................',
  '........................',
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
