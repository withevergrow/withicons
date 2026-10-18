// forge/hand/pixel/thermometer.mjs: a vertical glass tube with a round bulb, a shaded mercury column filling the bulb and the lower tube, a shine stripe, and three 2px tick marks on the right (the moving part, wm-a).
// Cell-run sprite: each row string is 24 cells; # ink, t tone, s shade, m mercury (shade), w shine, a ink of the moving part (wm-a).
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
  '........##..............',
  '.......#ws#.............',
  '.......#ws#...aaaaaa....',
  '.......#ws#...aaaaaa....',
  '.......#ts#.............',
  '.......#ts#.............',
  '.......#mm#...aaaa......',
  '.......#mm#...aaaa......',
  '.......#mm#.............',
  '.......#mm#.............',
  '.......#mm#...aaaaaa....',
  '......#mmmm#..aaaaaa....',
  '.....#mmmmmm#...........',
  '....#mmmmmmmm#..........',
  '....#mwwmmmmm#..........',
  '....#mwmmmmmm#..........',
  '....#mmmmmmmm#..........',
  '.....#mmmmmm#...........',
  '......#mmmm#............',
  '.......####.............',
  '........................',
  '........................',
]

export default function render() {
  return sprite(ROWS, { t: TONE, s: SHADE, m: SHADE, '#': {}, a: { class: 'wm-a' }, w: SHINE })
}
