// forge/hand/pixel/video-call.mjs — camera body with a solid head-and-shoulders caller inside and a solid lens wedge.
// Legend: # ink, . body tone, s shade, w shine; capitals/lowercase A a S are the moving part (wm-a).
const ART = [
  '                        ',
  '                        ',
  '                        ',
  '                        ',
  '  #############         ',
  ' #ww..........s#        ',
  ' #w...........s#        ',
  ' #.....###....s#    ##  ',
  ' #....#####...s#   ###  ',
  ' #....#####...s# #####  ',
  ' #....#####...s#######  ',
  ' #.....###....s#######  ',
  ' #............s#######  ',
  ' #....#####...s#######  ',
  ' #...#######..s# #####  ',
  ' #..#########.s#   ###  ',
  ' #..#########.s#    ##  ',
  ' #..#########.s#        ',
  ' #ss#########ss#        ',
  '  #############         ',
  '                        ',
  '                        ',
  '                        ',
  '                        ',
]

const FILL = 'var(--with-pixel-fill, currentColor)'
const LAYERS = [
  ['.', { fill: FILL, 'fill-opacity': '0.28' }],
  ['s', { fill: FILL, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['a', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['S', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['A', { class: 'wm-a' }],
  ['w', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }],
]

// one horizontal run per row segment, cell-aligned on the 24 grid
function runs(ch) {
  let d = ''
  ART.forEach((row, y) => {
    if (row.length !== 24) throw new Error('row ' + y + ' is ' + row.length + ' wide')
    for (let x = 0; x < 24;) {
      if (row[x] !== ch) { x++; continue }
      let n = 1
      while (x + n < 24 && row[x + n] === ch) n++
      d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z'
      x += n
    }
  })
  return d
}

export default function render() {
  const out = []
  for (const [ch, attrs] of LAYERS) {
    const d = runs(ch)
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
