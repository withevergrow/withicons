// forge/hand/gothic/audio-lines.mjs — the line design's five plain round-ended vertical bars (short, tall, tallest, tall,
// short) as ruby glass in thin stone frames, the two outer ones gold glass, on a thin gilt rule; the generated drawing
// carved them into coffin- or dagger-shaped spikes with ornate caps that blurred at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const bar = (cx, y0, y1) => g.rr(cx - 1.7, y0, cx + 1.7, y1, 1.7)
const F = { frame: 0.7, tracery: 'none' }

export default function render(icon) {
  const parts = [
    ...g.pane(bar(3.6, 9.2, 14.8), 'c3', { ...F, plate: 'A' }),
    ...g.pane(bar(7.8, 5.6, 18.4), 'c1', F),
    ...g.pane(bar(12, 2.4, 21.6), 'c1', F),
    ...g.pane(bar(16.2, 6.6, 17.4), 'c1', F),
    ...g.pane(bar(20.4, 9.2, 14.8), 'c3', { ...F, plate: 'A' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
