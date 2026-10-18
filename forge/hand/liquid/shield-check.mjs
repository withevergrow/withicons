// forge/hand/liquid/shield-check.mjs — a clear glass shield with a bold coloured-glass tick inlaid in a hairline moat.
// The generator grew the tick from its 2u centreline into a thin groove lined with faint c2 glass, so at 24 and 16px
// the check thinned to a double hairline inside a pale shield. Here the tick is a 3.4u coloured-glass bar with round
// ends and a round elbow, centred in the shield's mass. Same model and paint as the generator (_liquid-core.mjs build);
// only the geometry is drawn here. Motion: the tick is the A part (wm-a) and nods; the shield is wm-k.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, roundStrokeSet, erode, normalize } from '../../kernel/bool.mjs'
import { circle } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)
const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })

// shield silhouette (the generated one's optical size: 2u tube around the skeleton outline)
const SHIELD = 'M11.55 1.55Q12 1.38 12.45 1.55L20.3 4.55Q20.7 4.72 20.7 5.15V11.8C20.7 17 17.3 20.8 12.45 22.55Q12 22.72 11.55 22.55C6.7 20.8 3.3 17 3.3 11.8V5.15Q3.3 4.72 3.7 4.55Z'
// the tick's centreline
const TICK = [[7.9, 12.1], [10.85, 15.05], [16.2, 9.2]]

function skeleton(name) {
  const shield = setOf(ringsOf(SHIELD))
  const tick = unionSets([roundStrokeSet(TICK, 3.4), normalize(circle(TICK[1][0], TICK[1][1], 1.7, 0.15))])
  // the shield's tube runs just inside its edge (so the generator's 2.6u tube lands exactly on the silhouette);
  // the tick's tube is its own centreline (its 2.3u tube sits inside the 3.4u bar), so it is inlaid with a moat
  const kLines = erode(shield, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' }))
  return {
    name, paths: [], cutouts: [],
    fills: [fill(shield), fill(tick)],
    lines: [{ pts: TICK, closed: false, plate: 'A' }, ...kLines],
  }
}

export default function render(icon) {
  return build(skeleton((icon && icon.name) || 'shield-check'))
}
