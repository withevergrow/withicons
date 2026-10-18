// forge/hand/pixel/copy-check.mjs: copy with a check, an outlined back sheet showing its L-shaped edge behind a lit front sheet carrying a bold stair-stepped check.
// Map: # ink  + tone  = shade  o shine  A ink / a tone / b shade of the moving part (wm-a)  S ink / s tone / t shade of the badge (wm-s)  O shine (wm-shine)  D ink deco (wm-deco)  . paper
const MAP = [
  '........................',
  '........................',
  '...AAAAAAAAAAAA.........',
  '..AaaaaaaaaaaaaA........',
  '..AaOOaaaaaaaaaA........',
  '..AaOaaaaaaaaaaA........',
  '..AaaaaaaaaaaaaA........',
  '..AaaaaaaaaaaaaA........',
  '..Aaaaaaa############...',
  '..Aaaaaa#+++++++++++=#..',
  '..Aaaaaa#+OO++++++++=#..',
  '..Aaaaaa#+O+++++++++=#..',
  '..Aaaaaa#++++++++SSS=#..',
  '..Aaaaaa#+++++++SSS+=#..',
  '..Aaaaaa#+SSS++SSS++=#..',
  '...AAAAA#++SSSSSS+++=#..',
  '........#+++SSSS++++=#..',
  '........#++++SS+++++=#..',
  '........#+++++++++++=#..',
  '........#+++++++++++=#..',
  '........#============#..',
  '.........############...',
  '........................',
  '........................',
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [
  ['+', TONE, 'wm-k'], ['=', SHADE, 'wm-k'], ['#', {}, 'wm-k'],
  ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'],
  ['s', TONE, 'wm-s'], ['t', SHADE, 'wm-s'], ['S', {}, 'wm-s'],
  ['o', SHINE, 'wm-shine'], ['O', SHINE, 'wm-shine'], ['D', {}, 'wm-deco'],
]
// one path per tone: each horizontal run of a character becomes a 1u-tall rectangle
function paint(rows) {
  const out = []
  for (const [chars, attrs, cls] of LAYERS) {
    let d = ''
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (!chars.includes(row[x])) { x++; continue }
        let n = 1
        while (x + n < row.length && row[x + n] === row[x]) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n
      }
    })
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
export default function render() {
  return paint(MAP)
}
