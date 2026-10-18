// forge/hand/chrome/folder-minus.mjs — the chrome folder with a fat, dark minus inlaid in its face. The generated
// drawing cut the minus in as a hairline groove that vanished against the chrome horizon; here the bar is a long,
// bold near-black slot in a thin light ring (edge ring, ink core, one faint sheen), the single
// dark mark on the bright body, so it reads at 16px. The bar is the moving part (the spec pulses parts.A): wm-a.
// The folder body is the generator's own model and paint (_chrome-core.mjs); only the inlay is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

const BODY = 'M3 7A2 2 0 0 1 5 5H9L11 7H19A2 2 0 0 1 21 9V18A2 2 0 0 1 19 20H5A2 2 0 0 1 3 18Z'

function skeleton(name) {
  const paths = [{ id: 'p0', d: BODY, plate: 'K' }].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(BODY)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

// a rounded bar, output coordinates: x0..x1 wide, centred on y, h tall
const bar = (x0, x1, y, h) => {
  const r = h / 2, t = +(y - r).toFixed(2), b = +(y + r).toFixed(2)
  return `M${(x0 + r).toFixed(2)} ${t}H${(x1 - r).toFixed(2)}A${r} ${r} 0 0 1 ${(x1 - r).toFixed(2)} ${b}H${(x0 + r).toFixed(2)}A${r} ${r} 0 0 1 ${(x0 + r).toFixed(2)} ${t}Z`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'folder-minus'
  const Ls = layers(model(skeleton(name)))
  const out = emit(Ls, name, 0)
  const id = `wg-chrome-${name}-9`
  const defs = ['linearGradient', { id, x1: 0, y1: 13.5, x2: 0, y2: 16.5, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('shadow') }],
    ['stop', { offset: 0.55, 'stop-color': col('ink') }],
    ['stop', { offset: 1, 'stop-color': col('shadow') }]]]
  const head = out[0][0] === 'defs' ? [['defs', {}, [...out[0][2], defs]], ...out.slice(1)] : [['defs', {}, [defs]], ...out]
  return [...head,
    ['path', { d: bar(5.5, 18.5, 15, 4), fill: col('edge'), class: 'wm-a' }],
    ['path', { d: bar(6, 18, 15, 3), fill: `url(#${id})`, class: 'wm-a' }],
    ['path', { d: 'M7.6 14.3H16.4', fill: 'none', stroke: col('shine'), 'stroke-width': 0.3, 'stroke-linecap': 'round', 'stroke-opacity': 0.35, class: 'wm-shine' }],
  ]
}
