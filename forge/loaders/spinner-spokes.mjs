// Twelve rounded spokes round a hub; brightness runs clockwise: each spoke lights quickly and then dims slowly, so a
// bright head travels with a long fading tail behind it. Opacity only, so the spokes never wobble out of place.
// Opposite spokes are parallel, so each orientation is drawn once, centred on the hub, and placed twice by copies
// (half the file, and styles that centre what they draw place it right too).
import { line, stroke, polar, E } from './_kit.mjs'

const N = 12, H = N / 2, R0 = 5.5, R1 = 9, HALF = (R1 - R0) / 2, MID = (R0 + R1) / 2
const keys = [[0, { o: 0.16, e: E.out }], [0.07, { o: 1, e: 'cubic-bezier(.2,.6,.4,1)' }], [1, { o: 0.16 }]]
export default {
  name: 'spinner-spokes', title: 'Spoke spinner', group: 'common',
  description: 'Twelve rounded spokes round a hub: a bright spoke runs clockwise and a long tail of dimming spokes follows it.',
  intent: 'the classic system activity indicator, crisp and quiet',
  aliases: ['spoke-spinner', 'activity-spokes', 'radial-lines-spinner', 'system-spinner', 'petal-spinner'],
  tags: ['loading', 'spinner', 'busy', 'wait', 'system'], synonyms: ['loading', 'please wait', 'busy', 'working', 'activity'],
  duration: 1,
  parts: Array.from({ length: H }, (_, i) => {
    const a = i * 360 / N, [x0, y0] = polar(12, 12, HALF, a + 180), [x1, y1] = polar(12, 12, HALF, a)
    const [mx, my] = polar(0, 0, MID, a)
    return {
      skel: stroke(line(x0, y0, x1, y1)), motion: { keys },
      copies: [{ x: mx, y: my, lag: i / N }, { x: -mx, y: -my, lag: (i + H) / N }],
    }
  }),
}
