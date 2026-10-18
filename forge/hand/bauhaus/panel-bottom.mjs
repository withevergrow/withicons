// forge/hand/bauhaus/panel-bottom.mjs — the framed square of the line version: a blue rounded frame holding a cream
// top pane and a red bottom pane (the lower third), each its own flat block with a blue seam between them; no sun
// or landscape, only geometry, so it reads as a window with a docked panel.
import { rr } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c3', rr(3, 3, 21, 21, 3.5)],
    ['tint', rr(5.25, 5.25, 18.75, 13.25, 1.5)],
    ['c1', rr(5.25, 15.25, 18.75, 18.75, 1.5)],
  ], icon)
}
