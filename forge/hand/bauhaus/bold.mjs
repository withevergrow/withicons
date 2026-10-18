// forge/hand/bauhaus/bold.mjs — a heavy B with open counters: ink stem, red upper bowl and blue lower bowl, each a
// D band; replaces the solid half discs that made the letter ambiguous. The red bowl ends flush with the lower
// counter's top, so the whole middle bar is red and the blue starts at the counter (no thin colour band).
import { path, cut } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
// untagged nodes are the body: tag them wm-k so motion keeps them with the object
const body = nodes => nodes.map(([t, a]) => [t, a.class ? a : { ...a, class: 'wm-k' }])

export default function render(icon) {
  const counters = [
    path('M10 5.75H11.5A2.125 2.125 0 0 1 11.5 10H10Z'),
    path('M10 13H12.5A2.63 2.63 0 0 1 12.5 18.25H10Z'),
  ]
  // upper bowl y 3..13 (right edge 16.5), lower bowl y 10.25..21 (right edge 17.88) tucked under it
  const upper = path('M8.5 3H11.5A5 5 0 0 1 11.5 13H8.5Z')
  const lower = path('M8.5 10.25H12.5A5.38 5.38 0 0 1 12.5 21H8.5Z')
  return body(compose([
    ['c3', cut(lower, ...counters)],
    ['c1', cut(upper, ...counters)],
    ['ink', path('M7.25 3H10V21H7.25A1.75 1.75 0 0 1 5.5 19.25V4.75A1.75 1.75 0 0 1 7.25 3Z')],
  ], icon))
}
