// forge/hand/pixel/snowflake.mjs: the line drawing's six-armed flake: a vertical arm and two long diagonal arms
// (stepped two-pixel strokes) with forked tips, around a small hexagonal hub with a toned core and a glint.
// The drawing is symmetric: every cell is mirrored left/right and top/bottom.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }

export default function render() {
  const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
  const put = (x, y, c = '#') => {
    for (const [mx, my] of [[x, y], [23 - x, y], [x, 23 - y], [23 - x, 23 - y]]) g[my][mx] = c
  }
  // vertical arm (two columns) and its fork
  for (let y = 2; y <= 11; y++) { put(11, y); put(12, y) }
  put(13, 4); put(14, 3)
  // diagonal arm to the upper right: 2x2 steps rising one row per two columns
  for (const [x, y] of [[14, 9], [16, 8], [18, 7]]) { put(x, y); put(x + 1, y); put(x, y + 1); put(x + 1, y + 1) }
  // its fork: a spur up and a spur out
  put(17, 7); put(17, 6); put(17, 5); put(19, 9); put(20, 9)
  // hexagonal hub
  for (const [y, a, b] of [[10, 10, 13], [11, 9, 14]]) for (let x = a; x <= b; x++) put(x, y)
  put(11, 11, 'w'); g[11][11] = 'w'; g[11][12] = 't'; g[12][11] = 't'; g[12][12] = 's'
  // restore the hub core (put() mirrored the stem over it)
  const core = [[11, 11, 'w'], [12, 11, 't'], [11, 12, 't'], [12, 12, 's']]
  for (const [x, y, c] of core) g[y][x] = c
  const runs = {}
  g.forEach((row, y) => {
    for (let x = 0; x < 24;) {
      const c = row[x]
      if (c === '.') { x++; continue }
      let w = 1
      while (row[x + w] === c) w++
      ;(runs[c] = runs[c] || []).push(`M${x} ${y}h${w}v1h-${w}z`)
      x += w
    }
  })
  const keys = { t: TONE, s: SHADE, '#': { class: 'wm-k' }, w: SHINE }
  return Object.keys(keys).filter((k) => runs[k]).map((k) => ['path', { d: runs[k].join(''), ...keys[k] }])
}
