// forge/hand/pixel/graduation-cap.mjs: a flat diamond mortarboard sitting on a separate cap band, with a one-cell tassel cord ending in a two-cell knot.
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
  '..........####..........',
  '........##tttt##........',
  '......##wwtttttt##......',
  '....##wttttttttttt##....',
  '..##tttttttttttttttt##..',
  '..##ttttttttttttttss##..',
  '....##ttttttttttss##.a..',
  '......##ttttttss##...a..',
  '......#t##ttss##s#...a..',
  '......#ttt####tss#...a..',
  '......#tttttttsss#...a..',
  '......#tttttttsss#...a..',
  '......#tttttttsss#..aa..',
  '......#ssssssssss#..aa..',
  '.......##########...aa..',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
]

export default function render() {
  return sprite(ROWS, { t: TONE, s: SHADE, '#': {}, a: { class: 'wm-a' }, w: SHINE })
}
