// forge/hand/pixel/burger.mjs — pixel burger: a solid rounded bun dome, a wavy lettuce band and a solid patty (the moving middle), then a solid bottom-bun slab (the generated bun was hollow and the layers thin lines).

const ROWS = [
  '........................',
  '........................',
  '........................',
  '........########........',
  '......##oooooooo##......',
  '.....#o**oooooooox#.....',
  '....#o*ooooooooooxx#....',
  '...#oooooooooooooxxx#...',
  '...#xxxxxxxxxxxxxxxx#...',
  '...##################...',
  '..XXXXXXXXXXXXXXXXXXXX..',
  '..XX.XX.XX.XX.XX.XX.XX..',
  '...AAAAAAAAAAAAAAAAAA...',
  '..AAAAAAAAAAAAAAAAAAAA..',
  '...AAAAAAAAAAAAAAAAAA...',
  '........................',
  '...##################...',
  '...#ooooooooooooooox#...',
  '...#xxxxxxxxxxxxxxxx#...',
  '....################....',
  '........................',
  '........................',
  '........................',
  '........................',
]

const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
// one paint per grid character, emitted in this order (back to front)
const PAINT = [
  ['o', { fill: F, 'fill-opacity': '0.28' }],
  ['x', { fill: F, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['s', { fill: F, 'fill-opacity': '0.28', class: 'wm-s' }],
  ['S', { class: 'wm-s' }],
  ['a', { fill: F, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['X', { fill: F, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['A', { class: 'wm-a' }],
  ['*', { fill: W, class: 'wm-shine' }],
]

function cells(rows) {
  const out = []
  for (const [ch, attrs] of PAINT) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== ch) continue
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}

export default function render() {
  return cells(ROWS)
}
