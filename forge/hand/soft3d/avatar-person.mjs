// forge/hand/soft3d/avatar-person.mjs: the neutral person after the skeleton redesign: a warm-skinned soft 3D bust
// with short dark hair swept to one side over the brow, a crew-neck teal top and the shared sibling face (glossy
// eyes, brows, blush, small open smile). Same painter recipe as avatar-man (role fill plus volume overlay).
const BASE = { ink: '#2A2226', c1: '#DDA176', c2: '#2A2120', c4: '#22A495', accent: '#F06A6A', edge: '#FFF8EE', shadow: '#2A1E1C', shine: '#FFFFFF' }
const r2 = s => s.replace(/(\d+\.\d{2})\d+/g, '$1')
const E = (cx, cy, rx, ry = rx) => r2(`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`)

export default function render(icon) {
  const name = icon?.name || 'avatar-person'
  const col = r => `var(--with-soft3d-${r}, ${BASE[r]})`
  const id = k => `wg-soft3d-${name}-${k}`
  const stop = (o, r, op) => ['stop', { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  const out = [['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.36, cy: 0.3, r: 0.8 }, [stop(0, 'shine', 0.5), stop(0.36, 'shine', 0.06), stop(0.66, 'shadow', 0), stop(1, 'shadow', 0.3)]],
    ['radialGradient', { id: id(1), cx: 0.38, cy: 0.28, r: 0.85 }, [stop(0, 'shine', 0.3), stop(0.45, 'shine', 0), stop(0.75, 'shadow', 0), stop(1, 'shadow', 0.2)]],
  ]]]
  const P = (d, a, cls = 'wm-k') => out.push(['path', { d, ...a, class: cls }])
  const form = (d, role, cls = 'wm-k', g = 0) => { P(d, { fill: col(role) }, cls); if (g !== null) P(d, { fill: `url(#${id(g)})` }, cls) }
  const fill = (d, role, op = 1, cls = 'wm-k') => P(d, op === 1 ? { fill: col(role) } : { fill: col(role), 'fill-opacity': op }, cls)
  const line = (d, role, w, op = 1, cls = 'wm-k') => P(d, { fill: 'none', stroke: col(role), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(op === 1 ? {} : { 'stroke-opacity': op }) }, cls)

  fill(E(12.3, 22.5, 7.6, 0.9), 'shadow', 0.07, 'wm-shadow')
  fill(E(12.3, 22.5, 5.47, 0.65), 'shadow', 0.1, 'wm-shadow')
  // crew-neck top
  form('M3.9 22.6c0-3.9 2.6-5.9 5.6-6.1l2.5.4 2.5-.4c3 .2 5.6 2.2 5.6 6.1z', 'c4')
  line('M7.1 19.4c.4 1.2 1 2.3 1.7 3.1M16.9 19.4c-.4 1.2-1 2.3-1.7 3.1', 'shadow', 0.55, 0.16)
  // neck
  fill('M10.25 13.35h3.5v3.3c0 .9-.8 1.5-1.75 1.5s-1.75-.6-1.75-1.5z', 'c1')
  fill('M10.25 14.15h3.5v1.7c-1.1.6-2.4.6-3.5 0z', 'shadow', 0.22)
  line('M10.1 16.7c.5.9 1.1 1.3 1.9 1.3s1.4-.4 1.9-1.3', 'c4', 0.75)
  // ears and face
  form(E(7.1, 11, 0.95, 1.3), 'c1', 'wm-k', 1)
  fill(E(7.1, 11.1, 0.42, 0.7), 'shadow', 0.16)
  form(E(16.9, 11, 0.95, 1.3), 'c1', 'wm-k', 1)
  fill(E(16.9, 11.1, 0.42, 0.7), 'shadow', 0.16)
  form('M16.95 10.1c-.05.65-.03.79-.22 1.41-.53 1.67-1.97 3.28-3.65 3.85-.48.17-.58.15-1.08.19-.5-.04-.6-.02-1.08-.19-1.68-.57-3.12-2.18-3.65-3.85-.19-.62-.17-.76-.22-1.41.04-.63.02-.8.17-1.41.38-1.56 1.41-2.95 2.89-3.63.62-.28 1.22-.36 1.89-.41.67.05 1.27.13 1.89.41 1.48.68 2.51 2.07 2.89 3.63.15.61.13.78.17 1.41z', 'c1')
  fill(E(10.1, 11.3, 1.6, 1.3), 'shine', 0.12, 'wm-shine')
  fill(E(9.25, 12.4, 1.03, 0.63), 'accent', 0.22)
  fill(E(14.75, 12.4, 1.03, 0.63), 'accent', 0.22)
  for (const x of [10.05, 13.95]) {
    fill(E(x, 10.65, 0.6, 0.78), 'ink')
    fill(E(x - 0.18, 10.37, 0.22), 'shine', 0.95, 'wm-shine')
    line(`M${r2(String(x - 0.85))} 9.13q0.85 -0.5 1.7 0`, 'c2', 0.5, 0.95)
  }
  line('M11.6 12.55q0.5 0.42 1 0', 'shadow', 0.42, 0.28)
  fill(E(11.95, 11.8, 0.32, 0.4), 'shine', 0.35, 'wm-shine')
  fill('M10.7 13.65q1.3 1.37 2.6 0q-1.3 0.49 -2.6 0z', 'ink', 0.85)
  fill('M11.29 14.12q0.72 0.42 1.43 0q-0.72 -0.16 -1.43 0z', 'accent', 0.7)
  // short hair, the fringe swept from the crown down to the left temple
  form('M7.05 10.6C6.4 6.1 8.8 3.8 12.2 3.8s5.6 2.4 4.8 6.6c-.3-1.6-.9-2.7-1.8-3.4-1.2 1.1-3 1.4-4.9 1.5-1.6.1-2.7.8-3.25 2.1z', 'c2', 'wm-a')
  line('M15.4 5.5c-1.2 1.4-3 2.2-5 2.4', 'shine', 0.5, 0.2, 'wm-shine')
  line('M8.6 5.6c1.4-.9 3.2-1.1 4.8-.6', 'shine', 0.6, 0.32, 'wm-shine')
  return out
}
