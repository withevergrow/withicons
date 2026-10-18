// forge/hand/bento/avatar-dog.mjs — a bento dog face in the avatar family's recipe (bear, fox, panda): a fur-toned
// head with long floppy ears hanging down its sides in the deeper tone, a big pale muzzle with a large ink nose, an
// ink mouth and an accent tongue, ink eyes with catch-lights. The generated ears hugged a round head like headphones
// and its muzzle vanished, so it read as the bear at 16px; the hanging ears and nose now make it a dog.
// Tile, shadow and outline as the generated bento; eyes carry wm-a (the spec blinks parts.A about the eye line).
import { mapPath } from '../../styles/_bento-path.mjs'
import { squircle, col, T } from '../../styles/_bento-core.mjs'

const NAME = 'avatar-dog'
const id = n => `wg-bento-${NAME}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const CLS = { K: undefined, A: 'wm-a', S: 'wm-s', shine: 'wm-shine' }

// layers: ['m', d, tone, plate] mass (K pale gradient, F fur gradient, A c1, S accent, P pale pane, D / X solid A / S line colour, E ink, W lit pane), ['l', d, tone, plate, width] line
function bento(layers) {
  const out = [['defs', {}, [
    lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
    lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    lin(2, 0, +(T.CY - 7 * T.S).toFixed(2), 0, +(T.CY + 9 * T.S).toFixed(2), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    lin(3, 0, 6.3, 0, 16.4, [stop(0, 'c1', 0.5), stop(1, 'c1', 0.82)]),
  ]]]
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  out.push(['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }])
  out.push(['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }])
  out.push(['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }])
  const fd = layers.filter(l => l[0] === 'm' && l[2] !== 'W').map(l => l[1]), sd = layers.filter(l => l[0] === 'l').map(l => l[1])
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: fd.map(d => M(d, dy)).join(''), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: sd.map(d => M(d, dy)).join(''), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  for (const [k, d0, tone, pl = 'K', w = T.SW] of layers) {
    const d = M(d0), c = CLS[pl], a = o => (c ? { ...o, class: c } : o)
    if (k === 'm') {
      if (tone === 'W') { out.push(['path', a({ d, fill: col('shine'), 'fill-opacity': 0.85 })]); continue }
      if (tone === 'D') { out.push(['path', a({ d, fill: col('shadow') })], ['path', a({ d, fill: col('c1'), 'fill-opacity': 0.72 })]); continue }
      if (tone === 'P') { out.push(['path', a({ d, fill: col('shine'), 'fill-opacity': 0.92 })]); continue }
      if (tone === 'E') { out.push(['path', a({ d, fill: col('ink') })]); continue }
      if (tone === 'X') { out.push(['path', a({ d, fill: col('ink') })], ['path', a({ d, fill: col('accent'), 'fill-opacity': 0.8 })]); continue }
      out.push(['path', a({ d, fill: col('shine') })])
      out.push(['path', a(tone === 'K' || tone === 'F' ? { d, fill: url(tone === 'F' ? 3 : 2) } : { d, fill: col(tone === 'S' ? 'accent' : 'c1'), 'fill-opacity': tone === 'S' ? 0.3 : 0.42 })])
    } else if (tone === 'K' || tone === 'E') out.push(['path', a({ d, stroke: col(tone === 'E' ? 'ink' : 'shadow'), 'stroke-width': w })])
    else {
      const [u, cc, o] = tone === 'S' ? ['ink', 'accent', 0.8] : ['shadow', 'c1', 0.72]
      out.push(['path', a({ d, stroke: col(u), 'stroke-width': w })])
      out.push(['path', a({ d, stroke: col(cc), 'stroke-opacity': o, 'stroke-width': w })])
    }
  }
  return out
}

const HEAD = 'M12 5.5C15.6 5.5 17.75 8 17.75 11.5V14.25C17.75 18.25 15.25 20.5 12 20.5C8.75 20.5 6.25 18.25 6.25 14.25V11.5C6.25 8 8.4 5.5 12 5.5Z'
const EARS = 'M8.75 6.4C6.5 5.6 3.9 6.6 3.3 9.4C2.8 11.9 3 15 4.3 16.4C5.4 17.6 6.9 16.9 7 14.9L7.5 9.6C7.65 8.3 8.1 7.1 8.75 6.4Z' +
  'M15.25 6.4C17.5 5.6 20.1 6.6 20.7 9.4C21.2 11.9 21 15 19.7 16.4C18.6 17.6 17.1 16.9 17 14.9L16.5 9.6C16.35 8.3 15.9 7.1 15.25 6.4Z'
const MUZZLE = 'M15.5 16.5A3.5 2.75 0 1 1 8.5 16.5A3.5 2.75 0 1 1 15.5 16.5Z'
const EYES = 'M8.95 12A0.95 1.2 0 1 0 10.85 12A0.95 1.2 0 1 0 8.95 12ZM13.15 12A0.95 1.2 0 1 0 15.05 12A0.95 1.2 0 1 0 13.15 12Z'
const LIGHTS = 'M9.95 11.55A0.38 0.38 0 1 0 10.71 11.55A0.38 0.38 0 1 0 9.95 11.55ZM14.15 11.55A0.38 0.38 0 1 0 14.91 11.55A0.38 0.38 0 1 0 14.15 11.55Z'
const NOSE = 'M10.5 14.75C10.5 14 13.5 14 13.5 14.75C13.5 15.6 12.75 16.2 12 16.2C11.25 16.2 10.5 15.6 10.5 14.75Z'
const MOUTH = 'M12 16.2V16.9M10.6 17.25C11.3 17.8 12 17.5 12 16.9C12 17.5 12.7 17.8 13.4 17.25'
const TONGUE = 'M11.3 17.6H12.7V18.35C12.7 18.8 12.4 19.1 12 19.1C11.6 19.1 11.3 18.8 11.3 18.35Z'

export default function render() {
  return bento([
    ['m', HEAD, 'F'], ['l', HEAD, 'K'],
    ['m', EARS, 'D'], ['l', EARS, 'K'],
    ['m', MUZZLE, 'P'],
    ['m', TONGUE, 'X'],
    ['m', NOSE, 'E'],
    ['l', MOUTH, 'E', 'K', 0.55],
    ['m', EYES, 'E', 'A'], ['m', LIGHTS, 'W', 'A'],
  ])
}
