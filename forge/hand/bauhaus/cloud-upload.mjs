// forge/hand/bauhaus/cloud-upload.mjs — the cloud family (red front lobe, blue body) carrying one long, heavy
// cream up-arrow printed on its body, as file-up prints its arrow on the page; replaces a stalk with a small
// red head poking out of a low cloud, which read as a tree.
import { seg2 } from '../../styles/_bauhaus-prim.mjs'
import { cloud, head } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const nodes = compose([
    ...cloud(0.5, 'c3', 'c1'),
    ['tint', seg2(13.25, 17.25, 13.25, 11.5, 2.75), head(13.25, 7, 270, 5.5, 4.75, 1.25)],
  ], icon)
  // the cloud is the body (wm-k); only the arrow plays the S part (motion: rise)
  for (const [, a] of nodes) a.class = a.fill.includes('-tint') ? 'wm-s' : 'wm-k'
  return nodes
}
