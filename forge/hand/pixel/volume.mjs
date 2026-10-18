// forge/hand/pixel/volume.mjs — a big shaded speaker with two evenly spaced 2px sound waves (part A)
// Drawn as a 24x24 cell map (one char per pixel); each layer becomes one path of row runs.
const FILL = 'var(--with-pixel-fill, currentColor)'
const MAP = [
  '........................',
  '........................',
  '........................',
  '.........##.....AA......',
  '........#t#......AA.....',
  '.......#tt#.......AA....',
  '......#ttt#........AA...',
  '.....#tttt#..AA....AA...',
  '.####tttts#...AA....AA..',
  '.#wwttttts#....AA...AA..',
  '.#ttttttts#....AA...AA..',
  '.#ttttttts#....AA...AA..',
  '.#ttttttts#....AA...AA..',
  '.#ttttttts#....AA...AA..',
  '.#ssstttts#....AA...AA..',
  '.####sttts#...AA....AA..',
  '.....#stts#..AA....AA...',
  '......#sts#........AA...',
  '.......#ss#.......AA....',
  '........#s#......AA.....',
  '.........##.....AA......',
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
