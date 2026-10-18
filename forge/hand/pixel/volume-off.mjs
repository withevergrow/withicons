// forge/hand/pixel/volume-off.mjs — the volume speaker with a balanced 2px x (part S) beside it
// Drawn as a 24x24 cell map (one char per pixel); each layer becomes one path of row runs.
const FILL = 'var(--with-pixel-fill, currentColor)'
const MAP = [
  '........................',
  '........................',
  '........................',
  '.........##.............',
  '........#t#.............',
  '.......#tt#.............',
  '......#ttt#.............',
  '.....#tttt#.............',
  '.####tttts#...SS.....SS.',
  '.#wwttttts#....SS...SS..',
  '.#ttttttts#.....SS.SS...',
  '.#ttttttts#......SSS....',
  '.#ttttttts#......SSS....',
  '.#ttttttts#.....SS.SS...',
  '.#ssstttts#....SS...SS..',
  '.####sttts#...SS.....SS.',
  '.....#stts#.............',
  '......#sts#.............',
  '.......#ss#.............',
  '........#s#.............',
  '.........##.............',
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
