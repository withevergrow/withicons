// forge/hand/chrome/user.mjs: a chrome head and shoulders with a clear gap between them, so it reads as a person and not a pill.
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
  const name = (icon && icon.name) || 'user'
  const Ls = layers(model(skeleton(name, [
    disc(12, 7.2, 4.6),
    'M3.6 21 V18.8 A5.6 5.6 0 0 1 9.2 13.6 H14.8 A5.6 5.6 0 0 1 20.4 18.8 V21 Z',
  ])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
