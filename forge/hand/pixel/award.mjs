// forge/hand/pixel/award.mjs: a round rosette disc with an inner ring (shaded centre, shine) over two distinct ribbon tails in the darker tone, each with a swallow-tail notch.
// Cell-run sprite: each row string is 24 cells; # ink, t tone, s shade, w shine.
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
  '..........####..........',
  '........##ttts##........',
  '.......#wwttttts#.......',
  '.......#wt####ts#.......',
  '......#tt#wwss#ts#......',
  '......#tt#wsss#ts#......',
  '......#tt#ssss#ts#......',
  '......#st#ssss#ts#......',
  '.......#tt####ts#.......',
  '.......#ssttttss#.......',
  '........##ssss##........',
  '.......BRR####RRB.......',
  '......BRRRB..BRRRB......',
  '......BRRRB..BRRRB......',
  '......BRRRB..BRRRB......',
  '......BRRRB..BRRRB......',
  '......BRRRB..BRRRB......',
  '......BRRRB..BRRRB......',
  '......BRBRB..BRBRB......',
  '......BB.BB..BB.BB......',
  '........................',
  '........................',
]

export default function render() {
  return sprite(ROWS, { t: TONE, s: SHADE, '#': {}, w: SHINE, R: { ...SHADE, class: 'wm-a' }, B: { class: 'wm-a' } })
}
