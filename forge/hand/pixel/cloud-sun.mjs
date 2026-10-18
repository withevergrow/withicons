// forge/hand/pixel/cloud-sun.mjs: a bold ten-pixel sun disc (dark rim, deeper tone than the cloud) with 2px-wide rays at the upper left, partly behind a shaded two-lobe cloud; a one-cell gap keeps sun and cloud apart at 16 px.
// Cell-run sprite: 24 cells per row; # ink, t cloud tone, s cloud shade, d sun tone, w shine, a ink of the moving part (wm-a).
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.2' }
const SUN = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.45' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }

const SUN_ROWS = [
  '........aa..............',
  '.aa.....aa....aa........',
  '.aa.....aa....aa........',
  '........................',
  '.......####.............',
  '......#dddd#............',
  '.....#dddddd#...........',
  '....#dddddddd#..........',
  'aaa.#dddddddd#..........',
  'aaa.#dddddddd#..........',
  '....#dddddddd#..........',
  '.....#dddddd#...........',
  '......#dddd#............',
  '.......####.............',
  '........................',
  '.aa.....................',
  '.aa.....................',
]
const CLOUD_ROWS = [
  '..............####',
  '............##tttt##',
  '...........#ttttttt##',
  '..........#ttttttttt###',
  '.......####ttttttttttt#',
  '......#ttttttttttttttt#',
  '.....#tttttttttttttttt#',
  '.....#tttttttttttttttt#',
  '.....#ssttttttttttttss#',
  '......#ssssssssssssss#',
  '.......###############',
]
const SUN_AT = 0 // sun rows start here
const CLOUD_AT = 11

function grid() {
  const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
  SUN_ROWS.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== '.') g[y + SUN_AT][x] = r[x] })
  const cloud = CLOUD_ROWS.map((r) => r.padEnd(24, '.'))
  cloud.forEach((r, y) => { for (let x = 0; x < 24; x++) if (r[x] !== '.') for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + CLOUD_AT + dy, xx = x + dx; if (g[yy] && g[yy][xx] !== undefined) g[yy][xx] = '.' } })
  cloud.forEach((r, y) => { for (let x = 0; x < 24; x++) if (r[x] !== '.') g[y + CLOUD_AT][x] = r[x] })
  g[6][7] = 'w'; g[6][8] = 'w'; g[7][6] = 'w'
    return g.map((r) => r.join(''))
}

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

export default function render() {
  return sprite(grid(), { t: TONE, s: SHADE, d: SUN, '#': {}, a: { class: 'wm-a' }, w: SHINE })
}
