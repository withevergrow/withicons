// forge/hand/soft3d/avatar-person-wheelchair.mjs: hand-drawn soft 3D avatar-person-wheelchair to the redesigned skeleton (role fill plus volume overlay, sibling painter recipe).
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
  const { out, form, fill, line, shadow } = painter(icon?.name || 'avatar-person-wheelchair', { ink: '#262A33', c1: '#DDA176', c2: '#2A2120', c3: '#5A6170', c4: '#22A495', accent: '#F06A6A', shadow: '#22202A', shine: '#FFFFFF' })
  shadow(12, 9)
  line('M11.2 7.6V12.5H14.5L18.3 16.8', 'c4', 2.7)
  line('M11.2 8.4V12.5', 'shine', 0.7, 0.3, 'wm-shine')
  line('M13 19.5H18', 'c3', 1.3)
  line('M9.6 7.9L8.4 9.1V12.8', 'c1', 1.7)
  line(E(9, 16.5, 4.6), 'c3', 1.7, 1, 'wm-a')
  line(E(9, 16.5, 4.6), 'shine', 0.5, 0.25, 'wm-shine')
  line('M9 12.6V20.4M5.1 16.5H12.9', 'c3', 0.45, 0.6, 'wm-a')
  form(E(9, 16.5, 1), 'c3', 'wm-a', 1)
  form(E(19.5, 19.5, 1.6), 'c3', 'wm-a', 1)
  fill(E(19.5, 19.5, 0.55), 'shine', 0.5, 'wm-shine')
  form(E(11, 4, 2.1), 'c1', 'wm-k', 1)
  fill('M8.95 3.7C8.9 2.4 9.9 1.85 11 1.85s2.2.6 2.05 1.95c-.6-.7-1.3-.9-2-.9s-1.5.2-2.1.8z', 'c2')
  fill(E(10.3, 3.6, 0.6, 0.45), 'shine', 0.3, 'wm-shine')
  return out
}
