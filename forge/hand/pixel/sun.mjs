// forge/hand/pixel/sun.mjs: solid 10px shaded disc with ink rim and eight rays (2px dashes on the axes, 2x2 blocks on the diagonals); the generated rays were 1px specks around a faint core.
// Legend: # rim ink, o body tone, s shade tone, * shine, R ray ink (wm-a).
const ART = [
  '........................',
  '...........RR...........',
  '...........RR...........',
  '...........RR...........',
  '....RR.....RR.....RR....',
  '....RR............RR....',
  '........................',
  '..........####..........',
  '.........#oooo#.........',
  '........#**oooo#........',
  '.......#o**ooooo#.......',
  '.RRRR..#oooooooo#..RRRR.',
  '.RRRR..#ooooooos#..RRRR.',
  '.......#ooooooss#.......',
  '........#ooooss#........',
  '.........#ooss#.........',
  '..........####..........',
  '........................',
  '....RR............RR....',
  '....RR.....RR.....RR....',
  '...........RR...........',
  '...........RR...........',
  '...........RR...........',
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
    ...node('o', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-k' }),
    ...node('s', { fill: FILL, 'fill-opacity': '0.85', class: 'wm-k' }),
    ...node('#', { class: 'wm-k' }),
    ...node('R', { class: 'wm-a' }),
    ...node('*', { fill: SHINE, class: 'wm-shine' }),
  ]
}
