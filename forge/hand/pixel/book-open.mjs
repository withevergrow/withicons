// forge/hand/pixel/book-open.mjs: the open book of the line drawing: two pages whose tops dip toward the centre and
// whose bottoms bulge to a pointed spine, a one-pixel ink outline, tone pages, shaded gutters and rims, a glint on
// each page, and a two-pixel spine down the middle. Built for the left page and mirrored for the right.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }

export default function render() {
  const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
  const put = (x, y, c) => { g[y][x] = c; g[y][23 - x] = c }
  // tone first, then rims, then the outline on top
  for (let y = 5; y <= 18; y++) {
    const b = y === 5 ? 7 : y === 6 ? 9 : 10
    for (let x = 3; x <= b; x++) {
      if (y === 18 && x < 9) continue
      put(x, y, 't')
    }
  }
  // shade: gutter column and bottom row
  for (let y = 7; y <= 18; y++) put(10, y, 's')
  for (let x = 3; x <= 9; x++) put(x, 17, 's')
  // outline of one page
  for (let x = 3; x <= 7; x++) put(x, 4, '#')
  put(8, 5, '#'); put(9, 5, '#'); put(10, 6, '#')
  for (let y = 5; y <= 17; y++) put(2, y, '#')
  for (let x = 3; x <= 8; x++) put(x, 18, '#')
  put(9, 19, '#'); put(10, 19, '#')
  // right page: the shaded rim sits on its outer edge, the gutter shade stays
  for (let y = 6; y <= 16; y++) g[y][20] = 's'
  // glints, one top-left on each page
  for (const [x, y] of [[3, 5], [4, 5], [3, 6], [16, 5], [17, 5], [16, 6]]) g[y][x] = 'w'
  // spine
  for (let y = 7; y <= 20; y++) { g[y][11] = 'a'; g[y][12] = 'a' }
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
  const keys = { t: TONE, s: SHADE, '#': { class: 'wm-k' }, a: { class: 'wm-a' }, w: SHINE }
  return Object.keys(keys).filter((k) => runs[k]).map((k) => ['path', { d: runs[k].join(''), ...keys[k] }])
}
