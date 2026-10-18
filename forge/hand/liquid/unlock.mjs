// forge/hand/liquid/unlock.mjs — a clear glass padlock body with a thick coloured-glass shackle lifted and swung open,
// its free end hanging well clear of the body, and a coloured-glass keyhole inlaid in a hairline moat. The generator's
// 2.3u shackle was a faint c2 arc that ended just above the body, so at 24 and 16px it read as a closed lock or a
// basket. Here the shackle is a 3.1u tube standing on the left, its open end 3u above the body, and its glass is a
// touch denser so it holds on white. Same model and paint as the generator (_liquid-core.mjs build); only the
// geometry is drawn here. Motion: body wm-k; shackle and keyhole are the A part (wm-a).
import { parsePath, circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, strokeSet, roundStrokeSet, erode, normalize } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)
const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const disc = (x, y, r) => normalize(circle(x, y, r, 0.15))

const BODY = 'M6.4 10.9H17.6A3.2 3.2 0 0 1 20.8 14.1V18.8A3.2 3.2 0 0 1 17.6 22H6.4A3.2 3.2 0 0 1 3.2 18.8V14.1A3.2 3.2 0 0 1 6.4 10.9Z'
// shackle centreline: up the left leg, over the top, down to a short free end on the right
const SHACKLE = 'M7.7 11.4V6.2A4.3 4.3 0 0 1 16.3 6.2V6.6'
const KEY = [[12, 15.3], [12, 18.2]]

function skeleton(name) {
  const body = setOf(ringsOf(BODY))
  const sh = parsePath(SHACKLE, 0.15)[0].pts
  // flat foot (it stands in the body's moat), round free end
  const shackle = unionSets([strokeSet(sh, 3.1), disc(sh.at(-1)[0], sh.at(-1)[1], 1.55)])
  const key = unionSets([disc(12, 15.3, 1.75), roundStrokeSet(KEY, 1.9)])
  const kLines = erode(body, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' }))
  return {
    name, paths: [], cutouts: [],
    fills: [fill(body), fill(shackle), fill(key)],
    lines: [{ pts: sh, closed: false, plate: 'A' }, { pts: KEY, closed: false, plate: 'A' }, ...kLines],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'unlock'))
  // coloured glass a little denser than the generator's (0.3 -> 0.75) so the open shackle holds on white
  const defs = out && out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g1 = defs.find(g => /-1$/.test(g[1].id))
  if (g1) g1[2] = g1[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': i === 0 ? 0.48 : 0.85 }])
  return out
}
