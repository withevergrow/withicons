// forge/hand/chrome/building.mjs — a tall polished chrome tower on a plinth, with a plain 2 x 3 grid of dark glass
// windows and an arched doorway cut through its foot. The generated drawing outlined every window with a bevel ring and
// fused them into a busy lattice; here each window is one solid rounded rectangle of dark glass (no ring), set well
// apart, so the grid reads at 16-24px. The windows are the part that lights up (wm-a); the door is a clean notch.
// Chrome model and paint from _chrome-core.mjs (the silhouette is a fill, not a stroke); the glass is traced from the
// same fields.
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const TOWER = 'M4.5 21.5V4.5A2 2 0 0 1 6.5 2.5H17.5A2 2 0 0 1 19.5 4.5V21.5Z'
const PLINTH = 'M3 20.1H21V21.5H3Z'
const DOOR = 'M10.1 20.1V18.8A1.9 1.9 0 0 1 13.9 18.8V20.1Z'
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
const WINDOWS = []
for (const y of [4.4, 8.3, 13.3]) for (const x of [7.4, 13.6]) WINDOWS.push(rr(x, y, 3, 2.5, 0.75))

function skeleton(name) {
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  const cut = d => ({ d, subs: parsePath(d) })
  return { name, paths: [], fills: [fill(TOWER), fill(PLINTH)], cutouts: [cut(DOOR)], lines: [] }
}

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const smooth = r => { const n = r.length; return n < 5 ? r : r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] }) }
const trace = Fd => ringsD(F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), 0.04, 2)

export default function render(icon) {
  const name = (icon && icon.name) || 'building'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const glass = F.field(0.7)
  F.region(WINDOWS.flatMap(d => parsePath(d).map(s => s.pts.map(tf))), 0.7, glass)
  const id = `wg-chrome-${name}-9`
  const grad = ['linearGradient', { id, x1: 0, y1: 4.0, x2: 0, y2: 16.1, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c2') }],
    ['stop', { offset: 0.5, 'stop-color': col('c3') }],
    ['stop', { offset: 1, 'stop-color': col('shadow') }]]]
  const head = out[0][0] === 'defs' ? [['defs', {}, [...out[0][2], grad]], ...out.slice(1)] : [['defs', {}, [grad]], ...out]
  const glint = head[head.length - 1]
  return [...head.slice(0, -1), ['path', { d: trace(glass), fill: `url(#${id})`, class: 'wm-a' }], glint]
}
