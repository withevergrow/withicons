// forge/hand/soft3d/avatar-teen.mjs: the teen after the skeleton redesign: a purple soft 3D hoodie with the hood up,
// a shaded hood opening that frames a deep-brown face, a dark side-swept fringe peeking out under the hood and two
// cream drawstrings. The lit face sits on its own inside the rim so it never reads as an empty hood.
const BASE = { ink: '#2A2226', c1: '#7B4B2C', c2: '#8A66DE', accent: '#F06A6A', edge: '#FFF8EE', shadow: '#2A1E1C', shine: '#FFFFFF' }
const r2 = s => s.replace(/(\d+\.\d{2})\d+/g, '$1')
const E = (cx, cy, rx, ry = rx) => r2(`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`)

export default function render(icon) {
  const name = icon?.name || 'avatar-teen'
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

  const dy = 1.4
  const M = (x, y) => r2(`M${x} ${y + dy}`)
  fill(E(12.3, 22.5, 7.6, 0.9), 'shadow', 0.07, 'wm-shadow')
  fill(E(12.3, 22.5, 5.47, 0.65), 'shadow', 0.1, 'wm-shadow')
  // the hoodie: hood up around the head, shoulders below
  form('M4 22.6C4 20.4 4.5 18.9 5.75 17.9 4.25 16.1 3.5 13.8 3.5 11.8 3.5 7 7 3.3 12 2.3c5 1 8.5 4.7 8.5 9.5 0 2-.75 4.3-2.25 6.1 1.25 1 1.75 2.5 1.75 4.7z', 'c2')
  line('M5.75 17.9c1.6 1.2 3.8 1.9 6.25 1.9s4.65-.7 6.25-1.9', 'shadow', 0.55, 0.18)
  // hood opening: a shaded rim with the face inside
  line('M5.9 15.4c-.9-3.9.6-8.6 6.1-9.6', 'shine', 0.5, 0.25, 'wm-shine')
  fill(E(12, 12.3, 5.6, 5.85), 'shadow', 0.34)
  // face
  form(M(16.95, 10.1) + 'c-.05.65-.03.79-.22 1.41-.53 1.67-1.97 3.28-3.65 3.85-.48.17-.58.15-1.08.19-.5-.04-.6-.02-1.08-.19-1.68-.57-3.12-2.18-3.65-3.85-.19-.62-.17-.76-.22-1.41.04-.63.02-.8.17-1.41.38-1.56 1.41-2.95 2.89-3.63.62-.28 1.22-.36 1.89-.41.67.05 1.27.13 1.89.41 1.48.68 2.51 2.07 2.89 3.63.15.61.13.78.17 1.41z', 'c1')
  fill(E(10.1, 11.3 + dy, 1.6, 1.3), 'shine', 0.12, 'wm-shine')
  fill(E(9.25, 12.4 + dy, 1.03, 0.63), 'accent', 0.3)
  fill(E(14.75, 12.4 + dy, 1.03, 0.63), 'accent', 0.3)
  for (const x of [10.05, 13.95]) {
    fill(E(x, 10.65 + dy, 0.6, 0.78), 'ink')
    fill(E(x - 0.18, 10.37 + dy, 0.22), 'shine', 0.95, 'wm-shine')
  }
  line(M(11.6, 12.55) + 'q0.5 0.42 1 0', 'shadow', 0.42, 0.35)
  fill(E(11.95, 11.8 + dy, 0.32, 0.4), 'shine', 0.3, 'wm-shine')
  fill(M(10.7, 13.65) + 'q1.3 1.37 2.6 0q-1.3 0.49 -2.6 0z', 'ink', 0.85)
  fill(M(11.29, 14.12) + 'q0.72 0.42 1.43 0q-0.72 -0.16 -1.43 0z', 'accent', 0.7)
  // dark hair peeking out under the hood, a fringe swept to one side
  form('M7.1 11.9C6.9 8.6 9 6.4 12 6.4s5.1 2.2 4.9 5.3c-1.3-.4-2.5-1.2-3.2-2.3-1.4 1.6-3.7 2.4-6.6 2.5z', 'ink', 'wm-a', 1)
  line('M9.2 7.7c1-.6 2.2-.8 3.3-.6', 'shine', 0.5, 0.3, 'wm-shine')
  // hood shine and drawstrings with tips
  line('M6.4 6.4c1.2-1.6 2.9-2.7 4.8-3.2', 'shine', 0.7, 0.4, 'wm-shine')
  line('M10 18.6v2M14 18.6v2', 'edge', 0.6, 1, 'wm-s')
  fill(E(10, 20.8, 0.42, 0.5), 'edge', 1, 'wm-s')
  fill(E(14, 20.8, 0.42, 0.5), 'edge', 1, 'wm-s')
  return out
}
