// forge/hand/pixel/chart-bar.mjs: three equal five-pixel bars (short, tall, middle, as in the line drawing) with
// crisp outlines, cut top corners and the style's tone/shade/glint, standing over a separate two-pixel baseline.
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

const BARS = [[4, 11], [10, 3], [16, 7]] // [left x, top row]; every bar ends on row 18

export default function render() {
  const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
  for (const [x, top] of BARS) {
    for (let y = top; y <= 18; y++) {
      let row
      if (y === top) row = '.###.'
      else if (y === 18) row = '#####'
      else if (y === 17) row = '#sss#'
      else if (y === top + 1) row = '#wts#'
      else row = '#tts#'
      for (let i = 0; i < 5; i++) if (row[i] !== '.') g[y][x + i] = row[i]
    }
  }
  for (let y = 20; y <= 21; y++) for (let x = 2; x <= 21; x++) g[y][x] = 'a'
  return sprite(g.map((r) => r.join('')), { t: TONE, s: SHADE, '#': {}, a: { class: 'wm-a' }, w: SHINE })
}
