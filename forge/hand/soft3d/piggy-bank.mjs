// forge/hand/soft3d/piggy-bank.mjs: hand-drawn soft 3D piggy-bank to the redesigned skeleton (role fill plus volume overlay, sibling painter recipe).
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
  const { out, form, fill, line, shadow } = painter(icon?.name || 'piggy-bank', { ink: '#4A1A2A', c1: '#F7A8C0', c2: '#E8608A', c3: '#F5B82E', accent: '#E89A1C', shadow: '#7F3550', shine: '#FFFFFF' })
  shadow(11.8, 8)
  line('M4.4 12.9C2.8 13 2.2 11.1 3.2 10.4c.9-.5 1.7.5 1 1.2', 'c2', 0.95)
  form('M7.3 17.6h2.4v2.9a1.2 1.2 0 0 1-2.4 0z M13.1 17.6h2.4v2.9a1.2 1.2 0 0 1-2.4 0z', 'c1')
  form(E(11.4, 14, 7.2, 6), 'c1')
  form('M14.3 9.1L17.8 6.9L17.6 11z', 'c1', 'wm-a')
  fill('M15.3 9.3L17.2 8.1L17.1 10.2z', 'c2', 0.8, 'wm-a')
  form('M17.9 12.2h2.1a1.1 1.1 0 0 1 1.1 1.1v1.5a1.1 1.1 0 0 1-1.1 1.1h-2.1z', 'c2', 'wm-k', 1)
  fill(E(19.2, 14.05, 0.3, 0.55) + E(20.25, 14.05, 0.3, 0.55), 'ink', 0.8)
  fill(E(15.55, 12, 0.62, 0.75), 'ink')
  fill(E(15.35, 11.75, 0.22), 'shine', 0.95, 'wm-shine')
  fill(E(14.6, 14.4, 0.95, 0.6), 'c2', 0.4)
  line('M9.2 9.15h4.2', 'ink', 0.9, 0.85)
  fill(E(7.6, 10.9, 1.7, 0.9), 'shine', 0.5, 'wm-shine')
  form(E(11.3, 5.2, 1.9, 2.2), 'c3', 'wm-s')
  line(E(11.3, 5.2, 1.1, 1.35), 'accent', 0.45, 1, 'wm-s')
  fill(E(10.7, 4.4, 0.35, 0.55), 'shine', 0.6, 'wm-shine')
  return out
}
