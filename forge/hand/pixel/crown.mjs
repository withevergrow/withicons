// forge/hand/pixel/crown.mjs: three equal-height points topped with pearl balls, joined to a single body with a band; replaces the generated crown whose base bar floated below.
// Cell-run sprite: each row string is 24 cells; every key maps to one path of horizontal runs.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }
function sprite(rows, keys) {
  const runs = {}
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const c = row[x]
      if (!keys[c]) { x++; continue }
      let w = 1
      while (row[x + w] === c) w++
      ;(runs[c] = runs[c] || []).push(`M${x} ${y}h${w}v1h-${w}z`)
      x += w
    }
  })
  return Object.keys(keys).filter((k) => runs[k]).map((k) => ['path', { d: runs[k].join(''), ...keys[k] }])
}
const ROWS = [
  '........................',
  '........................',
  '........................',
  '........................',
  '...##......##......##...',
  '..#w##....#w##....####..',
  '..####....####....####..',
  '...##......##......##...',
  '..#tt#....#ts#....#ts#..',
  '..#tt#....#ts#....#ts#..',
  '..#ttt#..#ttts#..#tts#..',
  '..#ttt#..#ttts#..#tts#..',
  '..#tttt##ttttts##ttts#..',
  '..#ttttttttttttttttts#..',
  '..#ttttttttttttttttts#..',
  '..#ttttttttttttttttts#..',
  '..####################..',
  '..#ttttttttttttttttts#..',
  '..#ssssssssssssssssss#..',
  '...##################...',
  '........................',
  '........................',
  '........................',
  '........................',
]

export default function render() {
  return sprite(ROWS, { t: TONE, s: SHADE, '#': {}, a: { class: 'wm-a' }, b: { ...TONE, class: 'wm-a' }, c: { ...SHADE, class: 'wm-a' }, w: SHINE })
}
