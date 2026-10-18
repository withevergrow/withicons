// compass: a clean pixel dial (1px ink rim, soft tone face, west and east tick marks) round an upright needle (wm-a):
// a stepped 2:1 diamond whose north half is solid ink and whose south half is an ink outline filled with a lighter
// tone, so north and south read at once. Hand-drawn 24-grid sprite; wm-a is the needle.
import { useGrid, grid, ix, gridD } from '../../styles/_pixel-core.mjs'

const inDisc = (i, j) => (i + 0.5 - 12) ** 2 + (j + 0.5 - 12) ** 2 <= 100
// needle half-widths in cells from the centre row outward (centre columns 11 and 12): 2:1 steps, 16 rows tall
const HALF = [4, 4, 3, 3, 2, 2, 1, 1]
const needleAt = (i, j) => {
  if (i < 0 || j < 0 || i > 23 || j > 23) return false
  const m = j <= 11 ? 11 - j : j - 12
  if (m >= HALF.length) return false
  return i >= 12 - HALF[m] && i <= 11 + HALF[m]
}

export default function render() {
  useGrid(24)
  const L = { ink: grid(), tone: grid(), pInk: grid(), pShade: grid() }
  const set = (g, i, j) => { g[ix(i, j)] = 1 }
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) {
    if (!inDisc(i, j)) continue
    const edge = !(inDisc(i + 1, j) && inDisc(i - 1, j) && inDisc(i, j + 1) && inDisc(i, j - 1) &&
      inDisc(i + 1, j + 1) && inDisc(i - 1, j - 1) && inDisc(i + 1, j - 1) && inDisc(i - 1, j + 1))
    set(edge ? L.ink : L.tone, i, j)
  }
  // east and west tick marks, one cell clear of the rim
  for (const [i, j] of [[4, 11], [4, 12], [19, 11], [19, 12]]) { L.tone[ix(i, j)] = 0; set(L.ink, i, j) }
  // needle: north half solid, south half outlined over a mid-tone fill
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) {
    if (!needleAt(i, j)) continue
    L.tone[ix(i, j)] = 0
    const edge = !(needleAt(i + 1, j) && needleAt(i - 1, j) && needleAt(i, j + 1) && needleAt(i, j - 1))
    if (j <= 11 || edge) set(L.pInk, i, j)
    else set(L.pShade, i, j)
  }
  const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
  const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.6 }
  const out = []
  const push = (g, attrs, cls) => { const d = gridD(g); if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }]) }
  push(L.tone, TONE); push(L.ink, {})
  push(L.pShade, SHADE, 'wm-a'); push(L.pInk, {}, 'wm-a')
  return out
}
