// forge/hand/pastel/panel-bottom.mjs — the pastel bottom-panel window: the generated pane was a thin lavender well on the
// lavender frame and vanished at 16px, so the pane is a deep butter sheet under a sky content
// well, a clear two-hue split that holds at small sizes; same frame as panel-right / sidebar.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr } = Prim
  return compose([
    ['lavender@K', rr(2.5, 3.5, 21.5, 20.5, 3.25)],
    ['sky.well', rr(4.75, 5.75, 19.25, 12.75, 1.5)],
    ['butter@A', rr(4.75, 14.5, 19.25, 18.25, 1.5)],
  ], icon)
}
