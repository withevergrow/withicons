// forge/hand/liquid/love-lock.mjs — a heart-shaped padlock in clear liquid glass: a full heart body, a thick
// coloured-glass shackle whose legs plunge into the two lobes through hairline moats, and an accent-glass keyhole bead.
// The generated shackle was a 2.3u tube whose feet fused into the lobes' rims, and the keyhole was a groove ringed by
// rims, so the lock read as a heart with a loop and a bead. Same model and paint as the generator (_liquid-core.mjs
// build); only the geometry is drawn here. Motion: heart wm-k, shackle the A part (wm-a, nods about 12 8.5), keyhole wm-s.
import { parsePath, circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, strokeSet, normalize } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'
import * as F from '../../styles/_liquid-field.mjs'

const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)
const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const inset = (set, e, plate) => F.trace(F.offset(F.region(set, 2), e), 0.02, 0.2).map(pts => ({ pts, closed: true, plate }))
const disc = (x, y, r) => normalize(circle(x, y, r, 0.15))

const HEART = 'M12 22C8.6 20 3.5 16.75 3.5 12.15C3.5 9.65 5.45 7.85 7.95 7.85C9.75 7.85 11.2 8.85 12 10.35C12.8 8.85 14.25 7.85 16.05 7.85C18.55 7.85 20.5 9.65 20.5 12.15C20.5 16.75 15.4 20 12 22Z'
// shackle centreline: legs stand in the lobes, the bow rises well clear of the heart's top
const SHACKLE = 'M8.6 9.5V6.3A3.4 3.4 0 0 1 15.4 6.3V9.5'

function skeleton(name) {
  const heart = setOf(ringsOf(HEART))
  const sh = parsePath(SHACKLE, 0.15)[0].pts
  // the shackle stops just above the lobes, parted from the heart by a clear gap
  const shackle = differenceSets(strokeSet(sh, 3.1), dilate(heart, 0.55))
  // the keyhole: a round head over a tapered slot, an accent-glass bead in its own moat (static: no S motion part)
  const key = unionSets([disc(12, 14.35, 1.6), setOf([[[11.1, 14.85], [12.9, 14.85], [13.25, 18.55], [10.75, 18.55]]])])
  return {
    name, paths: [], cutouts: [],
    fills: [fill(heart), fill(shackle), fill(key)],
    lines: [...inset(heart, 1.3, 'K'), ...inset(shackle, 1.15, 'A'), ...inset(key, 1.1, 'S')],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'love-lock'))
  // coloured glass a little denser (as unlock) so the shackle holds on white
  const defs = out && out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g1 = defs.find(g => /-1$/.test(g[1].id))
  if (g1) g1[2] = g1[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': i === 0 ? 0.48 : 0.85 }])
  return out
}
