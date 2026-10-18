// forge/hand/coquette/brain-circuit.mjs — a full-height blush half-brain with two rose folds and just two gold traces
// ending in pearl nodes, so the brain outline leads at 16px; the generated drawing hid the lobes under a bow and ran
// three thin traces to three small nodes that crowded the outline.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const HALF = 'M12.4 5.3 A3.1 3.1 0 0 0 6.5 5.7 A3.6 3.6 0 0 0 3.2 12 A3.6 3.6 0 0 0 5.8 18.4 A3.4 3.4 0 0 0 12.4 19.4 Z'

export default function render() {
  return paint([[
    k.wire('M11.6 8.6 H16 M11.6 15.4 H16', 1.5),
    k.body(k.path(HALF), { detail: k.tube('M6.6 6.4 C7.5 7.1 8 8 8 9.3 M4.3 12.2 C5.9 12.3 7.1 13 7.6 14.6', 0.95) }),
    k.pearl(17.7, 8.6, 1.75, { plate: 'A' }),
    k.pearl(17.7, 15.4, 1.75, { plate: 'A' }),
  ]].flat(Infinity).filter(Boolean))
}
