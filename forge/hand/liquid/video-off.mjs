// forge/hand/liquid/video-off.mjs: a video camera in glass (clear body, coloured-glass lens cone) crossed by one slim
// accent-glass slash. The slash runs corner to corner so it splits the body and only clips the lens's lower corner,
// leaving the lens cone fully readable. The generated slash was a heavy pink band with a halo over the body. Same
// model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn here, and the slash is a
// touch slimmer than the style's usual S stroke (set for this build only, restored after).
// Motion: body wm-k, lens cone the A part (wm-a), slash wm-s.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, erode } from '../../kernel/bool.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)

function skeleton(name) {
  const body = setOf(ringsOf('M4.6 6.4H12.6A2.6 2.6 0 0 1 15.2 9V15A2.6 2.6 0 0 1 12.6 17.6H4.6A2.6 2.6 0 0 1 2 15V9A2.6 2.6 0 0 1 4.6 6.4Z'))
  const lens = setOf(ringsOf('M16.6 10.4L20.6 7.6A1 1 0 0 1 22.2 8.4V15.6A1 1 0 0 1 20.6 16.4L16.6 13.6Z'))
  const slash = [[3.4, 3.4], [20.6, 20.6]]
  return {
    name, paths: [], cutouts: [],
    fills: [fill(body), fill(lens)],
    lines: [
      ...erode(body, 1.32).map(r => ({ pts: r, closed: true, plate: 'K' })),
      ...erode(lens, 1.15).map(r => ({ pts: r, closed: true, plate: 'A' })),
      { pts: slash, closed: false, plate: 'S' },
    ],
  }
}

export default function render(icon) {
  const ws = L.WS
  let out
  try { L.WS = 1.7; out = build(skeleton((icon && icon.name) || 'video-off')) } finally { L.WS = ws }
  if (!out) return null
  const defs = out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => /-0$/.test(g[1].id))
  if (g0) g0[2] = g0[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.24, 0.44, 0.7][i] }])
  const g1 = defs.find(g => /-1$/.test(g[1].id))
  if (g1) g1[2] = g1[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': i === 0 ? 0.5 : 0.88 }])
  return out
}
