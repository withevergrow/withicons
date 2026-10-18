// forge/hand/chrome/clipboard.mjs — the clipboard as a chrome board with a solid gunmetal spring clip clamped on its
// top edge, instead of a hollow clip loop over a U-shaped groove (which read as a bag with a handle). The board is one
// clean slab with an unbroken mirror horizon; the clip, the classic narrow tab with a hanging hole over a wide jaw, is
// a separate gunmetal piece laid over the board's top edge (its dark rim and soft shadow seat it), tagged wm-a so it
// nods on its own. Same model and paint as the generator (_chrome-core.mjs); the pieces are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

const BOARD = 'M6.5 4.5 H17.5 A2 2 0 0 1 19.5 6.5 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V6.5 A2 2 0 0 1 6.5 4.5 Z'
// the clip's centre line: the style's gunmetal tube (2.25 wide) inflates it to a tab 9..15 over a jaw 7.25..16.75
const CLIP = 'M10.25 3.25 H13.75 V5.75 H15.5 V7.25 H8.5 V5.75 H10.25 Z'
// two lines of notes engraved below the horizon: the sheet on the board
const NOTES = ['M8 15.75 H16', 'M8 18.5 H13.5']

const prep = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
function piece(name, d, plate, grooves = []) {
  const paths = [{ id: 'p', d, plate, subs: parsePath(d) }]
  const lines = paths[0].subs.map(x => ({ pts: x.pts, closed: x.closed, plate, pathId: 'p' }))
  return layers(model({ name, paths, lines, fills: [prep(d)], cutouts: grooves.map(g => ({ d: g, subs: parsePath(g) })) }))
}

export default function render(icon) {
  const name = (icon && icon.name) || 'clipboard'
  const board = piece(name, BOARD, 'K', NOTES)
  const clip = piece(name, CLIP, 'A')
  for (const L of board.list) if (!L.cls) L.cls = 'wm-k'
  for (const L of clip.list) L.cls = 'wm-a'
  const out = emit({ list: [...board.list, ...clip.list], glint: board.glint }, name, 0)
  // the clip's hanging hole, a dark pit in the tab (a back piece takes no cutouts)
  const hole = ['circle', { cx: 11.8, cy: 4.05, r: 0.55, fill: col('shadow'), class: 'wm-a' }]
  const i = out.findIndex(n => n[1] && n[1].class === 'wm-a' && n[1]['fill-opacity'] === 0.85)
  out.splice(i < 0 ? out.length - 1 : i, 0, hole)
  return out
}
