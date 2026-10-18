// Pixel / square-code: hand-drawn 24-grid sprite (forge/HAND.md).
// a rounded square with two separate pixel chevrons < and > (2px brush) and a gap between them, as in line; body tone with shade rim and a shine.
// Map key: # ink, + tone, = shade, o shine; a/A/B = wm-a ink/tone/shade; s/S/Z = wm-s ink/tone/shade.
const MAP = [
  '........................',
  '........................',
  '........................',
  '....################....',
  '...#++++++++++++++++#...',
  '...#+o+++++++++++++=#...',
  '...#+o+++++++++++++=#...',
  '...#+++++++++++++++=#...',
  '...#+++++++++++++++=#...',
  '...#+++++aa++aa++++=#...',
  '...#++++aa++++aa+++=#...',
  '...#+++aa++++++aa++=#...',
  '...#+++aa++++++aa++=#...',
  '...#++++aa++++aa+++=#...',
  '...#+++++aa++aa++++=#...',
  '...#+++++++++++++++=#...',
  '...#+++++++++++++++=#...',
  '...#+++++++++++++++=#...',
  '...#+++++++++++++++=#...',
  '...#+===============#...',
  '....################....',
  '........................',
  '........................',
  '........................',
]

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['#', {}, 'wm-k'],
  ['A', TONE, 'wm-a'], ['B', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['S', TONE, 'wm-s'], ['Z', SHADE, 'wm-s'], ['s', {}, 'wm-s'],
  ['o', SHINE, 'wm-shine'],
]

// one path per layer: each row's runs of that character as 1-unit-tall rectangles
function runs(ch) {
  let d = ''
  MAP.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ch) continue
      let n = 1
      while (row[x + n] === ch) n++
      d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z'
      x += n - 1
    }
  })
  return d
}

export default function render() {
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const d = runs(ch)
    if (d) out.push(['path', { d, ...attrs, class: cls }])
  }
  return out
}
