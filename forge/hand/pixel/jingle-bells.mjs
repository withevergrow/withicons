// forge/hand/pixel/jingle-bells.mjs — two round bells leaning in under a bow, each with a shaded lip rim, a highlight and a clapper ball
// Cell-aligned pixel art on the 24 grid (one row of ART per pixel row, cell i spans [i, i + 1]).
const ART = [
  '                        ',
  '                        ',
  '                        ',
  '      SS       SS       ',
  '     SssS     SssS      ',
  '     SsssSSSSSsssS      ',
  '      SSSSSSSSSSS       ',
  '        S     S         ',
  '     ####     ####      ',
  '    #w..:#   #.w.:#     ',
  '   #ww..:#   #w...:#    ',
  '   #....:#   #....:#    ',
  '  #.....:#   #.....:#   ',
  '  #.....:#   #.....:#   ',
  ' #......:#   #......:#  ',
  ' #......:#   #......:#  ',
  '#::::::::#   #::::::::# ',
  '##########   ########## ',
  '#::::::::#   #::::::::# ',
  ' ########     ########  ',
  '    AA           AA     ',
  '    AA           AA     ',
  '                        ',
  '                        ',
]
// legend: # ink . tone : shade w shine | A/a/b part (ink/tone/shade, wm-a) | S/s/t badge (wm-s) | D/d deco (wm-deco)
const FILL = 'var(--with-pixel-fill, currentColor)'
const LAYERS = [
  ['.', { fill: FILL, 'fill-opacity': '0.28' }], [':', { fill: FILL, 'fill-opacity': '0.55' }], ['#', {}],
  ['s', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-s' }], ['t', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-s' }], ['S', { class: 'wm-s' }],
  ['a', { fill: FILL, 'fill-opacity': '0.28', class: 'wm-a' }], ['b', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-a' }], ['A', { class: 'wm-a' }],
  ['d', { fill: FILL, 'fill-opacity': '0.55', class: 'wm-deco' }], ['D', { class: 'wm-deco' }],
  ['w', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }],
]
function cells(ch) {
  let d = ''
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ch) continue
      let n = 1
      while (row[x + n] === ch) n++
      d += `M${x} ${y}h${n}v1h-${n}z`
      x += n - 1
    }
  })
  return d
}
export default function render() {
  const out = []
  for (const [ch, attrs] of LAYERS) { const d = cells(ch); if (d) out.push(['path', { d, ...attrs }]) }
  return out
}
