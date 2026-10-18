// forge/hand/sticker/align-justify.mjs — the four full-width candy bars on a calm die-cut with a single small sparkle
// tucked low-left; replaces the generated drawing, whose two sparkles pressed into the square sticker's corners and
// crowded the bars.
import { build } from '../../styles/_sticker-core.mjs'
import { sparkleD } from '../../styles/_sticker-path.mjs'

const firstXY = d => d.match(/-?\d*\.?\d+/g).slice(0, 2).map(Number)

export default function render(icon) {
  const nodes = build(icon)
  const out = []
  for (const n of nodes) {
    if (n[1].class !== 'wm-deco') { out.push(n); continue }
    const [x, y] = firstXY(n[1].d)
    // the low-left one stays, smaller and pulled into the corner; the top-right one goes
    if (x < 12 && y > 12) out.push(['path', { ...n[1], d: sparkleD(1.3, 22.55, 0.85, 0.2) }])
  }
  return out
}
