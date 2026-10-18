// forge/hand/chrome/screen-share.mjs — a polished chrome monitor whose tall screen is a dark gunmetal glass panel set
// behind a parting seam, a short hot-pink enamel up-arrow rising in its middle, and a sturdy gunmetal stand. The
// generated drawing left the whole face pale chrome, so the monitor lost its edge and the arrow sat on the busiest part
// of the reflection; here the screen is painted dark (no horizon, a deep steel glass) and the arrow is kept short so its
// bezel keeps a clear margin of dark panel on every side. Same model and paint as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

// a slightly taller body and a thinner bezel: the screen runs y 6..14 (its gunmetal tube reaches about 4.9..15.1)
const BODY = 'M4 3.25H20A2 2 0 0 1 22 5.25V14.75A2 2 0 0 1 20 16.75H4A2 2 0 0 1 2 14.75V5.25A2 2 0 0 1 4 3.25Z'
const SCREEN = 'M6.5 6H17.5A0.75 0.75 0 0 1 18.25 6.75V13.25A0.75 0.75 0 0 1 17.5 14H6.5A0.75 0.75 0 0 1 5.75 13.25V6.75A0.75 0.75 0 0 1 6.5 6Z'
const NECK = 'M12 16.75V20'
const FOOT = 'M8.75 20.75H15.25'
// a short arrow (y 8.5..11.75, head +/-2) so the jewel and its moat stay about 2u clear of the panel's edges
const SHAFT = 'M12 11.75V8.5'
const HEAD = 'M10 10.5L12 8.5L14 10.5'

function skeleton(name) {
  const paths = [
    { id: 'p0', d: BODY, plate: 'K' }, { id: 'p1', d: SCREEN, plate: 'A' },
    { id: 'p2', d: NECK, plate: 'A' }, { id: 'p3', d: FOOT, plate: 'A' },
    { id: 'p4', d: SHAFT, plate: 'S' }, { id: 'p5', d: HEAD, plate: 'S' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(BODY), fill(SCREEN)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'screen-share'
  const Ls = layers(model(skeleton(name)))
  // the screen is the only gunmetal blob (the stand pieces are tubes): its sky ramp becomes deep steel glass,
  // its ground a darker ink pool and its horizon goes, so the panel reads clearly darker than the chrome bezel
  const isScreen = L => L.cls === 'wm-a' && Array.isArray(L.fill) && (L.fill[0] === 'metalSky' || L.fill[0] === 'metalGround')
  const box = (Ls.list.find(L => isScreen(L) && L.fill[0] === 'metalSky') || {}).fill
  if (box) {
    const [, , , y1] = box[1]
    Ls.list = Ls.list.filter(L => {
      if (L.cls !== 'wm-a') return true
      // the screen's horizon band (a flat ink layer inside the screen box)
      if (L.fill === col('ink') && L.loops.every(l => l.every(p => p[1] < y1 + 0.1 && p[1] > box[1][1] - 0.1))) return false
      return true
    })
    for (const L of Ls.list) {
      if (!isScreen(L)) continue
      if (L.fill[0] === 'metalSky') L.fill = col('c3')
      else { L.fill = col('ink'); L.op = 0.55 }
    }
  }
  return emit(Ls, name, 0)
}
