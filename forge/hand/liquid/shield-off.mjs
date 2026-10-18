// forge/hand/liquid/shield-off.mjs: one whole clear glass shield struck through by a broad accent glass bar that cuts its
// own moat, painted with the style's own glass recipe. The generated slash was a thin bead between two shield halves
// that had drifted apart, so at 16px the cross-out read faint and the shield as two shards.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const SHIELD = 'M12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 Z'
const SLASH = 'M3.4 3.4 L20.6 20.6'
// the bar's body: a capsule 3.1u wide round the slash (wider than the 2.5u bead the generator draws)
const BAR = 'M4.5 2.3 L21.7 19.5 A1.55 1.55 0 0 1 19.5 21.7 L2.3 4.5 A1.55 1.55 0 0 1 4.5 2.3 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'shield-off', paths: [],
    lines: [...lines(SHIELD, 'K'), ...lines(SLASH, 'S')],
    fills: [fill(SHIELD), fill(BAR)],
    cutouts: [],
  }) || []
}
