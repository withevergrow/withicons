// forge/hand/soft3d/avatar-woman-bun.mjs: hand-drawn soft 3D avatar-woman-bun to the redesigned skeleton (role fill plus volume overlay, sibling painter recipe).
const r2 = s => s.replace(/(\d+\.\d{2})\d+/g, '$1')
const E = (cx, cy, rx, ry = rx) => r2(`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`)
function painter(name, BASE) {
  const col = r => `var(--with-soft3d-${r}, ${BASE[r]})`
  const id = k => `wg-soft3d-${name}-${k}`
  const stop = (o, r, op) => ['stop', { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  const out = [['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.36, cy: 0.3, r: 0.8 }, [stop(0, 'shine', 0.5), stop(0.36, 'shine', 0.06), stop(0.66, 'shadow', 0), stop(1, 'shadow', 0.3)]],
    ['radialGradient', { id: id(1), cx: 0.38, cy: 0.28, r: 0.85 }, [stop(0, 'shine', 0.3), stop(0.45, 'shine', 0), stop(0.75, 'shadow', 0), stop(1, 'shadow', 0.2)]],
  ]]]
  const P = (d, a, cls = 'wm-k') => out.push(['path', { d, ...a, class: cls }])
  const form = (d, role, cls = 'wm-k', g = 0) => { P(d, { fill: col(role) }, cls); P(d, { fill: `url(#${id(g)})` }, cls) }
  const fill = (d, role, op = 1, cls = 'wm-k') => P(d, op === 1 ? { fill: col(role) } : { fill: col(role), 'fill-opacity': op }, cls)
  const line = (d, role, w, op = 1, cls = 'wm-k') => P(d, { fill: 'none', stroke: col(role), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(op === 1 ? {} : { 'stroke-opacity': op }) }, cls)
  const shadow = (cx, w) => { fill(E(cx, 22.4, w, 0.9), 'shadow', 0.07, 'wm-shadow'); fill(E(cx, 22.4, w * 0.72, 0.65), 'shadow', 0.1, 'wm-shadow') }
  return { out, form, fill, line, shadow }
}

export default function render(icon) {
  const { out, form, fill, line, shadow } = painter(icon?.name || 'avatar-woman-bun', { ink: '#2A2226', c1: '#E8B48C', c2: '#5A3426', accent: '#F06A6A', shadow: '#2A1E1C', shine: '#FFFFFF' })
  shadow(12, 6)
  form(E(12, 4.75, 2.3), 'c2', 'wm-a', 1)
  form('M6.9 12.2C6.5 17.75 9 21.5 12 21.5s5.5-3.75 5.1-9.3C16.6 9.6 14.6 8.4 12 8.4S7.4 9.6 6.9 12.2z', 'c1')
  fill(E(9.25, 17.2, 1.05, 0.65) + E(14.75, 17.2, 1.05, 0.65), 'accent', 0.22)
  for (const x of [9.9, 14.1]) {
    fill(E(x, 15.6, 0.62, 0.8), 'ink')
    fill(E(x - 0.18, 15.32, 0.22), 'shine', 0.95, 'wm-shine')
  }
  fill('M10.7 18.4q1.3 1.37 2.6 0q-1.3 0.49 -2.6 0z', 'ink', 0.85)
  form('M5.75 14.5C5 9.5 8 7 12 7s7 2.5 6.25 7.5c-.5-1.25-1.5-1.75-3.25-2.25-1.5-.5-2.75-1.25-3.25-2.25-.5 1.5-2.25 2.75-4.25 2.75-.75 0-1.25.75-1.75 1.75z', 'c2', 'wm-a')
  line('M8.2 9.3c1.2-.9 2.6-1.2 4-1.1', 'shine', 0.6, 0.3, 'wm-shine')
  fill(E(11.3, 4, 0.7, 0.5), 'shine', 0.3, 'wm-shine')
  return out
}
