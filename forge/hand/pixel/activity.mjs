// forge/hand/pixel/activity.mjs: the pulse line as one even two-pixel stroke: flat left tail, steep climb to a peak,
// deep drop to a trough, climb back to a flat right tail (as in the line drawing). Free line work: ink only.
// Each row lists its horizontal runs as [first x, last x].
const ROWS = {
  4: [[9, 10]],
  5: [[8, 10]],
  6: [[8, 10]],
  7: [[7, 8], [10, 11]],
  8: [[7, 8], [10, 11]],
  9: [[6, 7], [10, 11]],
  10: [[6, 7], [11, 12]],
  11: [[2, 6], [11, 12], [18, 21]],
  12: [[2, 6], [11, 12], [17, 21]],
  13: [[12, 13], [16, 17]],
  14: [[12, 13], [16, 17]],
  15: [[12, 13], [15, 16]],
  16: [[13, 16]],
  17: [[13, 15]],
  18: [[13, 15]],
  19: [[14, 15]],
  20: [[14, 15]],
}

export default function render() {
  const d = []
  for (const y of Object.keys(ROWS)) for (const [a, b] of ROWS[y]) d.push(`M${a} ${y}h${b - a + 1}v1h-${b - a + 1}z`)
  return [['path', { d: d.join(''), class: 'wm-k' }]]
}
