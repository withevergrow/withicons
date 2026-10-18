// forge/hand/glass/superscript.mjs — the glass x with a luminous accent "2" raised beside it. Generated Glass drew the
// small 2 as the same pale frosted rod as the x, so it faded to nothing on white at 16px; here the 2 is glass's
// luminous accent glass (the badge recipe: accent body, colour echo behind, a light rim), so the power reads first.
// The 2 is the moving part (wm-a: it lifts, per forge/motion/superscript.json).
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'

export default function render(icon) {
  // the x stays glass's frosted rods; the 2 (plate A in the skeleton) is painted as a luminous signal
  const asSignal = o => (o.plate === 'A' ? { ...o, plate: 'S' } : o)
  const base = { ...icon, paths: icon.paths.map(asSignal), lines: icon.lines.map(asSignal) }
  const L = softLayers(base)
  if (!L) return null
  const { defs, out } = softPaint(L, icon.name)
  // the badge layers carry wm-s in the style; here the 2 is the part the motion spec lifts (parts.A)
  const moved = out.map(([tag, a]) => [tag, a.class === 'wm-s' ? { ...a, class: 'wm-a' } : a])
  return [['defs', {}, defs], ...moved]
}
