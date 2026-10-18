// forge/hand/anime/bandage.mjs — the new bandage skeleton in anime: a sakura adhesive strip with squarish rounded
// ends (not a pill) running bottom-left to top-right, a full-width cream gauze pad with four sakura holes and
// visible tape seams, and small vent dots on both wings so it reads as a plaster at 16px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

// drawn level around (12, 12), then turned -45 deg onto the skeleton's diagonal
const R = s => k.rot(s, -45, 12, 12)

export default function render(icon) {
  const strip = k.rr(2.2, 7.6, 21.8, 16.4, 2.7)
  const pad = k.clip(strip, k.rect(8.2, 6, 15.8, 18))
  const holes = k.join(k.circle(10.4, 10.4, 0.6), k.circle(13.6, 10.4, 0.6), k.circle(10.4, 13.6, 0.6), k.circle(13.6, 13.6, 0.6))
  const vents = k.join(k.circle(5.2, 10.6, 0.5), k.circle(5.2, 13.4, 0.5), k.circle(18.8, 10.6, 0.5), k.circle(18.8, 13.4, 0.5))
  const ops = [
    k.surf(R(strip), 'c2', { shineSize: 0.75 }),
    k.paint(R(vents), 'shadow', { op: 0.45 }),
    k.surf(R(pad), 'tint', { shine: 'none', cast: false, ol: 0.4 }),
    k.paint(R(holes), 'c2'),
  ]
  return compose(ops, { seed: icon.name })
}
