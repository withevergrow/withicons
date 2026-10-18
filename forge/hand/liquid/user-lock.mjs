// forge/hand/liquid/user-lock.mjs: a clear-glass person (round head, shoulder bust) with a small accent-glass padlock
// at the lower right, its coloured-glass shackle arching clear above the body and the keyhole cut through the bead.
// The generated lock was oversized and ran into the torso, so the silhouette went muddy at 16px. Here the bust stops
// well left of the lock and the lock is compact. Same model and paint as the generator (_liquid-core.mjs build); only
// the geometry is drawn here. Motion: person wm-k, shackle the A part (wm-a), lock body wm-s.
import { parsePath, circle } from '../../kernel/geom.mjs'
import { setOf, erode, normalize } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)
const rrect = (x0, y0, x1, y1, r) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

function skeleton(name) {
  const head = normalize(circle(7.6, 7.9, 3.8, 0.15))
  const bust = setOf(ringsOf('M2.2 21.6V19.4A5.2 5.2 0 0 1 7.4 14.2H7.8A5.2 5.2 0 0 1 13 19.4V21.6Z'))
  const lock = setOf(ringsOf(rrect(15, 15.4, 22.2, 21.8, 1.9)))
  const hole = [[18.6, 17.9], [18.6, 19.3]]
  const sh = parsePath('M16.2 15.6V13.2A2.4 2.4 0 0 1 21 13.2V15.6', 0.1)[0].pts
  return {
    name, paths: [], cutouts: [],
    fills: [fill(head), fill(bust), fill(lock)],
    lines: [
      ...erode(head, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' })),
      ...erode(bust, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' })),
      { pts: sh, closed: false, plate: 'A' },
      ...erode(lock, 1.1).map(r => ({ pts: r, closed: true, plate: 'S' })),
      { pts: hole, closed: false, plate: 'S' },
    ],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'user-lock'))
  if (!out) return null
  const defs = out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => /-0$/.test(g[1].id))
  if (g0) g0[2] = g0[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.24, 0.44, 0.7][i] }])
  const g1 = defs.find(g => /-1$/.test(g[1].id))
  if (g1) g1[2] = g1[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': i === 0 ? 0.5 : 0.88 }])
  return out
}
