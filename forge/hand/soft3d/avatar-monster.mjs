// forge/hand/soft3d/avatar-monster.mjs: the one-eyed monster as a soft 3D purple dome on a flat base with two
// stubby feet and side nubs, crowned by two curved gold horns, one big glossy eye (wm-a, so it blinks) and a wide
// grin with two white fangs. The generated drawing had a wavy hem and no horns, so it read as a ghost; the horns,
// feet and fangs say "monster" at a glance. Same painter recipe as the generated characters (base role fill plus
// the shared volume overlay, contact shadow, blush).
const BASE = { ink: '#262A33', c1: '#9A6BE0', c2: '#C7A8F2', c3: '#F4F4F6', c4: '#F2C14E', accent: '#F36F7F', edge: '#FFFFFF', shadow: '#22202A', shine: '#FFFFFF' }
const E = (cx, cy, rx, ry = rx) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`.replace(/(\d+\.\d{2})\d+/g, '$1')

export default function render(icon) {
  const name = icon?.name || 'avatar-monster'
  const col = r => `var(--with-soft3d-${r}, ${BASE[r]})`
  const id = k => `wg-soft3d-${name}-${k}`
  const stop = (o, r, op) => ['stop', { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.36, cy: 0.3, r: 0.8 }, [stop(0, 'shine', 0.5), stop(0.36, 'shine', 0.06), stop(0.66, 'shadow', 0), stop(1, 'shadow', 0.3)]],
    ['radialGradient', { id: id(1), cx: 0.38, cy: 0.28, r: 0.85 }, [stop(0, 'shine', 0.3), stop(0.45, 'shine', 0), stop(0.75, 'shadow', 0), stop(1, 'shadow', 0.2)]],
  ]]
  const out = [defs]
  const P = (d, a, cls = 'wm-k') => out.push(['path', { d, ...a, class: cls }])
  const form = (d, role, cls = 'wm-k', g = 0) => { P(d, { fill: col(role) }, cls); if (g !== null) P(d, { fill: `url(#${id(g)})` }, cls) }
  const fill = (d, role, op = 1, cls = 'wm-k') => P(d, op === 1 ? { fill: col(role) } : { fill: col(role), 'fill-opacity': op }, cls)

  // contact shadow
  fill(E(12.3, 22.3, 7.2, 0.95), 'shadow', 0.07, 'wm-shadow')
  fill(E(12.3, 22.3, 5.18, 0.68), 'shadow', 0.1, 'wm-shadow')
  // horns: curved gold cones rising from the dome's shoulders, curling outward (behind the body)
  form('M6.6 8.4C5.3 6.9 5 4.6 5.7 2.6C6.8 4.3 8.6 5.3 10.2 5.7Z', 'c4', 'wm-k', 1)
  form('M17.4 8.4C18.7 6.9 19 4.6 18.3 2.6C17.2 4.3 15.4 5.3 13.8 5.7Z', 'c4', 'wm-k', 1)
  // side nubs (little arms) and stubby feet, half hidden behind the body
  form(E(5.1, 14.6, 1.25, 1.7), 'c1', 'wm-s', 1)
  form(E(18.9, 14.6, 1.25, 1.7), 'c1', 'wm-s', 1)
  form(E(8.9, 20.5, 1.9, 1), 'c1', 'wm-k', 1)
  form(E(15.1, 20.5, 1.9, 1), 'c1', 'wm-k', 1)
  // body: a soft dome on a flat rounded base
  form('M5.4 19.1V11.6C5.4 7.6 8.3 5 12 5s6.6 2.6 6.6 6.6v7.5c0 .8-.6 1.3-1.4 1.3H6.8c-.8 0-1.4-.5-1.4-1.3z', 'c1')
  P('M7.3 8.6c.6-1.3 1.8-2.3 3.2-2.7', { fill: 'none', stroke: col('shine'), 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.4 }, 'wm-shine')
  // the big eye (wm-a: blinks about 12,10.25)
  form(E(12, 10.3, 3.1), 'c3', 'wm-a', 1)
  form(E(12.35, 10.7, 1.65, 1.75), 'ink', 'wm-a', null)
  fill(E(11.7, 10, 0.6), 'shine', 0.95, 'wm-shine')
  // a wide grin with two fangs and a tongue
  fill('M8.4 15c2.3 1.3 4.9 1.3 7.2 0-.4 2.2-1.9 3.3-3.6 3.3s-3.2-1.1-3.6-3.3z', 'ink', 0.85)
  fill(E(12, 17.55, 1.15, 0.5), 'accent', 0.85)
  fill('M9.6 15.5L10.4 17.1L11.2 15.85ZM12.8 15.85L13.6 17.1L14.4 15.5Z', 'edge')
  // blush
  fill(E(7.4, 13.6, 0.92, 0.56), 'accent', 0.22)
  fill(E(16.6, 13.6, 0.92, 0.56), 'accent', 0.22)
  return out
}
