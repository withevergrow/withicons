// forge/hand/chrome/user-round.mjs: a chrome head and shoulders with a clear gap between them, so it reads as a person and not a pill.
// Both pieces are filled regions only (no inflated centre lines), which is what kept the generated head and body fused.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts) {
  const fills = parts.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths: [], fills, cutouts: [], lines: [] }
}
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'user-round'
  const Ls = layers(model(skeleton(name, [
    disc(12, 7.4, 4.2),
    'M3.8 21 C3.8 17.2 7.4 14.4 12 14.4 C16.6 14.4 20.2 17.2 20.2 21 Z',
  ])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
