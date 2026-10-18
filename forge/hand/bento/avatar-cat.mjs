// forge/hand/bento/avatar-cat.mjs — a bento cat face in the avatar family's recipe (bear, fox, panda): a fur-toned head
// with pointed ears and pale inner ears, a pale muzzle with an ink nose and mouth, ink eyes with catch-lights and short
// fine whiskers that just leave the cheeks (the generated face was one washed-out pale mass, its whiskers four heavy
// blue bars that read as pins, and its dash eyes vanished at 16px).
// Tile, shadow and outline as the generated bento; eyes carry wm-a (the spec blinks parts.A about the eye line).
import { mapPath } from '../../styles/_bento-path.mjs'
import { squircle, col, T } from '../../styles/_bento-core.mjs'

const NAME = 'avatar-cat'
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

const HEAD = 'M12 20.5C8 20.5 5 18.25 5 14.5C5 12.75 5.5 11.25 6 10.25V5.5C6 4.5 6.75 4.25 7.5 4.75L10.25 7C10.75 6.75 11.25 6.75 12 6.75C12.75 6.75 13.25 6.75 13.75 7L16.5 4.75C17.25 4.25 18 4.5 18 5.5V10.25C18.5 11.25 19 12.75 19 14.5C19 18.25 16 20.5 12 20.5Z'
const EARS = 'M7.4 6.6V9.6L9.4 7.9ZM16.6 6.6V9.6L14.6 7.9Z'
const MUZZLE = 'M15.25 17.25A3.25 2.25 0 1 1 8.75 17.25A3.25 2.25 0 1 1 15.25 17.25Z'
const EYES = 'M8.6 12.5A0.95 1.2 0 1 0 10.5 12.5A0.95 1.2 0 1 0 8.6 12.5ZM13.5 12.5A0.95 1.2 0 1 0 15.4 12.5A0.95 1.2 0 1 0 13.5 12.5Z'
const LIGHTS = 'M9.6 12.05A0.38 0.38 0 1 0 10.36 12.05A0.38 0.38 0 1 0 9.6 12.05ZM14.5 12.05A0.38 0.38 0 1 0 15.26 12.05A0.38 0.38 0 1 0 14.5 12.05Z'
const NOSE = 'M10.9 15H13.1Q13.6 15 13.3 15.4L12.4 16.35Q12 16.75 11.6 16.35L10.7 15.4Q10.4 15 10.9 15Z'
const MOUTH = 'M12 16.6V17.3M10.6 17.7C11.3 18.25 12 17.95 12 17.3C12 17.95 12.7 18.25 13.4 17.7'
const WHISKERS = 'M2.5 14.25L5.1 14.9M2.5 17.6L5.1 16.95M21.5 14.25L18.9 14.9M21.5 17.6L18.9 16.95'

export default function render() {
  return bento([
    ['m', HEAD, 'F'],
    ['m', EARS, 'P'],
    ['m', MUZZLE, 'P'],
    ['l', WHISKERS, 'K', 'K', 0.6],
    ['l', HEAD, 'K'],
    ['l', MOUTH, 'E', 'K', 0.55],
    ['m', NOSE, 'E'],
    ['m', EYES, 'E', 'A'], ['m', LIGHTS, 'W', 'A'],
  ])
}
