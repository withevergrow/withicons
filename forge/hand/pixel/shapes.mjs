// pixel shapes: rounded square, ring-shaded disc and a tall stepped triangle, balanced like the line drawing.
// Cell-aligned 24x24 sprite: '#'-type keys are 1px ink outline / 2px detail, then body .28, shade .55, one shine group.
const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
const ART = [
  '........................',
  '........................',
  '........................',
  '....######.....%%%%.....',
  '...#wwbbbs#...%cccd%....',
  '...#wbbbbs#..%cxxccd%...',
  '...#bbbbbs#..%xccccd%...',
  '...#bbbbbs#..%ccccdd%...',
  '...#bbbbbs#..%cccddd%...',
  '...#ssssss#...%cddd%....',
  '....######.....%%%%.....',
  '........................',
  '...........%%...........',
  '..........%xc%..........',
  '..........%cd%..........',
  '.........%cccd%.........',
  '.........%cccd%.........',
  '........%cccccd%........',
  '........%cccccd%........',
  '.......%cccccccd%.......',
  '.......%dddddddd%.......',
  '........%%%%%%%%........',
  '........................',
  '........................',
]
// paint order = legend order
const LEGEND = [
  ['b', { fill: F, 'fill-opacity': '0.28', class: 'wm-k' }],
  ['s', { fill: F, 'fill-opacity': '0.55', class: 'wm-k' }],
  ['#', { class: 'wm-k' }],
  ['c', { fill: F, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['d', { fill: F, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['%', { class: 'wm-a' }],
  ['w', { fill: W, class: 'wm-shine' }],
  ['x', { fill: W, class: 'wm-shine' }],
]
function cells(ch) {
  let d = ''
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ch) continue
      let e = x
      while (row[e + 1] === ch) e++
      const w = e - x + 1
      d += `M${x} ${y}h${w}v1h-${w}z`
      x = e
    }
  })
  return d
}
export default function render() {
  return LEGEND.map(([ch, attrs]) => ['path', { d: cells(ch), ...attrs }]).filter((n) => n[1].d)
}
