// forge/hand/pastel/stop.mjs — the pastel stop: one soft lavender tile (the media family hue of play and pause)
// so its deeper rim holds on white, where the generated blush square faded into the page.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr } = Prim
  return compose([
    ['lavender', rr(4.25, 4.25, 19.75, 19.75, 3.5)],
  ], icon)
}
