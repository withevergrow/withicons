// forge/hand/gothic/captions.mjs: a stone screen frame glazed in deep sapphire carrying two bold gilt "C" letters
// (the CC subtitle mark of the new skeleton), so it reads as closed captions instead of a card with text bars.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const C = x => g.stroke(`M${x + 4.1} 8.6 H${x + 2.6} A2.6 2.6 0 0 0 ${x} 11.2 V12.8 A2.6 2.6 0 0 0 ${x + 2.6} 15.4 H${x + 4.1}`, 2)

export default function render() {
  return paint([
    ...g.pane(g.rr(2.4, 4, 21.6, 20, 2.2), 'c2', { frame: 1.6, tracery: 'none', glass: { dark: 0.46, deep: 0.2, glow: 0.12 } }),
    g.gilt(g.union(C(5.9), C(13.5)), { plate: 'A', thin: true, outline: 0.4 }),
  ])
}
