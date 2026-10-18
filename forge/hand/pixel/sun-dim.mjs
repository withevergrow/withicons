// forge/hand/pixel/sun-dim.mjs — hand-drawn 24x24 pixel art: a solid shaded disc with eight short, evenly spaced solid rays (3x2 on the axes, 2x2 on the diagonals); replaces faint scattered dots.
// Legend: # ink outline, o body tone, s shade tone, * shine, A/a/b/+ moving part (wm-a) ink/body/shade/shine, R ray ink (wm-a).
const ART = [
  '........................',
  '........................',
  '........................',
  '..........RRR...........',
  '....RR....RRR....RR.....',
  '....RR...........RR.....',
  '........................',
  '.........#####..........',
  '........#ooooo#.........',
  '.......#o**oooo#........',
  '...RR..#o*ooooo#..RR....',
  '...RR..#oooooos#..RR....',
  '...RR..#oooooss#..RR....',
  '.......#oooosss#........',
  '........#oosss#.........',
  '.........#####..........',
  '........................',
  '....RR...........RR.....',
  '....RR....RRR....RR.....',
  '..........RRR...........',
  '........................',
  '........................',
  '........................',
  '........................',
]

const FILL = 'var(--with-pixel-fill, currentColor)'
const SHINE = 'var(--with-pixel-shine, #FFFFFF)'
// one path per tone: each row's runs of a character become h/v cell rectangles
function cells(ch) {
  let d = ''
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!ch.includes(row[x])) continue
      let w = 1
      while (x + w < row.length && ch.includes(row[x + w])) w++
      d += 'M' + x + ' ' + y + 'h' + w + 'v1h-' + w + 'z'
      x += w - 1
    }
  })
  return d
}
const node = (ch, attrs) => { const d = cells(ch); return d ? [['path', { d, ...attrs }]] : [] }

export default function render() {
  return [
    ...node('o', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-k' }),
    ...node('s', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-k' }),
    ...node('#', { class: 'wm-k' }),
    ...node('a', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-a' }),
    ...node('b', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-a' }),
    ...node('AR', { class: 'wm-a' }),
    ...node('*', { fill: SHINE, class: 'wm-shine' }),
    ...node('+', { fill: SHINE, class: 'wm-shine wm-a' }),
  ]
}
