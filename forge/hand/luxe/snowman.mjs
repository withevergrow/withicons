// forge/hand/luxe/snowman.mjs - two stacked sapphire snowballs with a gold top hat, scarf, twig arms, nose and buttons (the generated
// drawing lost them all in a gold smear).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const BODY = 'M10.58 13.23 A3.9 3.9 0 1 1 13.42 13.23 A4.4 4.4 0 1 1 10.58 13.23 Z'
const HAT = 'M10 4.2 V1.8 H14 V4.2 H16 V5.4 H8 V4.2 Z'
const G = {
  paths: [
    { d: BODY, plate: 'K' },
    { d: HAT, plate: 'S' },
    { d: 'M9.5 13.3 C11 14.2 13 14.2 14.5 13.3 M13.8 14 L14.2 16.6', plate: 'S' },
    { d: 'M12.5 10.4 L14.5 10.9', plate: 'A' },
    { d: 'M7.9 16 L4.6 13.8 M5.4 14.4 L5.2 12.2 M4.9 14 L3 14.2', plate: 'A' },
    { d: 'M16.1 16 L19.4 13.8 M18.6 14.4 L18.8 12.2 M19.1 14 L21 14.2', plate: 'A' },
  ],
  fills: [BODY, HAT],
  cutouts: [
    'M11.1 9.2 A0.75 0.75 0 1 1 9.6 9.2 A0.75 0.75 0 1 1 11.1 9.2 Z',
    'M14.4 9.2 A0.75 0.75 0 1 1 12.9 9.2 A0.75 0.75 0 1 1 14.4 9.2 Z',
    'M12.7 17.9 A0.7 0.7 0 1 1 11.3 17.9 A0.7 0.7 0 1 1 12.7 17.9 Z',
    'M12.7 20.1 A0.7 0.7 0 1 1 11.3 20.1 A0.7 0.7 0 1 1 12.7 20.1 Z',
  ],
}

function prep(name) {
  const paths = G.paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = G.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(x => x.pts)) } })
  const cutouts = G.cutouts.map(d => ({ d, subs: parsePath(d) }))
  const lines = paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  return { name, paths, fills, cutouts, lines }
}

// a distinct name keeps the generic per-icon tuning (_luxe-tune) off; snow-white enamel is set here instead
const SNOW = { '#2039B4': '#EEF2FA', '#16206E': '#8391B8' }
export default function render(icon) {
  return build(prep('snowman-hand')).map(([tag, a, kids]) => {
    const f = a && typeof a.fill === 'string' ? a.fill.replace(/#[0-9A-F]{6}/, h => SNOW[h] || h) : null
    return f ? [tag, { ...a, fill: f }, ...(kids ? [kids] : [])] : [tag, a, ...(kids ? [kids] : [])]
  })
}
