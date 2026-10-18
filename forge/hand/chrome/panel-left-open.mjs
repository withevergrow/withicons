// forge/hand/chrome/panel-left-open.mjs — a polished chrome window frame with its solid left sidebar fused to it, the
// main pane left open and a big gunmetal chevron pointing right (sliding the sidebar open) filling most of it. The
// generated drawing gave the pane a narrow opening and floated a small, thin, low-contrast chevron in it, lost and
// hard to tell from close at 16px; here the sidebar is narrower and the chevron's direction reads at a glance.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const TILE = 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const DIVIDE = 'M8.5 3V21'
const SIDEBAR = 'M5 3H8.5V21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
// two strokes side by side make the chevron a bolder bar than the default gunmetal tube
const CHEVRON = 'M12.3 8.25L16.05 12L12.3 15.75M13.1 8.25L16.85 12L13.1 15.75'

function skeleton(name) {
  const paths = [{ id: 'p0', d: TILE, plate: 'K' }, { id: 'p1', d: DIVIDE, plate: 'K' }, { id: 'p2', d: CHEVRON, plate: 'A' }]
    .map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(SIDEBAR)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'panel-left-open'
  return emit(layers(model(skeleton(name))), name, 0)
}
