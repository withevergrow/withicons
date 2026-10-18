// forge/hand/soft3d/avatar-penguin.mjs: front-facing penguin bust, slate body with a light rim so it holds on dark, white face mask, orange beak.
const BASE = { ink: '#262A33', c1: '#4A5872', c2: '#F5A33A', c3: '#F4F6FA', c4: '#7FB3E8', accent: '#F36F7F', edge: '#FFFFFF', shadow: '#22202A', shine: '#FFFFFF' }
const r2 = v => +(+v).toFixed(2)
const E = (cx, cy, rx, ry = rx) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`
const mk = (name, BASE) => {
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
  return { out, form, fill, line }
}
export default function render(icon) {
  const { out, form, fill, line } = mk(icon?.name || 'avatar-penguin', BASE)
  // shoulders / flippers
  form('M4.6 22.6c0-3.6 2.4-5.6 5-5.9h4.8c2.6.3 5 2.3 5 5.9z', 'c1')
  form('M9.2 22.6c0-2.4 1.2-4.4 2.8-4.4s2.8 2 2.8 4.4z', 'c3', 'wm-k', 1)
  // head
  form(E(12, 10.6, 6, 5.9), 'c1')
  line('M7.2 6.6c1.2-1.4 2.9-2.1 4.8-2.1', 'edge', 0.7, 0.55, 'wm-shine')
  line(`M6.15 11.8a6 5.9 0 0 0 11.7 0`, 'edge', 0.45, 0.3)
  // white face mask (two lobes)
  form('M12 8.6c-.9-1.3-2.4-1.9-3.6-1.4-1.6.7-2.1 2.6-1.7 4.6.6 2.8 2.8 4.4 5.3 4.4s4.7-1.6 5.3-4.4c.4-2-.1-3.9-1.7-4.6-1.2-.5-2.7.1-3.6 1.4z', 'c3', 'wm-k', 1)
  // eyes
  for (const x of [9.6, 14.4]) { fill(E(x, 10.3, 0.85, 1), 'ink'); fill(E(x + 0.25, 9.95, 0.3), 'shine', 0.95, 'wm-shine') }
  // beak
  form('M10.6 12.3h2.8c.3 0 .4.3.2.5L12.3 14c-.2.2-.4.2-.6 0l-1.3-1.2c-.2-.2-.1-.5.2-.5z', 'c2', 'wm-a', 1)
  // cheeks
  fill(E(8.6, 12.6, 0.8, 0.5), 'accent', 0.3); fill(E(15.4, 12.6, 0.8, 0.5), 'accent', 0.3)
  return out
}
